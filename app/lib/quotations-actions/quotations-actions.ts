"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { DuplicateQuotationResponse } from "../definitions";

// Schema para productos en la cotización
const QuotationProductSchema = z.object({
  productId: z.string().transform((val) => Number(val)), // Convertir string a number
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

const FormSchema = z.object({
  id: z.number(),
  customerId: z.string().transform((val) => Number(val)),
  billingDetailsId: z.string().transform((val) => Number(val)),
  iva: z.string().transform((val) => val === "true" || val === "on"),
  notes: z.string().optional().default(""),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select a valid status.",
  }),
  products: z.string(), // JSON array string
});

const CreateQuotation = FormSchema.omit({ id: true });
const UpdateQuotation = FormSchema.omit({ id: true });

export type State = {
  errors?: {
    products?: string[];
    customerId?: string[];
    billingDetailsId?: string[];
    iva?: string[];
    notes?: string[];
    status?: string[];
    inventory?: string[];
    general?: string[];
  };
  quotationId?: number;
  message: string;
  success: boolean;
};

// Utilidad: calculo subtotal
function calculateTotals(
  validatedProducts: { quantity: number; price: number }[],
  iva: boolean
) {
  const subtotal = validatedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const total = iva ? subtotal * 1.16 : subtotal;
  return { subtotal, total };
}

// ===== CREATE =====
export const createQuotation = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  console.log("=== FormData Debug ===");
  for (let [key, value] of formData.entries()) {
    console.log(key, ":", value);
  }

  const validatedFields = CreateQuotation.safeParse({
    customerId: formData.get("customerId"),
    billingDetailsId: formData.get("billingDetailsId"),
    iva: formData.get("iva"),
    notes: formData.get("notes") || "",
    status: formData.get("status"),
    products: formData.get("products"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create quotation.",
      success: false,
    };
  }

  const {
    customerId,
    billingDetailsId,
    iva,
    notes,
    status,
    products: productsJSON,
  } = validatedFields.data;

  let parsedProducts: any;
  try {
    parsedProducts = JSON.parse(productsJSON);
  } catch {
    return {
      errors: { products: ["Invalid products format"] },
      message: "Invalid products data.",
      success: false,
    };
  }

  if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
    return {
      errors: { products: ["At least one product is required"] },
      message: "At least one product is required.",
      success: false,
    };
  }

  const validProductsRaw = parsedProducts.filter(
    (p) => p.productId && p.productId !== ""
  );
  const productValidationResults = validProductsRaw.map((p: any) =>
    QuotationProductSchema.safeParse(p)
  );
  const hasProductErrors = productValidationResults.some((r) => !r.success);
  if (hasProductErrors) {
    const productErrors = productValidationResults
      .filter((r) => !r.success)
      .map((r) => r.error?.message || "Invalid product")
      .join(", ");
    return {
      errors: { products: [productErrors] },
      message: "Invalid product data.",
      success: false,
    };
  }

  const validatedProducts = productValidationResults
    .filter((r) => r.success)
    .map((r) => r.data!);

  const { subtotal, total } = calculateTotals(validatedProducts, iva);

  try {
    const quotation = await prisma.$transaction(async (tx) => {
      // INVENTARIO: si status === 'paid', verificar stock de todos los productos
      if (status === "paid") {
        // Obtener los productos actuales de DB en una sola query
        const dbProducts = await tx.product.findMany({
          where: { id: { in: validatedProducts.map((p) => p.productId) } },
          select: { id: true, quantity: true },
        });
        const stockMap = new Map(dbProducts.map((p) => [p.id, p.quantity]));

        const insufficient: {
          id: number;
          required: number;
          available: number;
        }[] = [];
        for (const line of validatedProducts) {
          const available = stockMap.get(line.productId) ?? 0;
          if (available < line.quantity) {
            insufficient.push({
              id: line.productId,
              required: line.quantity,
              available,
            });
          }
        }

        if (insufficient.length > 0) {
          return {
            abort: true,
            error: {
              inventory: [
                "Insufficient stock: " +
                  insufficient
                    .map(
                      (s) =>
                        `Product ${s.id} requires ${s.required} but only ${s.available} available`
                    )
                    .join("; "),
              ],
            },
          };
        }
      }

      // Crear cotización
      const newQuotation = await tx.quotation.create({
        data: {
          customerId,
          billingDetailsId,
          iva,
          subtotal,
          total,
          notes,
          status,
          date: new Date(),
        },
      });

      // Crear líneas
      await tx.quotationProduct.createMany({
        data: validatedProducts.map((product) => ({
          quotationId: newQuotation.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });

      // INVENTARIO: descuento sólo si pagada
      if (status === "paid") {
        for (const line of validatedProducts) {
          const updated = await tx.product.updateMany({
            where: {
              id: line.productId,
              // condición para simultaneidad: sólo actualizar si hay suficiente
              quantity: { gte: line.quantity },
            },
            data: {
              quantity: { decrement: line.quantity },
            },
          });
          if (updated.count === 0) {
            // Si falló una fila (stock cambiado por otra transacción) => lanzar error
            throw new Error(
              `Concurrent stock modification prevented fulfillment for product ${line.productId}`
            );
          }
        }
      }

      return newQuotation;
    });

    // Si transacción devolvió estructura de abort
    if ((quotation as any)?.abort) {
      return {
        errors: (quotation as any).error,
        message: "Inventory validation failed.",
        success: false,
      };
    }

    revalidatePath("/dashboard/quotations");
    return {
      errors: {},
      message: "Quotation created successfully!",
      success: true,
      quotationId: (quotation as any).id,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to create quotation.",
      success: false,
    };
  }
};

// ===== UPDATE =====
export const updateQuotation = async (
  id: string | number,
  prevState: State,
  formData: FormData
): Promise<State> => {
  const validatedFields = UpdateQuotation.safeParse({
    customerId: formData.get("customerId"),
    billingDetailsId: formData.get("billingDetailsId"),
    iva: formData.get("iva"),
    notes: formData.get("notes") || "",
    status: formData.get("status"),
    products: formData.get("products"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update quotation.",
      success: false,
    };
  }

  const {
    customerId,
    billingDetailsId,
    iva,
    notes,
    status,
    products: productsJSON,
  } = validatedFields.data;

  let parsedProducts: any;
  try {
    parsedProducts = JSON.parse(productsJSON);
  } catch {
    return {
      errors: { products: ["Invalid products format"] },
      message: "Invalid products data.",
      success: false,
    };
  }

  if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
    return {
      errors: { products: ["At least one product is required"] },
      message: "At least one product is required.",
      success: false,
    };
  }

  const validProductsRaw = parsedProducts.filter(
    (p) => p.productId && p.productId !== ""
  );
  const productValidationResults = validProductsRaw.map((p: any) =>
    QuotationProductSchema.safeParse(p)
  );
  const hasProductErrors = productValidationResults.some((r) => !r.success);
  if (hasProductErrors) {
    return {
      errors: { products: ["Invalid product data"] },
      message: "Invalid product data.",
      success: false,
    };
  }

  const validatedProducts = productValidationResults
    .filter((r) => r.success)
    .map((r) => r.data!);

  const { subtotal, total } = calculateTotals(validatedProducts, iva);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Obtener cotización actual con sus productos para detectar cambios de status y delta de stock
      const existing = await tx.quotation.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });

      if (!existing) {
        return { abort: true, error: { general: ["Quotation not found"] } };
      }

      const previousStatus = existing.status;

      // Calcular delta de stock si aplica
      // Escenarios:
      // 1. pending -> paid => descontar todos los nuevos productos
      // 2. paid -> paid => calcular diferencia entre nuevas líneas y las anteriores
      // 3. paid -> pending => (OPCIONAL) restaurar stock (comentado)
      // 4. pending -> pending => nada

      let stockChanges: { productId: number; delta: number }[] = [];

      if (previousStatus === "pending" && status === "paid") {
        stockChanges = validatedProducts.map((p) => ({
          productId: p.productId,
          delta: -p.quantity,
        }));
      } else if (previousStatus === "paid" && status === "paid") {
        // Construir mapa anterior
        const oldMap = new Map<number, number>();
        existing.products.forEach((p) => {
          oldMap.set(p.productId, p.quantity);
        });
        // Delta = nuevo - viejo (si aumenta => hay que descontar más; si disminuye => se podría devolver stock)
        validatedProducts.forEach((newLine) => {
          const oldQty = oldMap.get(newLine.productId) || 0;
          const diff = newLine.quantity - oldQty;
          if (diff !== 0) {
            stockChanges.push({ productId: newLine.productId, delta: -diff }); // diff positivo => descontar; negativo => devolver
          }
          oldMap.delete(newLine.productId);
        });
        // Si algún producto fue eliminado de la cotización y antes existía, devolver stock
        for (const [removedId, removedQty] of oldMap.entries()) {
          stockChanges.push({ productId: removedId, delta: removedQty }); // devolver lo que estaba
        }
      } else if (previousStatus === "paid" && status === "pending") {
        // (Opcional) restaurar stock completo de la cotización anterior
        // Activar sólo si tu modelo de negocio lo requiere:
        // stockChanges = existing.products.map(p => ({ productId: p.productId, delta: p.quantity }));
      }

      // Validar inventario si habrá descuentos (solo cuando hay delta negativo)
      const negativeAdjustments = stockChanges.filter((c) => c.delta < 0);
      if (negativeAdjustments.length > 0) {
        const dbProducts = await tx.product.findMany({
          where: { id: { in: negativeAdjustments.map((c) => c.productId) } },
          select: { id: true, quantity: true },
        });
        const stockMap = new Map(dbProducts.map((p) => [p.id, p.quantity]));

        const insufficient: {
          id: number;
          required: number;
          available: number;
        }[] = [];
        for (const adj of negativeAdjustments) {
          const available = stockMap.get(adj.productId) ?? 0;
          const required = Math.abs(adj.delta);
          if (available < required) {
            insufficient.push({ id: adj.productId, required, available });
          }
        }
        if (insufficient.length > 0) {
          return {
            abort: true,
            error: {
              inventory: [
                "Insufficient stock: " +
                  insufficient
                    .map(
                      (s) =>
                        `Product ${s.id} requires ${s.required} but only ${s.available} available`
                    )
                    .join("; "),
              ],
            },
          };
        }
      }

      // Actualizar la cotización
      await tx.quotation.update({
        where: { id: Number(id) },
        data: {
          customerId,
          billingDetailsId,
          iva,
          subtotal,
          total,
          notes,
          status,
        },
      });

      // Reemplazar productos
      await tx.quotationProduct.deleteMany({
        where: { quotationId: Number(id) },
      });
      await tx.quotationProduct.createMany({
        data: validatedProducts.map((p) => ({
          quotationId: Number(id),
          productId: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
      });

      // Aplicar cambios a stock
      for (const change of stockChanges) {
        if (change.delta < 0) {
          // Descontar (asegurando suficiencia)
          const updated = await tx.product.updateMany({
            where: {
              id: change.productId,
              quantity: { gte: Math.abs(change.delta) },
            },
            data: {
              quantity: { decrement: Math.abs(change.delta) },
            },
          });
          if (updated.count === 0) {
            throw new Error(
              `Concurrent stock modification prevented update for product ${change.productId}`
            );
          }
        } else if (change.delta > 0) {
          // Devolver stock (por reducción de cantidad o eliminación de línea)
          await tx.product.update({
            where: { id: change.productId },
            data: {
              quantity: { increment: change.delta },
            },
          });
        }
      }

      return { ok: true };
    });

    if ((result as any)?.abort) {
      return {
        errors: (result as any).error,
        message: "Inventory validation failed.",
        success: false,
      };
    }

    revalidatePath("/dashboard/quotations");
    return {
      errors: {},
      message: "Quotation updated successfully!",
      success: true,
      quotationId: Number(id),
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to update quotation.",
      success: false,
    };
  }
};

// ===== DUPLICATE =====
export const duplicateQuotation = async (
  id: string | number
): Promise<DuplicateQuotationResponse> => {
  "use server";
  try {
    const result = await prisma.$transaction(async (tx) => {
      const originalQuotation = await prisma.quotation.findUnique({
        where: { id: Number(id) },
        include: { products: true },
      });

      if (!originalQuotation) {
        return {
          errors: { general: ["Quotation not found"] },
          message: "Quotation not found",
          success: false as const,
        } as const;
      }

      // Duplicate as pending (no descuenta stock)
      const duplicated = await tx.quotation.create({
        data: {
          customerId: originalQuotation.customerId,
          billingDetailsId: originalQuotation.billingDetailsId,
          iva: originalQuotation.iva,
          subtotal: originalQuotation.subtotal,
          total: originalQuotation.total,
          notes: originalQuotation.notes,
          status: "pending",
          date: new Date(),
        },
      });

      if (originalQuotation.products.length > 0) {
        await tx.quotationProduct.createMany({
          data: originalQuotation.products.map((product) => ({
            quotationId: duplicated.id,
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
          })),
        });
      }

      return {
        errors: {},
        message: "Quotation duplicated successfully",
        success: true as const,
        quotationId: duplicated.id,
      } as const;
    });

    revalidatePath("/dashboard/quotations");
    return result;
  } catch (error) {
    console.error("Database Error:", error);
    return {
      errors: { general: ["Database error occurred"] },
      message: "Database Error: Failed to duplicate quotation",
      success: false as const,
    } as const;
  }
};

// ===== DELETE (soft) =====
export async function deleteQuotation(id: string | number) {
  "use server";
  try {
    await prisma.quotation.update({
      where: { id: Number(id) },
      data: { deleted_at: new Date() },
    });
    revalidatePath("/dashboard/quotations");
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete quotation");
  }
}
