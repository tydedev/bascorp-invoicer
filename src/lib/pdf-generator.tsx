import { Invoice } from "@/types/invoice";
import InterRegular from "../assets/fonts/Inter-Regular.base64";
import InterBold from "../assets/fonts/Inter-Bold.base64";
import InterSemibold from "../assets/fonts/Inter-Semibold.base64";
import logo from "../assets/logo.png";
import pattern from "../assets/pattern.png";
import corner from "../assets/corner.png";

export const generatePDF = async (invoice: Invoice) => {
  const { jsPDF } = await import("jspdf"); // dynamic import qui
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // --- FONTS ---
  doc.addFileToVFS("Inter-Regular.ttf", InterRegular);
  doc.addFont("Inter-Regular.ttf", "Inter", "normal");
  doc.addFileToVFS("Inter-Bold.ttf", InterBold);
  doc.addFont("Inter-Bold.ttf", "Inter", "bold");
  doc.addFileToVFS("Inter-Semibold.ttf", InterSemibold);
  doc.addFont("Inter-Semibold.ttf", "Inter", "semibold");

  // --- CONSTANTI PAGINA ---
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 10;
  const marginBottom = 20;
  let y = 32;

  // --- HEADER ---
  const drawHeader = (isFirstPage = false) => {
    const logoX = 10,
      logoY = 10,
      logoW = 9,
      logoH = 9;
    doc.addImage(logo, "PNG", logoX, logoY, logoW, logoH);

    const cornerX = pageWidth - 40,
      cornerY = 0,
      cornerW = 40,
      cornerH = 40;
    doc.addImage(corner, "PNG", cornerX, cornerY, cornerW, cornerH);

    doc.setFont("Inter", "bold");
    doc.setFontSize(18);
    doc.text("Bascorp.", logoX + logoW + 3, logoY + logoH - 2);

    // Info azienda lato destro SOLO PRIMA PAGINA
    if (isFirstPage) {
      doc.setFontSize(14);
      doc.setFont("Inter", "bold");
      doc.setTextColor("#525252");
      doc.text("Bascorp", 130, 20);
      doc.setTextColor("#ef4136");
      doc.text(".", 150, 20);
      doc.setFontSize(11);
      doc.setTextColor("#525252");
      doc.setFont("Inter", "semibold");
      doc.text("Cristian Basso", 130, 25);
      doc.setFont("Inter", "normal");
      doc.text("Via dello Sport, 11", 130, 30);
      doc.text("80059 Torre del Greco (NA)", 130, 35);
      doc.text("Tel: +39 333 454 7382", 130, 40);
      doc.text("P.IVA: 109351171214", 130, 45);
    }
  };

  // --- FOOTER ---
  const drawFooter = (pageNumber: number, totalPages: number) => {
    const logoX = 0; // attaccato a sinistra
    const logoY = pageHeight - 10; // leggermente sopra il margine inferiore
    const logoW = 5.4;
    const logoH = 9;

    doc.addImage(pattern, "PNG", logoX, logoY, logoW, logoH);

    doc.setFont("Inter", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#888888");
    doc.text(
      `Pagina ${pageNumber} di ${totalPages}`,
      pageWidth - marginX + 3,
      pageHeight - 7,
      { align: "right" }
    );
    doc.text(`www.bascorp.it`, marginX, pageHeight - 7, {
      align: "left",
    });
    doc.text(`info@bascorp.it`, marginX + 30, pageHeight - 7, {
      align: "left",
    });
    doc.text(`commerciale@bascorp.it`, marginX + 60, pageHeight - 7, {
      align: "left",
    });
  };

  // --- NUOVA PAGINA AUTOMATICA ---
  const checkAddPage = (heightNeeded: number) => {
    doc.setTextColor("#000");
    if (y + heightNeeded > pageHeight - marginBottom) {
      doc.addPage();
      drawHeader(false); // header senza info azienda
      y = 30;
      return true;
    }
    return false;
  };

  // --- INIZIO PDF ---
  drawHeader(true); // prima pagina completa

  // --- TITOLO DOCUMENTO ---
  doc.setFont("Inter", "bold");
  doc.setTextColor("#000");
  doc.setFontSize(13);
  if (invoice.isEstimate) doc.text("PREVENTIVO", marginX, y);
  else doc.text(`FATTURA N. ${invoice.invoiceNumber}`, marginX, y);
  y += 10;

  // --- DATA ---
  doc.setFontSize(11);
  doc.setFont("Inter", "bold");
  doc.text("Data:", marginX, y);
  doc.setFont("Inter", "normal");
  doc.text(`${new Date(invoice.date).toLocaleDateString()}`, marginX + 13, y);
  y += 20;

  // --- CLIENTE ---
  if (
    invoice.clientCompany ||
    invoice.clientName ||
    invoice.clientSurname ||
    invoice.clientStreet
  ) {
    doc.setFont("Inter", "bold");
    doc.text("Cliente:", marginX, y);
    y += 6;

    doc.setFont("Inter", "semibold");
    if (invoice.clientCompany) doc.text(invoice.clientCompany, marginX, y);
    if (invoice.clientName || invoice.clientSurname)
      doc.text(
        `${invoice.clientName ?? ""} ${invoice.clientSurname ?? ""}`.trim(),
        marginX,
        y + 5
      );
    y += 10;

    doc.setFont("Inter", "normal");
    if (invoice.clientStreet)
      doc.text(
        `${invoice.clientStreet}, ${invoice.clientStreetNumber ?? ""}`.trim(),
        marginX,
        y
      );
    if (invoice.clientPostalCode)
      doc.text(
        `${invoice.clientPostalCode} ${invoice.clientCity ?? ""} (${
          invoice.clientProvince ?? ""
        })`.trim(),
        marginX,
        y + 5
      );
    if (invoice.clientEmail) doc.text(invoice.clientEmail, marginX, y + 10);
    if (invoice.clientPhone)
      doc.text(`Tel: ${invoice.clientPhone}`, marginX, y + 15);
    if (invoice.clientVAT)
      doc.text(`P.IVA: ${invoice.clientVAT}`, marginX, y + 20);
    y += 30;
  }

  // --- OGGETTO ---
  doc.setFont("Inter", "bold");
  doc.text("Oggetto:", marginX, y);
  doc.setFont("Inter", "semibold");
  doc.text(`${invoice.jobType}`, marginX + 20, y);
  y += 10;

  // --- TABELLA ARTICOLI ---
  doc.setFont("Inter", "bold");
  doc.setFontSize(10);
  const tableX = marginX;
  const tableWidth = 190;
  const headers = ["N.", "Descrizione", "Q.tà", "Prezzo", "Importo"];
  const headerPos = [10, 23, 130, 155, 185];

  // intestazioni
  headers.forEach((h, i) => doc.text(h, headerPos[i], y));
  doc.setDrawColor("#888888");
  y += 3;
  doc.line(tableX, y, tableX + tableWidth, y);
  y += 5;

  invoice.items.forEach((item, index) => {
    doc.setFont("Inter", "normal");

    // descrizione multilinea
    const wrappedDesc = doc.splitTextToSize(item.description, 100);
    const rowHeight = wrappedDesc.length * 5 + 6; // altezza riga dinamica con padding

    // check per nuova pagina
    checkAddPage(rowHeight);

    doc.setFontSize(10);
    doc.setFont("Inter", "normal");

    // Numero riga
    doc.text(`${index + 1}.`, 10, y + 3);

    // Descrizione multilinea
    doc.text(wrappedDesc, 23, y + 3);

    // Quantità, Prezzo, Totale (allineati al centro della cella)
    const centerY = y + rowHeight / 2;
    doc.text(`${item.quantity ?? ""}${item.measure ?? ""}`, 137, centerY, {
      align: "right",
    });
    doc.text(
      `€${item.price.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      167,
      centerY,
      { align: "right" }
    );
    doc.text(
      `€${item.total.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      198,
      centerY,
      { align: "right" }
    );

    // Linea separatrice
    doc.setDrawColor("#888888");
    y += rowHeight;
    doc.line(8, y, 200, y);
    y += 4;
  });

  // --- SUBTOTALE, IVA, TOTALE ---
  const subtotalY = y + 5;
  doc.setFont("Inter", "bold");
  doc.text("Subtotale:", 135, subtotalY);
  doc.text(
    `€${invoice.subTotal.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    198,
    subtotalY,
    { align: "right" }
  );

  let offset = 0;
  if (invoice.tax && invoice.taxAmount && invoice.tax !== 0) {
    offset += 7;
    doc.text(`IVA (${invoice.tax}%)`, 135, subtotalY + offset);
    doc.text(
      `€${invoice.taxAmount.toLocaleString("it-IT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      198,
      subtotalY + offset,
      { align: "right" }
    );
  }

  offset += 10;
  doc.setLineWidth(0.3);
  doc.line(135, subtotalY + offset - 5, 200, subtotalY + offset - 5);

  doc.setFont("Inter", "bold");
  doc.setFontSize(12);
  doc.text("Totale:", 135, subtotalY + offset);
  doc.text(
    `€${invoice.total.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    198,
    subtotalY + offset,
    { align: "right" }
  );

  y = subtotalY + offset + 10;

  // --- NOTE ---
  if (invoice.notes && invoice.notes.length > 0) {
    invoice.notes.forEach((note) => {
      const wrappedContent = doc.splitTextToSize(note.content, tableWidth - 6);
      const contentHeight = wrappedContent.length * 5 + 4;

      checkAddPage(8 + contentHeight + 5);
      // header cell
      doc.setDrawColor(180);
      doc.setFillColor("#F5F5F5");
      doc.rect(tableX, y, tableWidth, 8, "FD");
      doc.setFont("Inter", "semibold");
      doc.setFontSize(10);
      doc.setTextColor("#000000");
      doc.text(note.title, tableX + 3, y + 6);
      y += 8;

      // content cell
      doc.setFont("Inter", "normal");
      doc.setFontSize(9);
      doc.setTextColor("#000000");
      doc.rect(tableX, y, tableWidth, contentHeight);
      doc.text(wrappedContent, tableX + 3, y + 6);
      y += contentHeight + 5;
    });
  }

  // --- FOOTER ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }
  const date = new Date(invoice.date);
  const day = String(date.getDate()).padStart(2, "0"); // giorno
  const month = String(date.getMonth() + 1).padStart(2, "0"); // mese
  const year = date.getFullYear(); // anno
  const clientPart = invoice.clientName || invoice.clientCompany;
  const invoiceNumberPart = invoice.isEstimate
    ? ""
    : `_${invoice.invoiceNumber}`;

  if (invoice.isEstimate) {
    doc.save(
      `${day}_${month}_${year}_preventivo${
        clientPart ? `_${clientPart}` : ""
      }.pdf`
    );
  } else {
    doc.save(
      `${day}_${month}_${year}_fattura${invoiceNumberPart}${
        clientPart ? `_${clientPart}` : ""
      }.pdf`
    );
  }

  const pdfBlob = doc.output("blob");
  return URL.createObjectURL(pdfBlob);
};
