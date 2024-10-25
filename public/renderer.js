// const loadPdfBtn = document.getElementById('loadPdfBtn');
// const fullscreenBtn = document.getElementById('fullscreenBtn');
// const pdfViewer = document.getElementById('pdfViewer');

// // Handle "Load PDF" button click
// loadPdfBtn.addEventListener('click', function() {
//     pdfViewer.src = './sample.pdf'; // Load the PDF
//     pdfViewer.style.display = 'block'; // Show the iframe
//     fullscreenBtn.style.display = 'inline-block'; // Show the fullscreen button
// });

// // // Handle "Fullscreen" button click
// // fullscreenBtn.addEventListener('click', function() {
// //     if (pdfViewer.requestFullscreen) {
// //         pdfViewer.requestFullscreen(); // Standard fullscreen
// //     } else if (pdfViewer.mozRequestFullScreen) { // Firefox
// //         pdfViewer.mozRequestFullScreen();
// //     } else if (pdfViewer.webkitRequestFullscreen) { // Chrome, Safari, Opera
// //         pdfViewer.webkitRequestFullscreen();
// //     } else if (pdfViewer.msRequestFullscreen) { // IE/Edge
// //         pdfViewer.msRequestFullscreen();
// //     }
// // });

document.getElementById('loadPdfBtn').addEventListener('click', function() {
    const pdfViewer = document.getElementById('pdfViewer');
    pdfViewer.src = 'app://sample.pdf'; // Use the custom protocol
    pdfViewer.style.display = 'block'; // Show the iframe after clicking the button
});
