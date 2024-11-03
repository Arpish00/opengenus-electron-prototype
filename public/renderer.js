const { ipcRenderer } = require('electron');

// Load PDF in iframe
document.getElementById('loadPdfBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    const backBtn = document.getElementById('backBtn');

    console.log('Load PDF button clicked. Attempting to load PDF...');

    // Set PDF URL using the custom protocol
    const pdfUrl = 'internal-pdf://pdf'; // Use the custom protocol to load the PDF
    pdfViewer.src = pdfUrl;
    pdfViewer.style.display = 'block';
    backBtn.style.display = 'inline-block';
});

// Back button hides the iframe
document.getElementById('backBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.style.display = 'none';
    this.style.display = 'none'; // Corrected the typo from 'stylae' to 'style'
});
