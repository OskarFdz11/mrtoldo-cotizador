"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";

export type CustomerFormState = {
  message: string | null;
  success: boolean;
  errors: {
    name?: string[];
    lastname?: string[];
    email?: string[];
    company?: string[];
    rfc?: string[];
    phone?: string[];
  };
};

const CreateCustomer = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  email: z.string().optional(),
  company: z.string().optional(),
  rfc: z.string().optional(),
  phone: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.bigint().optional(),
  ),
});

const UpdateCustomer = z.object({
  name: z.string().min(1, "Name is required."),
  lastname: z.string().min(1, "Lastname is required."),
  email: z.string().optional(),
  company: z.string().optional(),
  rfc: z.string().optional(),
  phone: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.coerce.bigint().optional(),
  ),
});

export const createCustomer = async (
  prevState: CustomerFormState,
  formData: FormData,
) => {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create customer.",
      success: false,
    };
  }

  const { name, lastname, email, company, rfc, phone } = validatedFields.data;

  try {
    await prisma.customer.create({
      data: {
        name,
        lastname,
        email: email?.trim() || "",
        company: company?.trim() || "",
        rfc: rfc?.trim() || "",
        phone: phone || BigInt(0),
      },
    });
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
    return {
      message: "Customer created successfully.",
      errors: {},
      success: true,
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to create customer.",
      errors: { ...prevState.errors },
      success: false,
    };
  }
};

export const updateCustomer = async (
  id: number | string,
  prevState: CustomerFormState,
  formData: FormData,
): Promise<CustomerFormState> => {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    company: formData.get("company"),
    rfc: formData.get("rfc"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update customer.",
      success: false,
    };
  }

  const { name, lastname, email, company, rfc, phone } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        lastname,
        email: email?.trim() || "",
        company: company?.trim() || "",
        rfc: rfc?.trim() || "",
        phone: phone || BigInt(0),
      },
    });
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/quotations");
    revalidatePath("/dashboard/quotations/create");
    revalidatePath("/dashboard/quotations/[id]/edit", "page");
    return {
      message: "Customer updated successfully.",
      errors: {},
      success: true,
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to update customer.",
      errors: { ...prevState.errors },
      success: false,
    };
  }
};

export const deleteCustomer = async (id: number | string) => {
  "use server";
  try {
    await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        deleted_at: new Date(),
      },
    });
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/quotations");
  } catch (error) {
    console.error("Database Error:", error);
  }
};
