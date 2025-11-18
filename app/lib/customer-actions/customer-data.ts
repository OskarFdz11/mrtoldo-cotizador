"use server";

import { formatCurrency } from "../utils";
import { prisma } from "@/app/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchCustomers() {
  noStore();
  try {
    const customers = await prisma.customer.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        company: true,
        rfc: true,
      },
      orderBy: { id: "desc" },
    });
    return customers.map((customer) => ({
      ...customer,
      phone: customer.phone?.toString() || "",
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id), deleted_at: null },
    });
    if (!customer) return null;
    return {
      ...customer,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch customer.");
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number
) {
  const ITEMS_PER_PAGE = 6;
  try {
    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where: {
          OR: [
            { deleted_at: null },
            { name: { contains: query, mode: "insensitive" } },
            { lastname: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { rfc: { contains: query, mode: "insensitive" } },
            { phone: { equals: Number(query) || undefined } },
          ],
        },
        include: {
          quotations: true,
        },
        orderBy: { id: "desc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.customer.count({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    const result = customers.map((customer) => {
      const total_quotations = customer.quotations.length;
      const total_pending = customer.quotations
        .filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + Number(inv.total), 0);
      const total_paid = customer.quotations
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + Number(inv.total), 0);

      return {
        id: customer.id,
        name: customer.name,
        lastname: customer.lastname,
        company: customer.company,
        phone: customer.phone,
        rfc: customer.rfc,
        email: customer.email,
        image_url: (customer as any).image_url,
        total_quotations,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { customers: result, totalPages };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
