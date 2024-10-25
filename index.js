const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    // Register a custom protocol to serve the PDF
    protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.substr(6); // remove 'app://' from the request
        const filePath = path.join(__dirname, 'public', url);
        callback({ path: filePath });
    }, (error) => {
        if (error) console.error('Failed to register protocol', error);
    });

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // Add preload.js
        },
    });

    mainWindow.loadFile('public/pdfviewer.html');
});
