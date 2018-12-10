const path = require('path');
const express = require('express');
const app = express();

const configs = require('./configs');

const DojotHelper = require('./src/helpers/DojotHelper.js');

let serverPort = configs.server.port;
let baseAppDir = path.join(__dirname, 'build');

console.log('helper', DojotHelper)
let dh = new DojotHelper(configs.dojot);
dh.ping();

/*
 * web pages server
 */

// Serves app's base index.html
app.get('/app', (req, res) => {
	res.status(200).sendFile(path.join(baseAppDir, 'index.html'));
});

// Serves any asset requested
app.get('/*', (req, res) => {
	let resourceName = req.params[0];
	let filePath = path.join(baseAppDir, resourceName);
	console.log('Serving', filePath);
	res.status(200).sendFile(filePath);
});

app.listen(serverPort, () => {
	console.log('Server listening on port', serverPort);
});
