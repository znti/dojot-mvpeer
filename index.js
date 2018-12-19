const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

const configs = require('./src/configs');

const DojotHelper = require('./src/helpers/DojotHelper.js');

let serverPort = configs.server.port;
let baseAppDir = path.join(__dirname, 'build');

let dh = new DojotHelper(configs.dojot);

/*
 * Web app helper endpoints
 */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function handleApiCall(exec, res) {
	exec().then((response) => {
		console.log('Got response');
		res.status(response.status).send(response.data);
	}).catch((error) => {
		console.log('Error while executing', error);
		let response = error.response;
		res.status(response.status).send(response.data);
	});
}

/*
 * Tenant management endpoint
 */

app.get('/api/tenants', (req, res) => {
	handleApiCall(() => { return dh.getTenants() }, res);
});

app.get('/api/tenants/:tenantName/:resource', (req, res) => {
	let {tenantName, resource} = req.params;

	console.log('Loading resource', resource, 'for tenant', tenantName);
	switch(resource) {
		case 'templates':
			handleApiCall(() => { return dh.getTemplates(tenantName) }, res);
			break;
		case 'devices':
			handleApiCall(() => { return dh.getDevices(tenantName) }, res);
			break;
		default:
			console.log('Beep! 404..');
			res.status(404).send();
	}
});


app.post('/api/tenants/:tenantName/:resource', (req, res) => {
	let {tenantName, resource} = req.params;
	let data = req.body;

	console.log('Posting', data, 'on resource', resource, 'for tenant', tenantName);
	switch(resource) {
		case 'templates':
			handleApiCall(() => { return dh.addTemplate(tenantName, data) }, res);
			break;
		case 'devices':
			handleApiCall(() => { return dh.addDevice(tenantName, data) }, res);
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
