const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let pdfBuffer = null; // Store the buffer globally

app.on('ready', () => {
    // Load the PDF file into memory when the app starts
    const pdfFilePath = path.join(__dirname, 'public', 'sample.pdf');
    pdfBuffer = fs.readFileSync(pdfFilePath); // Read the PDF file into a buffer

    // Register a custom protocol to serve the PDF from memory
    protocol.registerBufferProtocol('internal-pdf', (request, callback) => {
        if (pdfBuffer) {
            callback({ mimeType: 'application/pdf', data: pdfBuffer });
        } else {
            callback({ error: -6 }); 
        }
    }, (error) => {
        if (error) console.error('Failed to register protocol', error);
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false, 
            nodeIntegration: true,    
            preload: path.join(__dirname, 'preload.js'), 
        },
    });

    mainWindow.loadFile('public/pdfviewer.html');

    app.on('before-quit', () => {
        pdfBuffer = null; // Clear the buffer when the app is quitting
        console.log('App is quitting. Buffer cleared.');
    });
});