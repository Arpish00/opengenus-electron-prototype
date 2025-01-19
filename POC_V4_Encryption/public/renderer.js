document.addEventListener('DOMContentLoaded', async() => {
    const { ipcRenderer } = require('electron');
    const PDFPathReader = require('../components/PDFReader/pdf_path_reader');

    const totalPages = await ipcRenderer.invoke('get-page-count');
    console.log('from renderer', totalPages); // should log the current page count value
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    
    let currentPage = 1;
    

    async function loadPDF(page) {
        try {
            const pdfPath = await ipcRenderer.invoke('fetch-and-decrypt-pdf', page);
            console.log('PDF Path:', pdfPath);
            const pdfContainer = document.getElementById('pdfContainer');
            const placeholder = document.getElementById('placeholder');

            if (pdfContainer && pdfPath) {
                console.log('Loading PDF:', pdfPath);
                const pdfReader = new PDFPathReader('pdfContainer');
               
                pdfReader.loadPDF(pdfPath)// Load the PDF from the path
                setTimeout(() => {
                    ipcRenderer.invoke('delete-decrypted-pdf', pdfPath);
                  }, 300); // small delay
              
                pdfContainer.style.display = 'block'; // Show the pdfContainer div
                if (placeholder) {
                    placeholder.style.display = 'none'; // Hide the placeholder
                }
                
                if (nextButton) {
                    nextButton.style.display = 'inline-block';
                } else {
                    console.error('nextButton element not found');
                }

                if (prevButton) {
                    prevButton.style.display = 'inline-block';
                } else {
                    console.error('prevButton element not found');
                }

                const backBtn = document.getElementById('backBtn');
                if (backBtn) {
                    backBtn.style.display = 'inline-block';
                } else {
                    console.error('backBtn element not found');
                }
            } else {
                console.error('pdfContainer element not found or pdfPath is invalid');
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
        }
    }

    document.getElementById('loadPdfBtn').addEventListener('click', () => {
        loadPDF(currentPage);
      });
    // Event listeners for navigation buttons
    document.getElementById('next-button').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPDF(currentPage);
        }
    });

    document.getElementById('prev-button').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPDF(currentPage);
        }
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
        if (nextButton) {
            nextButton.style.display = 'none';
        } else {
            console.error('nextButton element not found');
        }
        
        if (prevButton) {
            prevButton.style.display = 'none';
        } else {
            console.error('prevButton element not found');
        }
        this.style.display = 'none';

        console.log('Back button clicked. PDF container should be hidden now.');
    });
});
