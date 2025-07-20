  // utils/pdfHelpers.js
  export const downloadNotebookAsPDF = async (chapter = "Notebook") => {
    const element = document.getElementById("notebook-content");
    if (!element) {
      console.error("Notebook content element not found!");
      alert("Cannot generate PDF: Notebook content is not available.");
      return;
    }

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const options = {
        margin: 0.5,
        filename: `${chapter}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(options).from(element).save();
      console.log("✅ PDF generated");
    } catch (err) {
      console.error("❌ Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };
