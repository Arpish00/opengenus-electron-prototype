const { ipcRenderer } = require('electron');
const PDFReader = require('../components/PDFReader/pdf_reader');

document.getElementById('loadPdfBtn').addEventListener('click', function () {
    const viewer = document.getElementById('viewer');
    const pdfContainer = document.getElementById('pdfContainer');
    const backBtn = document.getElementById('backBtn');
    const placeholder = document.getElementById('placeholder');

    console.log('Load PDF button clicked. Attempting to load PDF...');

    // Fetch the PDF file from the server
    const pdfFileName = 'sample'; // Exclude the .pdf extension
    fetch(`http://localhost:3000/pdf?name=${encodeURIComponent(pdfFileName)}`)
        .then(response => response.blob())
        .then(blob => {
            console.log('PDF fetched successfully:', blob);

            const pdfReader = new PDFReader('pdfContainer'); 
            pdfReader.loadPDF(blob); // Load the PDF

            if (pdfContainer) {
                pdfContainer.style.display = 'block'; // Show the pdfContainer div
                if (placeholder) {
                    placeholder.style.display = 'none'; // Hide the placeholder
                }
            } else {
                console.error('pdfContainer element not found');
            }

            if (backBtn) {
                backBtn.style.display = 'inline-block';
            } else {
                console.error('backBtn element not found');
            }
        })
        .catch(error => {
            console.error('Error fetching PDF:', error);
        });
});

// Back button hides the pdfContainer div and shows the placeholder
document.getElementById('backBtn').addEventListener('click', function () {
    const pdfContainer = document.getElementById('pdfContainer');
    const placeholder = document.getElementById('placeholder');
    if (pdfContainer) {
        pdfContainer.style.display = 'none'; // Hide the pdfContainer div
        if (placeholder) {
            placeholder.style.display = 'block'; // Show the placeholder
        }
    } else {
        console.error('pdfContainer element not found');
    }
    this.style.display = 'none';
    console.log('Back button clicked. PDF container should be hidden now.');
});

// window.addEventListener('DOMContentLoaded', () => {
//     // Optionally, you can initialize the PDF reader on DOM content loaded
//     // const pdfReader = new PDFReader('pdfContainer'); // Initialize with the container ID
//     // const pdfPath = 'http://localhost:3000/pdf?name=sample'; // Use the new URL for the PDF file
//     // pdfReader.loadPDF(pdfPath); // Load the PDF

//     // Making a fake request to the Express server
//     const pdfFileName = 'sample'; // Exclude the .pdf extension
//     fetch(`http://localhost:3000/pdf?name=${encodeURIComponent(pdfFileName)}`)
//         .then(response => response.blob())
//         .then(blob => {
//             console.log('PDF fetched successfully:', blob);
//         })
//         .catch(error => {
//             console.error('Error fetching PDF:', error);
//         });
// });