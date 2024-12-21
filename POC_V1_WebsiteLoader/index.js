const { app, BrowserWindow, screen } = require('electron');

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Browser window
    const win = new BrowserWindow({
        width: Math.floor(width * 0.8),  
        height: Math.floor(height * 0.8), 
        webPreferences: {
            nodeIntegration: false,
        },
    });

     // Load website
    win.loadURL('https://iq.opengenus.org/');
}

app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
