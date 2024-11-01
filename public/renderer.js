const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

// File path for the base64 file
const base64FilePath = path.join(__dirname, 'sample-base64.txt');

// Load PDF in iframe
document.getElementById('loadPdfBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    const backBtn = document.getElementById('backBtn');

    console.log('Load PDF button clicked. Attempting to decode PDF...');

    // Read the base64 content from the file
    fs.readFile(base64FilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading base64 file:', err);
            alert('Failed to load base64 file. Check console for details.');
            return;
        }

        console.log('Base64 data read successfully. Length:', data.length);

        // Decode base64 to a buffer and send it to the main process
        const pdfBuffer = Buffer.from(data, 'base64');
        ipcRenderer.send('send-pdf-buffer', pdfBuffer);

        // Set PDF URL using the custom protocol
        const pdfUrl = 'internal-pdf://pdf'; // Use the custom protocol to load the PDF
        pdfViewer.src = pdfUrl;
        pdfViewer.style.display = 'block';
        backBtn.style.display = 'inline-block';
    });
});

// Back button hides the iframe
document.getElementById('backBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.style.display = 'none';
    this.style.display = 'none'; // Corrected the typo from 'stylae' to 'style'
});
