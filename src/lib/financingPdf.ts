import logoImg from "../imports/LOGO_QUIROGA_AUTOMOVILES.png";

const LOGO_ASPECT = 8153 / 1909;
// The source logo is a ~8000px-wide export; downscale before embedding so the
// PDF doesn't carry megabytes of pixel data for a 150pt-wide image.
const LOGO_MAX_WIDTH_PX = 500;

async function logoToDataURL(): Promise<string> {
  const res = await fetch(logoImg);
  const blob = await res.blob();
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, LOGO_MAX_WIDTH_PX / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

export interface FinanciacionPdfRow {
  cuotas: number;
  cuota: number;
}

export interface FinanciacionPdfData {
  montoBase: number;
  incluyeTitulos: boolean;
  filasUSD: FinanciacionPdfRow[];
  filasUYU: FinanciacionPdfRow[];
}

const fmt = (n: number) => n.toLocaleString("es-UY");

function drawTable(
  doc: import("jspdf").jsPDF,
  title: string,
  rows: FinanciacionPdfRow[],
  symbol: string,
  x: number,
  y: number,
  width: number
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(9, 54, 179);
  doc.text(title, x, y);
  y += 16;

  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text("CUOTAS", x, y);
  doc.text("CUOTA/MES", x + width, y, { align: "right" });
  y += 8;
  doc.setDrawColor(229, 231, 235);
  doc.line(x, y, x + width, y);
  y += 14;

  doc.setFont("helvetica", "normal");
  rows.forEach((row) => {
    doc.setFontSize(10);
    doc.setTextColor(13, 13, 20);
    doc.text(`${row.cuotas}x`, x, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(9, 54, 179);
    doc.text(`${symbol} ${fmt(row.cuota)}`, x + width, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    y += 18;
  });

  return y;
}

export async function buildFinanciacionPdf(data: FinanciacionPdfData): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 56;
  try {
    const logoDataUrl = await logoToDataURL();
    const logoW = 150;
    const logoH = logoW / LOGO_ASPECT;
    doc.addImage(logoDataUrl, "PNG", (pageWidth - logoW) / 2, y, logoW, logoH);
    y += logoH + 28;
  } catch {
    y += 10;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(13, 13, 20);
  doc.text("Simulación de Financiación Propia", pageWidth / 2, y, { align: "center" });
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  const montoLabel = `Monto a financiar: USD ${fmt(data.montoBase)}${data.incluyeTitulos ? " (incluye costo de títulos)" : ""}`;
  doc.text(montoLabel, pageWidth / 2, y, { align: "center" });
  y += 36;

  const colWidth = (pageWidth - 80) / 2 - 16;
  const leftX = 40;
  const rightX = leftX + colWidth + 32;
  const tablesStartY = y;

  const yAfterUSD = drawTable(doc, "FINANCIACIÓN EN DÓLARES", data.filasUSD, "USD", leftX, tablesStartY, colWidth);
  const yAfterUYU = drawTable(doc, "FINANCIACIÓN EN PESOS", data.filasUYU, "$", rightX, tablesStartY, colWidth);
  y = Math.max(yAfterUSD, yAfterUYU) + 24;

  doc.setDrawColor(245, 158, 11);
  doc.setFillColor(255, 251, 240);
  const disclaimerY = y;
  doc.roundedRect(40, disclaimerY, pageWidth - 80, 44, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(234, 88, 12);
  doc.text(
    "*Valor aproximado de la cuota. Los montos finales pueden variar y están sujetos a confirmación al",
    pageWidth / 2,
    disclaimerY + 18,
    { align: "center" }
  );
  doc.text("momento de la firma.", pageWidth / 2, disclaimerY + 31, { align: "center" });
  y = disclaimerY + 60;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-UY")} — Quiroga Automóviles`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  return doc.output("blob");
}
