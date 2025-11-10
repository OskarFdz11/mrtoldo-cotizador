import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { readFileSync } from "fs";
import { join } from "path";

// ================= Tipos =================
interface QuotationProduct {
  product: {
    id: number;
    name: string;
    brand: string;
    description: string;
    image_url: string;
  };
  quantity: number;
  price: number;
}

interface QuotationData {
  quotation: {
    id: number;
    date: string;
    subtotal: number;
    total: number;
    iva: boolean;
    notes?: string;
  };
  customer: {
    name: string;
    lastname: string;
    email: string;
    company: string;
    rfc: string;
    phone: string;
  };
  billingDetails?: {
    company?: string;
    rfc?: string;
    phone?: string;
    email?: string;
    cardNumber?: string;
    clabe?: string;
    checkAccount?: string;
    address?: {
      street?: string;
      outsideNumber?: string;
      colony?: string;
      city?: string;
      cp?: string;
    };
  };

  products: QuotationProduct[];
}

// ================= Utilidades =================
const M = 15; // margen lateral
const COLORS = {
  black: [25, 25, 25] as [number, number, number],
  dark: [45, 45, 45] as [number, number, number],
  gray700: [80, 80, 80] as [number, number, number],
  gray600: [120, 120, 120] as [number, number, number],
  gray500: [170, 170, 170] as [number, number, number],
  gray300: [215, 215, 215] as [number, number, number],
  gray250: [230, 230, 230] as [number, number, number],
  gray200: [238, 238, 238] as [number, number, number],
  gray150: [242, 242, 242] as [number, number, number],
  gray100: [247, 247, 247] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

function getLogoBase64(): string {
  try {
    const logoPath = join(process.cwd(), "public", "mrtoldo-logo.jpg");
    const logoBuffer = readFileSync(logoPath);
    return `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;
  } catch {
    return "";
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  if (!url) return "";
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    const type = res.headers.get("content-type") || "image/jpeg";
    return `data:${type};base64,${b64}`;
  } catch {
    return "";
  }
}

// ================= Helpers de dibujo =================
function sectionHeader(
  doc: jsPDF,
  title: string,
  y: number,
  height = 8
): number {
  const pw = doc.internal.pageSize.getWidth();
  doc.setFillColor(...COLORS.black);
  doc.rect(M, y, pw - 2 * M, height, "F");
  doc.setTextColor(...COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(title, M + 3, y + height - 2);
  doc.setTextColor(...COLORS.black);
  return y + height + 3;
}

function horizontalRule(doc: jsPDF, y: number) {
  const pw = doc.internal.pageSize.getWidth();
  doc.setDrawColor(...COLORS.black);
  doc.setLineWidth(1);
  doc.line(M, y, pw - M, y);
}

// ================= Generador principal =================
export async function generateQuotationPDF(
  data: QuotationData
): Promise<Uint8Array> {
  const { quotation, customer, billingDetails, products } = data;
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();

  let y = 15;

  // ============ ENCABEZADO COMPACTO ============
  const logo = getLogoBase64();
  if (logo) {
    try {
      doc.addImage(logo, "JPEG", M, y, 28, 20);
    } catch {
      doc.setFillColor(...COLORS.black);
      doc.rect(M, y, 28, 20, "F");
    }
  } else {
    doc.setFillColor(...COLORS.black);
    doc.rect(M, y, 28, 20, "F");
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("MRTOLDO S.A. DE C.V.", pw - M, y + 4, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("MRT180518HK0", pw - M, y + 10, { align: "right" });
  doc.text("81 8335-1041 y 81 1221-7917", pw - M, y + 15, { align: "right" });
  doc.text("carlos@mrtoldo.com", pw - M, y + 20, { align: "right" });
  doc.text("mrtoldo.com", pw - M, y + 25, { align: "right" });

  y += 32;
  horizontalRule(doc, y);
  y += 8;

  const formattedDate = new Date(quotation.date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // ============ COTIZACIÓN ============
  y = sectionHeader(doc, "Cotización", y);
  doc.setDrawColor(...COLORS.gray500);
  doc.rect(M, y, pw - 2 * M, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Número de Cotización: ${quotation.id}`, M + 4, y + 8);
  doc.text(`Fecha: ${formattedDate}`, pw - M - 4, y + 8, { align: "right" });
  y += 15;

  // ============ CLIENTE ============
  y = sectionHeader(doc, "Cliente", y);
  doc.setDrawColor(...COLORS.gray500);
  doc.rect(M, y, pw - 2 * M, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(
    `${customer.name} ${customer.lastname} (${customer.company})`,
    M + 4,
    y + 7
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Mail: ${customer.email}`, M + 4, y + 12);
  doc.text(`Teléfono: ${customer.phone}`, M + 4, y + 16);
  doc.text(`RFC: ${customer.rfc}`, pw / 2, y + 16);
  y += 23;

  // ============ PRODUCTOS ============
  y = sectionHeader(doc, "Productos", y);

  // Solo título en columna Producto (sin descripción)
  const tableBody = products.map((p) => [
    String(p.product.id),
    p.product.name, // <- solo título
    String(p.quantity),
    formatCurrency(p.price),
    "-",
    formatCurrency(p.price * p.quantity),
  ]);

  const available = pw - 2 * M;
  // Ajuste de anchos (ligeramente más ancho producto y cantidad para evitar wrap)
  const widths = {
    code: available * 0.08,
    product: available * 0.44,
    qty: available * 0.09,
    price: available * 0.14,
    offer: available * 0.08,
    total: available * 0.17,
  };

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    pageBreak: "avoid",
    styles: {
      font: "helvetica",
      fontSize: 7.5,
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
      lineColor: COLORS.gray500,
      lineWidth: 0.3,
      textColor: COLORS.black,
      valign: "middle",
    },
    headStyles: {
      fillColor: COLORS.black,
      textColor: COLORS.white,
      fontStyle: "bold",
      halign: "center",
      fontSize: 7, // headers más pequeños
      cellPadding: { top: 1.5, bottom: 1.5, left: 2, right: 2 },
    },
    bodyStyles: {
      fillColor: COLORS.white,
    },
    alternateRowStyles: {
      fillColor: COLORS.gray150,
    },
    columnStyles: {
      0: { cellWidth: widths.code, halign: "center" },
      1: { cellWidth: widths.product },
      2: { cellWidth: widths.qty, halign: "center" },
      3: { cellWidth: widths.price, halign: "right" },
      4: { cellWidth: widths.offer, halign: "center" },
      5: { cellWidth: widths.total, halign: "right" },
    },
    head: [["Código", "Producto", "Cantidad", "Precio", "Oferta", "Total"]],
    body: tableBody,
    willDrawCell: (data) => {
      if (data.row.section === "body" && data.cell.height < 8) {
        data.cell.height = 8;
      }
    },
    tableWidth: available,
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // ============ TOTALES ============
  const totalsW = 72;
  const totalsX = pw - M - totalsW;

  // Subtotal
  doc.setDrawColor(...COLORS.gray500);
  doc.setLineWidth(0.3);
  doc.rect(totalsX, y, totalsW, 7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Subtotal:", totalsX + 3, y + 4.6);
  doc.text(formatCurrency(quotation.subtotal), totalsX + totalsW - 3, y + 4.6, {
    align: "right",
  });
  y += 7;

  // IVA
  if (quotation.iva) {
    const ivaAmount = quotation.total - quotation.subtotal;
    doc.rect(totalsX, y, totalsW, 7);
    doc.text("IVA:", totalsX + 3, y + 4.6);
    doc.text(formatCurrency(ivaAmount), totalsX + totalsW - 3, y + 4.6, {
      align: "right",
    });
    y += 7;
  }

  // Total (negro con borde como header de la tabla)
  doc.setFillColor(...COLORS.black);
  doc.setDrawColor(...COLORS.gray500);
  doc.setLineWidth(0.3);
  doc.rect(totalsX, y, totalsW, 10, "FD"); // Fill + Draw (borde)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.white);
  doc.text("Total:", totalsX + 3, y + 6.8);
  doc.text(formatCurrency(quotation.total), totalsX + totalsW - 3, y + 6.8, {
    align: "right",
  });
  doc.setTextColor(...COLORS.black);
  y += 14;

  // ============ NOTAS (ANTES QUE DETALLES DE PAGO) ============
  // Margen para que no se empalme con los totales
  y += 6;

  if (quotation.notes) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Notas:", M, y);
    y += 4;

    const notesW = pw - 2 * M;
    const lines = doc.splitTextToSize(quotation.notes, notesW - 8);
    // Caja de notas con altura automática (capada a 36 para mantener compacto)
    const notesH = Math.min(lines.length * 3 + 8, 36);
    doc.setFillColor(...COLORS.gray150);
    doc.setDrawColor(...COLORS.gray300);
    doc.rect(M, y, notesW, notesH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(lines.slice(0, Math.floor((notesH - 8) / 3)), M + 3, y + 5);
    y += notesH + 10;
  }

  // ============ DETALLES DE PAGO (DESPUÉS DE NOTAS) ============
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Detalles de Pago:", M, y);
  y += 4;

  const addressParts = [
    billingDetails?.address?.street ?? "Calle Sembradores 248",
    billingDetails?.address?.colony ?? "Col. Leones",
    billingDetails?.address?.city ?? "Monterrey",
  ]
    .filter((p) => !!p && String(p).trim() !== "")
    .join(", ");

  const cpPart = billingDetails?.address?.cp ?? "64600";

  const payLines: string[] = [
    billingDetails?.company ?? "MRTOLDO S.A. DE C.V.",
    `RFC: ${billingDetails?.rfc ?? "MRT180518HK0"}`,
    ...(billingDetails?.cardNumber && billingDetails.cardNumber.trim() !== ""
      ? [`Número de Tarjeta: ${billingDetails.cardNumber}`]
      : []),
    ...(billingDetails?.clabe ? [`Clabe: ${billingDetails.clabe}`] : []),
    ...(billingDetails?.checkAccount
      ? [`Cuenta Cheques: ${billingDetails.checkAccount}`]
      : []),
    `${addressParts}${addressParts ? ", " : ""}CP ${cpPart}`,
    `Teléfono: ${billingDetails?.phone ?? "81 8335-1041 y 81 1221-7917"}`,
    billingDetails?.email ?? "carlos@mrtoldo.com",
  ];

  const payBoxH = payLines.length * 3 + 8;
  doc.setFillColor(...COLORS.gray150);
  doc.setDrawColor(...COLORS.gray500);
  doc.rect(M, y, pw - 2 * M, payBoxH, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  let py = y + 5;
  payLines.forEach((l) => {
    doc.text(l, M + 3, py);
    py += 3;
  });
  y += payBoxH;

  // ============ ESPECIFICACIONES DE PRODUCTOS (SIN CAMBIOS DE LAYOUT) ============
  for (const item of products) {
    doc.addPage();
    let yy = 20;

    // Header compacto
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Especificaciones del Producto", M, yy);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Cotización: ${quotation.id}`, pw - M, yy - 2, { align: "right" });
    doc.text(formattedDate, pw - M, yy + 4, { align: "right" });

    yy += 8;
    horizontalRule(doc, yy);
    yy += 12;

    // Layout horizontal: imagen a la izquierda, info a la derecha
    const frameW = 100;
    const frameH = 75;
    const frameX = M;
    const frameY = yy;

    (doc as any).setLineDashPattern?.([2, 3], 0);
    doc.setDrawColor(...COLORS.gray500);
    doc.rect(frameX, frameY, frameW, frameH);
    (doc as any).setLineDashPattern?.([], 0);

    // Imagen centrada
    const imgB64 = await fetchImageAsBase64(item.product.image_url);
    if (imgB64) {
      const maxInnerW = frameW - 16;
      const maxInnerH = frameH - 16;
      const originalW = 800;
      const originalH = 800;
      const ratio = Math.min(maxInnerW / originalW, maxInnerH / originalH);
      const drawW = originalW * ratio;
      const drawH = originalH * ratio;
      const imgX = frameX + (frameW - drawW) / 2;
      const imgY = frameY + (frameH - drawH) / 2;

      try {
        doc.addImage(imgB64, "JPEG", imgX, imgY, drawW, drawH);
      } catch {
        doc.setFillColor(...COLORS.gray150);
        doc.rect(frameX + 4, frameY + 4, frameW - 8, frameH - 8, "F");
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.gray600);
        doc.text(
          "Imagen no disponible",
          frameX + frameW / 2,
          frameY + frameH / 2,
          {
            align: "center",
          }
        );
        doc.setTextColor(...COLORS.black);
      }
    }

    // Panel de información a la derecha
    const panelX = frameX + frameW + 12;
    const panelW = pw - M - panelX;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const titleLines = doc.splitTextToSize(item.product.name, panelW);
    doc.text(titleLines, panelX, frameY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(item.product.brand, panelX, frameY + 20);

    doc.setFontSize(8);
    const descLines = doc.splitTextToSize(
      item.product.description.substring(0, 200),
      panelW
    );
    doc.text(descLines.slice(0, 4), panelX, frameY + 28);

    // Banner precio
    const bannerY = frameY + frameH - 12;
    doc.setFillColor(...COLORS.dark);
    doc.rect(panelX, bannerY, panelW, 12, "F");
    doc.setTextColor(...COLORS.white);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      formatCurrency(item.price) + " MXN",
      panelX + panelW / 2,
      bannerY + 8,
      { align: "center" }
    );
    doc.setTextColor(...COLORS.black);

    yy = frameY + frameH + 20;

    // Card de información (compacta)
    const cardW = pw - 2 * M;
    const cardH = 85;

    doc.setDrawColor(...COLORS.black);
    doc.setLineWidth(1);
    doc.rect(M, yy, cardW, cardH);

    let cardY = yy + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(item.product.name, M + 8, cardY);
    cardY += 8;

    doc.setDrawColor(...COLORS.black);
    doc.setLineWidth(0.5);
    doc.line(M + 8, cardY, pw - M - 8, cardY);
    cardY += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(item.product.brand.toUpperCase(), M + 8, cardY);
    cardY += 8;

    const descBoxH = 20;
    doc.setFillColor(...COLORS.gray150);
    doc.setDrawColor(...COLORS.gray300);
    doc.rect(M + 8, cardY, cardW - 16, descBoxH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const shortDesc = doc.splitTextToSize(item.product.description, cardW - 24);
    doc.text(shortDesc.slice(0, 3), M + 12, cardY + 4);
    cardY += descBoxH + 6;

    doc.setFillColor(...COLORS.black);
    doc.rect(M + 8, cardY, cardW - 16, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.white);
    doc.text(formatCurrency(item.price) + " MXN", M + cardW / 2, cardY + 8, {
      align: "center",
    });
    doc.setTextColor(...COLORS.black);

    yy += cardH + 12;

    // Header de info
    doc.setFillColor(...COLORS.gray150);
    doc.rect(M, yy, cardW, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INFORMACIÓN DEL PRODUCTO", M + 4, yy + 5);
    yy += 8;

    const infoData = [
      ["Código:", String(item.product.id), "Marca:", item.product.brand],
      [
        "Cantidad:",
        `${item.quantity} unidades`,
        "Precio Unit.:",
        formatCurrency(item.price),
      ],
      [
        "Total:",
        formatCurrency(item.price * item.quantity),
        "Cotización:",
        `#${quotation.id}`,
      ],
    ];

    const colWidth = cardW / 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    infoData.forEach((row) => {
      doc.setDrawColor(...COLORS.gray300);
      doc.rect(M, yy, cardW, 8);
      doc.text(row[0], M + 3, yy + 5);
      doc.text(row[1], M + colWidth - 3, yy + 5, { align: "right" });
      doc.text(row[2], M + colWidth + 3, yy + 5);
      doc.text(row[3], pw - M - 3, yy + 5, { align: "right" });
      yy += 8;
    });
  }

  return new Uint8Array(doc.output("arraybuffer"));
}
