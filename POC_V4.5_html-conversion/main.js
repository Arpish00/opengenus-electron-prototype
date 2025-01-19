// main.js
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('index.html');

    // Run the Python script
    const pythonProcess = spawn('python', ['script.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`Output: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            console.log('Python script executed successfully');
            const outputFilePath = path.join(__dirname, 'output', 'generated.html');
            if (fs.existsSync(outputFilePath)) {
                win.loadFile(outputFilePath);
            } else {
                console.error('Generated HTML file does not exist');
            }
        } else {
            console.error(`Python script exited with code ${code}`);
        }
    });
}

app.whenReady().then(createWindow);

// to remove the generated HTML file when the app is closed

app.on('window-all-closed', () => {
    const outputFilePath = path.join(__dirname, 'output', 'generated.html');
    if (fs.existsSync(outputFilePath)) {
        fs.unlinkSync(outputFilePath);
        console.log('Generated HTML file removed');
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});