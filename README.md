## Electron Desktop App Prototype

This repository contains multiple prototypes created to explore features and functionalities for an Electron-based desktop application. These are proof-of-concept implementations for exploration.

##### Steps to run the Electron app:

Clone the Repository:

```
git clone https://github.com/OpenGenus/Desktop-app.git
cd Desktop-app
```
navigate to the specific directory.

Install Dependencies:

```
npm install
```
Run the App:

```
npm start
```


#### Included Prototypes: 
1. POC_V1_WebsiteLoader
- loading Opengenus IQ webpage into the Electron app.

2. POC_V2_BuiltInReader
- Explored loading local html and introduced a custom protocol (internal-pdf://) to load and display PDFs using the built-in browser PDF viewer.

3. POC_V3_CustomReaderWithServer
- Integrated a custom-built PDF reader (based on PDF.js) (to diable save and print functionality) and a local server to serve PDF files dynamically.
