const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const keytar = require('keytar');
const pdfProcessor = require('./pdfProcessor'); // Import the pdfProcessor module

const SERVICE = 'PDFEncryptionService';
const ACCOUNT_KEY = 'encryptionKey';
const ACCOUNT_IV = 'encryptionIV';

global.pagecount = 0;

async function getKeys() {
    const key = await keytar.getPassword(SERVICE, ACCOUNT_KEY);
    const iv = await keytar.getPassword(SERVICE, ACCOUNT_IV);

    if (!key || !iv) {
        throw new Error('Keys not found. Please generate and store keys first.');
    }

    return {
        key: Buffer.from(key, 'hex'),
        iv: Buffer.from(iv, 'hex'),
    };
}

async function decryptData(encryptedData) {
    const { key, iv } = await getKeys();
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
}

async function decryptPDF(page) {
  try {
    const encryptedData = fs.readFileSync(path.join(__dirname, `output/encrypted_page-${page}.enc`));
    const decryptedData = await decryptData(encryptedData);

    const pdfNameWithoutExt = path.basename(pdfFileName, path.extname(pdfFileName));
    const tempDir = path.join(__dirname, 'temp', pdfNameWithoutExt);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
  }

    const decryptedPath = path.join(tempDir, `page-${page}-decrypted.pdf`);
    fs.writeFileSync(decryptedPath, decryptedData);
    return decryptedPath;
  } catch (error) {
    console.error('Error decrypting PDF:', error);
    throw error;
  }
}

ipcMain.handle('fetch-and-decrypt-pdf', async (event, page) => {
    try {
        const pdfPath = await decryptPDF(page);
        return pdfPath;
    } catch (error) {
        console.error('Error fetching or decrypting PDF:', error);
        throw error;
    }
});


// additinonal function to use if pdf is to be decrypted and sent as buffer
async function decryptPDFBuffer(page) {
  console.log(`Decrypting PDF buffer for page ${page}...`);
  try {
    const encryptedData = fs.readFileSync(path.join(__dirname, `output/encrypted_page-${page}.enc`));
    console.log(`Read encrypted data for page ${page}`);
    const decryptedData = await decryptData(encryptedData);
    console.log(`Decrypted data for page ${page}`);
    // Instead of writing to a file, return the decrypted data as a buffer
    return decryptedData;
  } catch (error) {
    console.error(`Error decrypting PDF for page ${page}:`, error);
    throw error;
  }
}
// Handle the request from the renderer process to send the decrypted PDF buffer
ipcMain.handle('send-decrypted-pdf', async (event, page) => {
  console.log(`Handling request for decrypted PDF for page ${page}...`);
  try {
    console.log(`Sending decrypted PDF for page ${page}...`);
    const decryptedData = await decryptPDFBuffer(page); 
    console.log(`Decrypted data sent for page ${page}`);
    return decryptedData; // Send the decrypted data back to the renderer
  } catch (error) {
    console.error(`Error sending decrypted PDF for page ${page}:`, error);
    throw error;
  }
});


ipcMain.handle('delete-decrypted-pdf', async (event, pdfPath) => {
    try {
        fs.unlinkSync(pdfPath);
        console.log(`Decrypted file ${pdfPath} removed successfully.`);
    } catch (error) {
        console.error('Error deleting decrypted PDF:', error);
        throw error;
    }
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            plugins: true,
        },
    });

    mainWindow.loadFile('public/index.html');
}

const pdfFileName = 'sample.pdf';
const pdfFile = path.join(__dirname, './pdfs/sample.pdf');
const outputDir = path.join(__dirname, './output');

ipcMain.handle('get-page-count', async (event) => {
  try {
      const pageCount = await pdfProcessor.getPageCount(pdfFile);
      return pageCount;
  } catch (error) {
      console.error('Error getting page count:', error);
      throw error;
  }
});

function cleanTemp() {
  const tempDir = path.join(__dirname, 'temp');
  if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach(file => {
          const curPath = path.join(tempDir, file);
          if (fs.lstatSync(curPath).isDirectory()) {
              fs.rmSync(curPath, { recursive: true, force: true });
          } else {
              fs.unlinkSync(curPath);
          }
      });
      console.log('Temp directory cleaned up.');
  }
}

app.whenReady().then(async () => {

  // Uncomment the following line to generate and store keys for the first time
  await pdfProcessor.generateAndStoreKeys();

  const SplitValues = await pdfProcessor.splitAndEncryptPDF(pdfFile, outputDir);
  console.log("from main.js", SplitValues);
  console.log('PDF split and encrypted successfully!');


    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', async () => {
  try {
    await pdfProcessor.cleanup(outputDir);
    await cleanTemp();
    console.log('Cleanup completed successfully.');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
