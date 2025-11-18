"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  products: z.string(),
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
    general?: string[];
  };
  quotationId?: number;
  message: string;
  success: boolean;
};

export const createQuotation = async (prevState: State, formData: FormData) => {
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
    products: formData.get("products"), // JSON string
  });

  if (!validatedFields.success) {
    console.log(
      "Validation errors:",
      validatedFields.error.flatten().fieldErrors
    );
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

  let parsedProducts;
  try {
    parsedProducts = JSON.parse(productsJSON);
    console.log("Parsed products:", parsedProducts);
  } catch (error) {
    console.log("JSON parse error:", error);
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

  const validProducts = parsedProducts.filter(
    (p) => p.productId && p.productId !== ""
  );

  if (validProducts.length === 0) {
    return {
      errors: { products: ["At least one valid product is required"] },
      message: "At least one valid product is required.",
      success: false,
    };
  }

  const productValidationResults = validProducts.map((product, index) => {
    const result = QuotationProductSchema.safeParse(product);
    if (!result.success) {
      console.log(
        `Product ${index} validation error:`,
        result.error.flatten().fieldErrors
      );
    }
    return result;
  });

  const hasProductErrors = productValidationResults.some(
    (result) => !result.success
  );
  if (hasProductErrors) {
    const productErrors = productValidationResults
      .filter((result) => !result.success)
      .map((result) => result.error?.message || "Invalid product")
      .join(", ");

    return {
      errors: { products: [productErrors] },
      message: "Invalid product data.",
      success: false,
    };
  }

  const validatedProducts = productValidationResults
    .filter((result) => result.success)
    .map((result) => result.data!);

  const subtotal = validatedProducts.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  const total = iva ? subtotal * 1.16 : subtotal;

  console.log("=== Calculation Debug ===");
  console.log("Subtotal:", subtotal);
  console.log("IVA:", iva);
  console.log("Total:", total);
  console.log("Products to save:", validatedProducts);

  try {
    const quotation = await prisma.$transaction(async (tx) => {
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

      await tx.quotationProduct.createMany({
        data: validatedProducts.map((product) => ({
          quotationId: newQuotation.id,
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });

      console.log("Created quotation products");

      return newQuotation;
    });

    revalidatePath("/dashboard/quotations");
    return {
      errors: {},
      message: "Quotation created successfully!",
      success: true,
      quotationId: quotation.id,
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
export const updateQuotation = async (
  id: string | number,
  prevState: State,
  formData: FormData
): Promise<State> => {
  // Validar campos básicos
  const validatedFields = UpdateQuotation.safeParse({
    customerId: formData.get("customerId"),
    billingDetailsId: formData.get("billingDetailsId"),
    iva: formData.get("iva"),
    notes: formData.get("notes") || "",
    status: formData.get("status"),
    products: formData.get("products"), // JSON string
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

  // Parsear productos
  let parsedProducts;
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

  const validProducts = parsedProducts.filter(
    (p) => p.productId && p.productId !== ""
  );

  // Validar productos
  const productValidationResults = validProducts.map((product) =>
    QuotationProductSchema.safeParse(product)
  );

  const hasProductErrors = productValidationResults.some(
    (result) => !result.success
  );
  if (hasProductErrors) {
    return {
      errors: { products: ["Invalid product data"] },
      message: "Invalid product data.",
      success: false,
    };
  }

  const validatedProducts = productValidationResults
    .filter((result) => result.success)
    .map((result) => result.data!);

  // Calcular subtotal y total
  const subtotal = validatedProducts.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);

  const total = iva ? subtotal * 1.16 : subtotal;

  try {
    await prisma.$transaction(async (tx) => {
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

      // Eliminar productos existentes
      await tx.quotationProduct.deleteMany({
        where: { quotationId: Number(id) },
      });

      // Crear los nuevos productos
      await tx.quotationProduct.createMany({
        data: validatedProducts.map((product) => ({
          quotationId: Number(id),
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
        })),
      });
    });

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

export const duplicateQuotation = async (
  id: string | number
): Promise<DuplicateQuotationResponse> => {
  "use server";
  try {
    const result = await prisma.$transaction(async (tx) => {
      const originalQuotation = await prisma.quotation.findUnique({
        where: { id: Number(id) },
        include: {
          products: true,
        },
      });

      if (!originalQuotation) {
        return {
          errors: { general: ["Quotation not found"] },
          message: "Quotation not found",
          success: false as const,
        } as const;
      }

      const duplicatedQuotation = await tx.quotation.create({
        data: {
          customerId: originalQuotation.customerId,
          billingDetailsId: originalQuotation.billingDetailsId,
          iva: originalQuotation.iva,
          subtotal: originalQuotation.subtotal,
          total: originalQuotation.total,
          notes: originalQuotation.notes,
          status: "pending", // Reset status for duplicate
          date: new Date(),
        },
      });

      // Duplicate products
      if (originalQuotation.products.length > 0) {
        await tx.quotationProduct.createMany({
          data: originalQuotation.products.map((product) => ({
            quotationId: duplicatedQuotation.id,
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
        quotationId: duplicatedQuotation.id,
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
