const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    loadPdf: () => ipcRenderer.send('load-pdf'),
    onPdfLoaded: (callback) => ipcRenderer.on('pdf-loaded', (event, pdfPath) => callback(pdfPath)),
});
