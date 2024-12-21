const path = require('path');

class PDFReader {
  constructor(viewerElementId) {
    this.viewerElementId = viewerElementId; // Container ID for the viewer
    this.viewerUrl = path.join(__dirname, 'web', 'viewer.html');
  }

  /**
   * Load a PDF file in the viewer.
   * @param {Blob|ArrayBuffer} pdfData - The PDF data to render.
   */
  async loadPDF(pdfData) {
    if (pdfData instanceof Blob) {
      pdfData = await pdfData.arrayBuffer();
    }
    this.renderPDF(pdfData);
  }

  /**
   * Render the PDF data in the viewer.
   * @param {ArrayBuffer} pdfData - The PDF data to render.
   */
  renderPDF(pdfData) {
    const viewerElement = document.getElementById(this.viewerElementId);
    viewerElement.innerHTML = ''; // Clear any previous content

    // Create a Blob URL for the PDF data
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // iframe to embed the viewer
    const iframe = document.createElement('iframe');
    iframe.src = `${this.viewerUrl}?file=${encodeURIComponent(url)}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.frameBorder = '0';

    viewerElement.appendChild(iframe);
  }
}

module.exports = PDFReader;