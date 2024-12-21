const path = require('path');

class PDFPathReader {
  constructor(viewerElementId) {
    this.viewerElementId = viewerElementId; // Container ID for the viewer
    this.viewerUrl = path.join(__dirname, 'web', 'viewer.html');
  }

  /**
   * Load a PDF file in the viewer.
   * @param {string} pdfPath - Absolute or relative path to the PDF.
   */
  loadPDF(pdfPath) {
    const viewerEle = document.getElementById(this.viewerElementId);
    if (!viewerEle) {
      console.error(`Viewer element with ID "${this.viewerElementId}" not found.`);
      return;
    }

    viewerEle.innerHTML = ''; // Clear any previous content

    // iframe to embed the viewer
    const iframe = document.createElement('iframe');
    iframe.src = `${this.viewerUrl}?file=${encodeURIComponent(pdfPath)}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.frameBorder = '0';

    viewerEle.appendChild(iframe);
  }
}

module.exports = PDFPathReader;
