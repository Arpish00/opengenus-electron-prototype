const PDFReader = require('../components/PDFReader/pdf-reader');

window.addEventListener('DOMContentLoaded', () => {
  const pdfReader = new PDFReader('viewer'); // Initialize with the container ID
  const pdfPath = '../../../pdfs/sample.pdf'; // Relative path to the sample PDF
  pdfReader.loadPDF(pdfPath); // Load the PDF
});
