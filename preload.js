const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    serverUrl: 'http://localhost:3000/sample.pdf'
});
