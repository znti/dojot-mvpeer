const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

const configs = require('./configs');

const DojotHelper = require('./src/helpers/DojotHelper.js');

let serverPort = configs.server.port;
let baseAppDir = path.join(__dirname, 'build');

console.log('helper', DojotHelper)
let dh = new DojotHelper(configs.dojot);
dh.ping();

/*
 * Web app helper endpoints
 */

app.get('/templates', (req, res) => {
        console.log('Loading templates list');
	dh.getTemplates().then(templates => {
		console.log('Loaded templates list:', templates);
		res.status(200).send(templates);
	}).catch((err) => {
		res.status(400).send(err);
	});
});

app.post('/templates', (req, res) => {
        let template = req.body;
        console.log('Adding', template, 'to templates list');
	dh.addTemplate(template).then((result) => {
		console.log('Got result from addTemplate');
		res.status(201).send({message: 'template created'});
	}).catch((err) => {
		console.log('Got error from addTemplate', err);
		res.status(400).send({message: err});
	});
});

/*
 * Web pages server
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
