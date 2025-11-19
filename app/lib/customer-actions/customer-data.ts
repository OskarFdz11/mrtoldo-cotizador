"use server";

import { formatCurrency } from "@/app/lib/utils";
import { prisma } from "@/app/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import { Prisma } from "@prisma/client";

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
  noStore();
  const ITEMS_PER_PAGE = 6;

  const q = (query ?? "").trim();
  const hasQuery = q.length > 0;

  const orFilters = hasQuery
    ? [
        { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { lastname: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { company: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { rfc: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ...(Number.isNaN(Number(q)) ? [] : [{ phone: { equals: Number(q) } }]),
      ]
    : undefined;

  // Misma condición para findMany y count
  const where = {
    deleted_at: null,
    ...(orFilters ? { OR: orFilters } : {}),
  } as const;

  try {
    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: { quotations: true },
        orderBy: { id: "desc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.customer.count({ where }),
    ]);

    const result = customers.map((customer) => {
      const total_quotations = customer.quotations.length;
      const total_pending = customer.quotations
        .filter((q) => q.status === "pending")
        .reduce((sum, q) => sum + Number(q.total), 0);
      const total_paid = customer.quotations
        .filter((q) => q.status === "paid")
        .reduce((sum, q) => sum + Number(q.total), 0);

      return {
        id: customer.id,
        name: customer.name,
        lastname: customer.lastname,
        company: customer.company,
        phone: customer.phone?.toString() ?? "",
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
    throw new Error("Failed to fetch filtered customers.");
  }
}
