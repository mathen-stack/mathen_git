import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

function slugify(name: string): string {
  return (name || "document")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}

export function downloadPdf(filename: string, title: string, content: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 54;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(title, margin, y);
  y += 22;

  doc.setFont("times", "normal");
  doc.setFontSize(11);

  const lines = content.split("\n");
  for (const raw of lines) {
    const line = raw.replace(/^#+\s*/, "").replace(/^[-*]\s*/, "• ");
    const wrapped = doc.splitTextToSize(line.length ? line : " ", maxWidth) as string[];
    for (const w of wrapped) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(w, margin, y);
      y += 14;
    }
  }

  doc.save(filename);
}

export function fileBase(fullName: string, company: string, kind: string) {
  const who = slugify(fullName) || "candidate";
  const where = slugify(company);
  return where ? `${who}-${where}-${kind}` : `${who}-${kind}`;
}
