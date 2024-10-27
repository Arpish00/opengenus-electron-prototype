const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

document.getElementById('loadPdfBtn').addEventListener('click', function() {
    const pdfContainer = document.getElementById('pdfContainer');
    const backBtn = document.getElementById('backBtn');
    
    // Clear previous PDF
    pdfContainer.innerHTML = '';
    
    // Load the PDF
    const pdfUrl = 'app://sample.pdf'; // Use your custom protocol

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(page => {
                const scale = 1.5; // Adjust scale as needed
                const viewport = page.getViewport({ scale: scale });
                
                // Create canvas element for the page
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Append canvas to the container
                pdfContainer.appendChild(canvas);

                // Render the page
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }
    });

    backBtn.style.display = 'inline-block'; // Show the back button
});

// Function to go back
document.getElementById('backBtn').addEventListener('click', function() {
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.innerHTML = ''; // Clear the PDF viewer
    this.style.display = 'none'; // Hide the back button
});
