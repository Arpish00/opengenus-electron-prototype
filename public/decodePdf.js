const fs = require('fs');
const path = require('path');

// Define the path to your base64 file
const filePath = path.join(__dirname, 'sample-base64.txt');

// Read the base64-encoded PDF data
fs.readFile(filePath, 'utf8', (err, base64Data) => {
    if (err) {
        console.error('Error reading base64 file:', err.message);
        return;
    }

    // Check if base64Data is empty or not
    if (!base64Data) {
        console.error('The base64 data is empty.');
        return;
    }

    // Decode the base64 data
    try {
        const buffer = Buffer.from(base64Data.trim(), 'base64');

        // Create a PDF file to save the decoded content
        const pdfFilePath = path.join(__dirname, 'decoded.pdf');
        fs.writeFile(pdfFilePath, buffer, (writeErr) => {
            if (writeErr) {
                console.error('Error writing PDF file:', writeErr.message);
                return;
            }
            console.log('PDF successfully decoded and saved as decoded.pdf');
        });
    } catch (decodeErr) {
        console.error('Error decoding base64 data:', decodeErr.message);
    }
});
