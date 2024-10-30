const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

let pdfDoc = null;
let currentPage = 1;

document.getElementById('loadPdfBtn').addEventListener('click', function () {
    const pdfContainer = document.getElementById('pdfContainer');
    const backBtn = document.getElementById('backBtn');

    // Clear previous PDF and thumbnails
    pdfContainer.innerHTML = '';
    document.getElementById('thumbnailList').innerHTML = '';

    // Load the PDF
    const pdfUrl = 'app://sample.pdf'; // Use your custom protocol

    pdfjsLib.getDocument(pdfUrl).promise
        .then(pdf => {
            pdfDoc = pdf;
            renderAllPages(); // Render all pages initially
            renderThumbnails(); // Render thumbnails
        })
        .catch(error => {
            console.error('Error loading PDF:', error);
            alert('Failed to load PDF. Please check the file path or try again.');
        });

    backBtn.style.display = 'inline-block'; // Show the back button
});

// Render all pages in the PDF
function renderAllPages() {
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.innerHTML = ''; // Clear previous content

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        pdfDoc.getPage(pageNum).then(page => {
            const scale = 1; // Adjust scale as needed
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
            page.render(renderContext).promise.then(() => {
                // Create a text layer div
                const textLayerDiv = document.createElement('div');
                textLayerDiv.className = 'textLayer';
                pdfContainer.appendChild(textLayerDiv);

                // Render the text layer
                page.getTextContent().then(textContent => {
                    const textLayer = new pdfjsLib.TextLayerBuilder({
                        textLayerDiv: textLayerDiv,
                        pageIndex: pageNum - 1,
                        viewport: viewport,
                        enhanceTextSelection: true // Allow text selection
                    });
                    textLayer.setTextContent(textContent);
                    textLayer.render();
                });

                // Set the text layer's dimensions
                textLayerDiv.style.width = `${viewport.width}px`;
                textLayerDiv.style.height = `${viewport.height}px`;
                textLayerDiv.style.position = 'absolute';
                textLayerDiv.style.top = '0';
                textLayerDiv.style.left = '0';
                textLayerDiv.style.pointerEvents = 'none'; // Allow clicks to go through to the canvas
            });
        });
    }
}

// Render thumbnails for navigation
function renderThumbnails() {
    const thumbnailList = document.getElementById('thumbnailList');
    thumbnailList.innerHTML = ''; // Clear previous thumbnails if any

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        pdfDoc.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: 0.2 }); // Thumbnail scale
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Append canvas to the thumbnail list
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.appendChild(canvas);
            thumbnailList.appendChild(thumbnailDiv);

            // Render thumbnail
            page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                // Add click event for thumbnail
                thumbnailDiv.addEventListener('click', () => {
                    currentPage = pageNum;
                    renderAllPages(); // Rerender to the current page
                    document.getElementById('pdfContainer').scrollTop = 0; // Scroll to top
                });
            });
        });
    }
}

// Function to go back
document.getElementById('backBtn').addEventListener('click', function () {
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.innerHTML = ''; // Clear the PDF viewer
    this.style.display = 'none'; // Hide the back button
});
