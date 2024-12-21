
document.getElementById('loadPdfBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    const backBtn = document.getElementById('backBtn');

    console.log('Load PDF button clicked. Attempting to load PDF...');

    const pdfUrl = 'internal-pdf://pdf'; 
    pdfViewer.src = pdfUrl;
    pdfViewer.style.display = 'block';
    backBtn.style.display = 'inline-block';
});

document.getElementById('backBtn').addEventListener('click', function () {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.style.display = 'none';
    this.style.display = 'none'; 
});