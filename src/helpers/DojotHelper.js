const HttpHelper = require('./HttpHelper');

module.exports = class DojotHelper {

	constructor(dojotConfigs) {
		this.configs = dojotConfigs;
		console.log('Building a helper with configs', this.configs);
		this.httpClient = new HttpHelper(this.configs);

		console.log('Retrieving access token');
		let credentials = {username: 'admin', passwd: 'admin'};
		this.httpClient.post(this.configs.auth, credentials).then(res => {//, (err, res) => {
			let jwt = res.data.jwt;
			console.log('Got token data', jwt);
			this.httpClient.setAuthToken(jwt, (err) => {
				if(err) {
					console.error(err);
					return;
				}
				console.log('Auth token set');

				console.log('Initialization completed.');

			});
		});
	}

	getDevices() {
		console.log('Loading devices');
		return this.httpClient.get(this.configs.devices);
	}

	addDevice(deviceData) {
		console.log('Adding device', deviceData);
		return this.httpClient.post(this.configs.devices, deviceData);
	}

	getTemplates() {
		return new Promise((resolve, reject) => {
			console.log('Loading templates');
			this.httpClient.get(this.configs.templates)
			.then(response => {

				let templates = response.data.templates;
				let total = templates.length || 0;
				console.log('Loaded', total, 'templates');
				resolve(templates);
			})
			.catch((err) => {
				reject('err');
			});
		});
	}

	addTemplate(templateData) {
		return new Promise((resolve, reject) => {
			console.log('Adding template', templateData);
			this.httpClient.post(this.configs.templates, templateData)
			.then(response => {
				console.log('Resolving addTemplate with response');
				console.log(response);
				resolve(response);
			})
			.catch((err) => {
				console.log('Rejecting addTemplate with error', err);
				reject('err');
			});
		});
	}

	ping() {
		console.log('Ping from DojotHelper');
		this.httpClient.ping();
	}

}

