import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function printTable(
  data,
  title,
  headers,
  filename = `report_${new Date().getTime()}.pdf`
) {
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

  let content = {
    startY: 50,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  printWatermark(doc, marginLeft);
  doc.save(filename);
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
  doc.text(text, x, y);
  doc.setFontSize(oldfs);
}
