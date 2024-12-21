const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve the PDF file
app.get('/pdf', (req, res) => {
    let pdfFileName = req.query.name; // Get the PDF file name
    if (!pdfFileName) {
        return res.status(400).send('PDF file name is required');
    }

    // Append .pdf extension if not already included
    if (!pdfFileName.endsWith('.pdf')) {
        pdfFileName += '.pdf';
    }

    const pdfFilePath = path.join(__dirname, 'pdfs', pdfFileName);
    if (!fs.existsSync(pdfFilePath)) {
        return res.status(404).send('PDF file not found');
    }

    const pdfBuffer = fs.readFileSync(pdfFilePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
});


const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = server;