const { app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
    // Load the PDF file into memory when the app starts
    const server = require('./server.js');


    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false, 
            nodeIntegration: true,    
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false,       
        },
    });

    mainWindow.loadFile('public/pdfviewer.html');

    // Clean up on app close
    app.on('before-quit', () => {
        server.close();
        console.log('App is quitting.');
    });
});
