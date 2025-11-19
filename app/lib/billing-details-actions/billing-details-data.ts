"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchBillingDetails() {
  noStore();
  try {
    const billingDetails = await prisma.billingDetails.findMany({
      where: { deleted_at: null },
      include: {
        address: true,
        quotations: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
        _count: {
          select: { quotations: true },
        },
      },
      orderBy: { id: "asc" },
    });

    // Convertir phone BigInt a string para serialización
    return billingDetails.map((detail) => ({
      ...detail,
      phone: detail.phone?.toString() || null,
      quotations: detail.quotations.map((q) => ({
        ...q,
        total:
          typeof q.total === "object" && "toNumber" in q.total
            ? q.total.toNumber()
            : Number(q.total),
      })),
    }));
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all billing details.");
  }
}

export async function fetchBillingDetailById(id: string) {
  noStore();
  try {
    const billingDetail = await prisma.billingDetails.findUnique({
      where: { id: Number(id), deleted_at: null },
      include: {
        address: true, // Incluir la dirección completa
        quotations: {
          select: {
            id: true,
            total: true,
            status: true,
            date: true,
          },
        },
      },
    });

    if (!billingDetail) return null;

    // Convertir phone BigInt a string
    return {
      ...billingDetail,
      phone: billingDetail.phone?.toString() || null,
      quotations: billingDetail.quotations.map((q) => ({
        ...q,
        total:
          typeof q.total === "object" && "toNumber" in q.total
            ? q.total.toNumber()
            : Number(q.total),
      })),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch billing detail.");
  }
}

export async function fetchFilteredBillingDetails(
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
        { company: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { rfc: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { clabe: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { checkAccount: { contains: q, mode: Prisma.QueryMode.insensitive } },
        {
          phone:
            hasQuery && !isNaN(Number(q)) ? { equals: BigInt(q) } : undefined,
        },
      ]
    : undefined;

  const where = {
    deleted_at: null,
    ...(orFilters ? { OR: orFilters } : {}),
  } as const;

  try {
    const [billingDetails, totalCount] = await Promise.all([
      prisma.billingDetails.findMany({
        where,
        orderBy: { id: "desc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.billingDetails.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // Convertir phone BigInt a string para serialización
    const serializedBillingDetails = billingDetails.map((detail) => ({
      ...detail,
      phone: detail.phone?.toString() || null,
    }));

    return {
      billingDetails: serializedBillingDetails,
      totalCount,
      totalPages,
    };
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch billing details table.");
  }
}

export async function fetchBillingDetailsField() {
  noStore();
  try {
    const billingDetails = await prisma.billingDetails.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        lastname: true,
        company: true,
        email: true,
        rfc: true,
        clabe: true,
        cardNumber: true,
        checkAccount: true,
        phone: true,
      },
      orderBy: { name: "asc" },
    });

    return billingDetails.map((billing) => ({
      ...billing,
      phone: billing.phone?.toString() || "",
      rfc: billing.rfc || "",
      clabe: billing.clabe || "",
      checkAccount: billing.checkAccount || "",
      cardNumber: billing.cardNumber || "",
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch billing details field.");
  }
}
