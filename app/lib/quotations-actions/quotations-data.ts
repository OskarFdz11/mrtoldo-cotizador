"use server";

import { formatCurrency } from "../utils";
import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchRevenue() {
  noStore();
  try {
    const data = await prisma.quotation.findMany({
      select: {
        total: true,
        date: true,
        status: true,
      },
      where: {
        deleted_at: null,
        date: {
          gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
        },
      },
      orderBy: { date: "desc" },
    });

    // Convertir Decimals a números y agrupar por mes
    const monthlyRevenue = data.reduce(
      (acc: { [key: string]: number }, quotation) => {
        const total = Number(quotation.total);
        const month = quotation.date.toLocaleDateString("es-ES", {
          month: "short",
          year: "numeric",
        });

        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += total;

        return acc;
      },
      {}
    );

    // Convertir a array y ordenar por fecha
    const processedData = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month,
        revenue: revenue as number,
      }))
      .slice(0, 12); // Últimos 12 meses

    console.log("Monthly revenue data:", processedData);
    return processedData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestQuotations() {
  noStore();
  try {
    const data = await prisma.quotation.findMany({
      orderBy: { date: "desc" },
      take: 5,
      where: { deleted_at: null },
      include: {
        customer: true,
      },
    });

    const latestQuotations = data.map((quotation) => ({
      ...quotation,
      subtotal: Number(quotation.subtotal),
      total: Number(quotation.total),
    }));

    return latestQuotations;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function fetchCardData() {
  noStore();
  try {
    const [quotationsCount, customer, paid, pending] = await Promise.all([
      prisma.quotation.count(),
      prisma.customer.count(),
      prisma.quotation.aggregate({
        _sum: { total: true },
        where: { status: "paid", deleted_at: null },
      }),
      prisma.quotation.aggregate({
        _sum: { total: true },
        where: { status: "pending", deleted_at: null },
      }),
    ]);

    const numberOfQuotations = Number(quotationsCount ?? "0");
    const numberOfCustomers = Number(customer ?? "0");
    const totalPaidQuotations = Number(paid._sum.total ?? "0");
    const totalPendingQuotations = Number(pending._sum.total ?? "0");

    return {
      numberOfCustomers,
      numberOfQuotations,
      totalPaidQuotations,
      totalPendingQuotations,
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      numberOfCustomers: 0,
      numberOfQuotations: 0,
      totalPaidQuotations: 0,
      totalPendingQuotations: 0,
    };
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredQuotations(
  query: string,
  currentPage: number
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filteredQuotations = await prisma.quotation.findMany({
      where: {
        deleted_at: null,
        OR: [
          {
            customer: {
              name: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
          },
          {
            customer: {
              email: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
          },
          {
            customer: {
              company: { contains: query, mode: Prisma.QueryMode.insensitive },
            },
          },
          { total: { equals: Number(query) || undefined } },
          { status: { equals: query ? String(query) : undefined } },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            company: true,
          },
        },
      },
      orderBy: { date: "desc" },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });

    return filteredQuotations.map((quotation) => ({
      ...quotation,
      total: Number(quotation.total),
      subtotal: Number(quotation.subtotal),
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotations.");
  }
}
export async function fetchQuotationsPages(query: string) {
  const ITEMS_PER_PAGE = 6;

  const date = new Date(query);
  const isValidDate = !isNaN(date.getTime());

  const orConditions: any[] = [
    { deleted_at: null },
    {
      customer: {
        name: { contains: query, mode: Prisma.QueryMode.insensitive },
      },
    },
    {
      customer: {
        email: { contains: query, mode: Prisma.QueryMode.insensitive },
      },
    },
    { total: { equals: Number(query) || undefined } },
  ];

  if (query && isValidDate) {
    orConditions.push({ date: { equals: date } });
  }
  try {
    const count = await prisma.quotation.count({
      where: {
        OR: orConditions,
      },
    });
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchQuotationById(id: string | number) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: Number(id), deleted_at: null },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            company: true,
          },
        },
        billingDetails: {
          select: {
            id: true,
            name: true,
            lastname: true,
            company: true,
            email: true,
            phone: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                image_url: true,
                brand: true,
              },
            },
          },
        },
      },
    });

    if (!quotation) return null;

    return {
      ...quotation,
      subtotal: Number(quotation.subtotal),
      total: Number(quotation.total),
      products: quotation.products.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
      billingDetails: {
        ...quotation.billingDetails,
        phone: quotation.billingDetails.phone?.toString() || null,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotation.");
  }
}

export async function getQuotationDataForPDF(quotationId: number) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId, deleted_at: null },
      include: {
        customer: true,
        billingDetails: {
          include: {
            address: true,
          },
        },
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found");
    }

    return {
      quotation,
      customer: quotation.customer,
      billingDetails: quotation.billingDetails,
      products: quotation.products,
    };
  } catch (error) {
    console.error("Error fetching quotation data:", error);
    throw new Error("Failed to fetch quotation data");
  }
}
