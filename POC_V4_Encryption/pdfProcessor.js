const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const keytar = require('keytar');

const SERVICE = 'PDFEncryptionService';
const ACCOUNT_KEY = 'encryptionKey';
const ACCOUNT_IV = 'encryptionIV';
let pageCount = 0;

// Function to encrypt data
function encrypt(data, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return Buffer.concat([iv, encrypted]); // Prepend IV for decryption
}

// Function to generate and store keys
async function generateAndStoreKeys() {
    const key = crypto.randomBytes(32); // 32 bytes for AES-256
    const iv = crypto.randomBytes(16); // 16 bytes for AES block size

    await keytar.setPassword(SERVICE, ACCOUNT_KEY, key.toString('hex'));
    await keytar.setPassword(SERVICE, ACCOUNT_IV, iv.toString('hex'));

    console.log('Keys generated and stored securely.');
}

// Function to retrieve keys
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

async function splitAndEncryptPDF(inputPDFPath, outputDir) {
    const pdfBuffer = fs.readFileSync(inputPDFPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const { key, iv } = await getKeys(); // Retrieve keys

    for (let i = 0; i < pdfDoc.getPages().length; i++) {
        const singlePageDoc = await PDFDocument.create();
        const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
        singlePageDoc.addPage(copiedPage);

        const pdfBytes = await singlePageDoc.save();
        const encryptedPdf = encrypt(pdfBytes, key, iv);

        const filePath = path.join(outputDir, `encrypted_page-${i + 1}.enc`);
        fs.writeFileSync(filePath, encryptedPdf);
        console.log(`Created: ${filePath}`); // Log the created file path
    }

    pageCount = pdfDoc.getPages().length;
    console.log(`PDF split and encrypted into ${pageCount} pages!`);
   
    return pageCount;
}

// Cleanup function to delete generated files
async function cleanup(outputDir) {
    try {
        const files = await fs.promises.readdir(outputDir);
        await Promise.all(files.map(file => fs.promises.unlink(path.join(outputDir, file))));
        console.log('Cleaned up generated files.');
    } catch (err) {
        console.error('Error during cleanup:', err);
    }
}

async function getPageCount(inputPDFPath) {
    const pdfBuffer = fs.readFileSync(inputPDFPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);  

    pageCount = pdfDoc.getPages().length;
    return pageCount;
}

// Export functions
module.exports = {
    generateAndStoreKeys,
    splitAndEncryptPDF,
    cleanup,
    getPageCount
};