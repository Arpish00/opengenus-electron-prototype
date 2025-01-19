const path = require('path');

class PDFReader {
  constructor(viewerElementId) {
    this.viewerElementId = viewerElementId; // Container ID for the viewer
    this.viewerUrl = path.join(__dirname, 'web', 'viewer.html');
  }

  /**
   * Load a PDF file in the viewer.
   * @param {Buffer|ArrayBuffer|Uint8Array} pdfData - The PDF data to render.
   */
  loadPDF(pdfData) {
    // If pdfData is a Buffer, convert it to ArrayBuffer
    if (Buffer.isBuffer(pdfData)) {
      pdfData = pdfData.buffer.slice(pdfData.byteOffset, pdfData.byteOffset + pdfData.byteLength);
    }
    this.renderPDF(pdfData);
  }

  /**
   * Render the PDF data in the viewer.
   * @param {ArrayBuffer|Uint8Array} pdfData - The PDF data to render.
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