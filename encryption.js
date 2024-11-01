// encryption.js
const CryptoJS = require('crypto-js');

// Function to encrypt PDF data
function encryptData(data) {
    const dynamicPassword = generateDynamicPassword(); // Generate a dynamic password
    const ciphertext = CryptoJS.AES.encrypt(data, dynamicPassword).toString();
    return { ciphertext, dynamicPassword }; // Return both ciphertext and dynamic password
}

// Function to decrypt PDF data
function decryptData(ciphertext, dynamicPassword) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, dynamicPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Example function to generate a dynamic password
function generateDynamicPassword() {
    return (Math.random() + 1).toString(36).substring(7); // Simple example; use a better method for production
}

module.exports = {
    encryptData,
    decryptData
};
