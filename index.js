const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let pdfBuffer = null; // Store the buffer globally

app.on('ready', () => {
    // Register a custom protocol to serve the PDF from memory
    protocol.registerBufferProtocol('internal-pdf', (request, callback) => {
        if (pdfBuffer) {
            callback({ mimeType: 'application/pdf', data: pdfBuffer });
        } else {
            callback({ error: -6 }); // FILE_NOT_FOUND equivalent
        }
    }, (error) => {
        if (error) console.error('Failed to register protocol', error);
    });

    ipcMain.on('send-pdf-buffer', (event, buffer) => {
        pdfBuffer = buffer; // Store the buffer in the global variable
        console.log('PDF buffer received and ready to serve.');
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false, // Allow access to Node.js features
            nodeIntegration: true,    // Enable Node.js in the renderer process

            preload: path.join(__dirname, 'preload.js'), // Add preload.js if needed
        },
    });

    mainWindow.loadFile('public/pdfviewer.html');

    // Clean up on app close
    app.on('before-quit', () => {
        pdfBuffer = null; // Clear the buffer to free memory
        console.log('App is quitting. Buffer cleared.');
    });
});
