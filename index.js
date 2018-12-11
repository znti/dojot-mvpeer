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

function handleApiCall(exec, res, data) {
	exec().then((response) => {
		console.log('Got response');
		res.status(response.status).send(response.data);
	}).catch((error) => {
		console.log('Error while executing');
		let response = error.response;
		res.status(response.status).send(response.data);
	});
}

app.get('/api/*', (req, res) => {
	let resource = req. params[0];
	console.log('Loading', resource);
	
	switch(resource) {
		case 'templates':
			handleApiCall(() => { return dh.getTemplates() }, res);
			break;
		case 'devices':
			handleApiCall(() => { return dh.getDevices() }, res);
			break;
		default:
			console.log('Beep! 404..');
			res.status(404).send();
	}

});

app.post('/api/*', (req, res) => {
	let resource = req. params[0];
	let data = req.body;
	console.log('Posting', data, 'on', resource);
	
	switch(resource) {
		case 'templates':
			handleApiCall(() => { return dh.addTemplate(data) }, res);
			break;
		case 'devices':
			handleApiCall(() => { return dh.addDevice(data) }, res);
			break;
		default:
			console.log('Beep! 404..');
			res.status(404).send();
	}

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
