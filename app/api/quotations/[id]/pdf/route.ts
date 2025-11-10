// app/api/quotations/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateQuotationPDF } from "@/app/lib/pdf-generator";
import { getQuotationDataForPDF } from "@/app/lib/quotations-actions/quotations-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quotationId = parseInt(params.id);

    if (isNaN(quotationId)) {
      return NextResponse.json(
        { error: "ID de cotización inválido" },
        { status: 400 }
      );
    }

    console.log("Generando PDF para cotización:", quotationId);

    const quotationData = await getQuotationDataForPDF(quotationId);

    const bd = quotationData.billingDetails;

    if (!quotationData) {
      return NextResponse.json(
        { error: "Cotización no encontrada" },
        { status: 404 }
      );
    }

    console.log("Datos obtenidos, generando PDF...", quotationData);

    // Convert Decimal values to numbers and format the data properly
    const formattedData = {
      quotation: {
        id: quotationData.quotation.id,
        date:
          quotationData.quotation.date instanceof Date
            ? quotationData.quotation.date.toISOString()
            : quotationData.quotation.date,
        subtotal: Number(quotationData.quotation.subtotal),
        total: Number(quotationData.quotation.total),
        iva: quotationData.quotation.iva,
        notes: quotationData.quotation.notes || undefined,
      },
      customer: {
        name: quotationData.customer.name,
        lastname: quotationData.customer.lastname,
        email: quotationData.customer.email,
        company: quotationData.customer.company,
        rfc: quotationData.customer.rfc,
        phone: String(quotationData.customer.phone),
      },
      billingDetails: bd
        ? {
            company: bd.company ?? undefined,
            rfc: bd.rfc ?? undefined,
            phone: bd.phone != null ? String(bd.phone) : undefined, // BigInt -> string
            email: bd.email ?? undefined,
            cardNumber: bd.cardNumber ?? undefined,
            clabe: bd.clabe ?? undefined,
            checkAccount: bd.checkAccount ?? undefined,
            address: bd.address
              ? {
                  street: bd.address.street ?? undefined,
                  outsideNumber: bd.address.outsideNumber ?? undefined,
                  colony: bd.address.colony ?? undefined,
                  city: bd.address.city ?? undefined,
                  cp: bd.address.cp ?? undefined,
                }
              : undefined,
          }
        : undefined,
      products: quotationData.products.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          description: item.product.description || "",
          image_url: item.product.image_url || "",
        },
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
    };

    console.log("Datos formateados, generando PDF...");
    const pdfBuffer = await generateQuotationPDF(formattedData);

    console.log("PDF generado exitosamente, tamaño:", pdfBuffer.length);

    // Retornar PDF
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cotizacion-${quotationId}.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 }
    );
  }
}
