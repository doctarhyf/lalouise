import jsPDF from "jspdf";
import logo from "../assets/hospital.png";
import user from "../assets/user.png";
import autoTable from "jspdf-autotable";

export function printTable(
  data,
  title,
  headers,
  filename = `report_${new Date().getTime()}.pdf`
) {
  /*

  autoTable(doc, {
  head: [['Name', 'Email', 'Country']],
  body: [
    ['David', 'david@example.com', 'Sweden'],
    ['Castille', 'castille@example.com', 'Spain'],
    // ...
  ],
})

  */
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  //const title = "My Awesome Report";
  //const headers = [["NAME", "PROFESSION"]];

  /*
people: [
        { name: "Keanu Reeves", profession: "Actor" },
        { name: "Lionel Messi", profession: "Football Player" },
        { name: "Cristiano Ronaldo", profession: "Football Player" },
        { name: "Jack Nicklaus", profession: "Golf Player" },
      ]
  */

  //const data = this.state.people.map((elt) => [elt.name, elt.profession]);

  const rect = drawLogo(doc, logo, marginLeft);

  console.log(rect);

  let content = {
    startY: rect.h + marginLeft / 2, //rect.y + rect.h,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, rect.hm);

  console.log(doc);

  //doc.autoTable(content);
  autoTable(doc, content);
  printWatermark(doc, marginLeft);
  doc.save(filename);
}

export function printPatienInfo(patientData, patientPayments, filename) {
  console.log(patientData, patientPayments);

  const unit = "px";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 30;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  printWatermark(doc, marginLeft);
  const rect = drawLogo(doc, logo, marginLeft);
  const PAT_IMG_SIZE = { w: 32, h: 32 };
  doc.addImage(
    user,
    "PNG",
    marginLeft - 10,
    rect.h,
    PAT_IMG_SIZE.w,
    PAT_IMG_SIZE.h
  );
  doc.setFontSize(12);

  const data = patientData;

  let x = 20;
  let y = rect.hm + PAT_IMG_SIZE.h + 10;

  function addTextToPDF(key, value, doc) {
    // Set font size and style for the key
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`${key}:`, x, y);

    // Move down the y position for the value
    y += 12; // Smaller increment to have key and value close but on different lines

    // Set font size and style for the value
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`${value}`, x, y);

    // Move down the y position for the next entry
    y += 12;
  }

  Object.keys(data).forEach((key) => {
    if (key !== "emergContact") {
      // Skip 'emergContact'
      const value =
        typeof data[key] === "object" && data[key] !== null
          ? JSON.stringify(data[key], null, 2) // Convert object to string
          : data[key];
      addTextToPDF(key, value, doc);
    }
  });

  doc.save(filename || "patient_info.pdf");
}

function drawLogo(doc, logo, margin, yspacefactor = 4) {
  const ofs = doc.getFontSize();
  const text = "LaLouise © 2024";
  const LOGO = { W: 15, H: 15 };
  doc.addImage(logo, "PNG", margin, margin, LOGO.W, LOGO.H);
  const logotexty = margin + LOGO.H * 1.5;

  doc.setFontSize(10);
  doc.text(text, margin, logotexty);
  const textdims = doc.getTextDimensions(text);

  doc.setFontSize(ofs);
  return {
    x: margin,
    y: margin,
    w: textdims.w,
    h: textdims.h + logotexty,
    hm: textdims.h + logotexty + margin / yspacefactor,
  };
}

function printWatermark(doc, margin, watermark) {
  const oldfs = doc.getFontSize();
  doc.setFontSize(8);
  const text = watermark || "https://doctarhyf.github.io/lalouise/";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = doc.getTextWidth(text);
  const x = pageWidth - textWidth - margin;
  const y = pageHeight - margin;
  doc.text(new Date().toISOString(), margin, y);
  doc.text(text, x, y);
  doc.setFontSize(oldfs);
}
