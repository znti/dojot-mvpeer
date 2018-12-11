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
		console.log('Loading templates');
		return this.httpClient.get(this.configs.templates)
	}

	addTemplate(templateData) {
		console.log('Adding template', templateData);
		return this.httpClient.post(this.configs.templates, templateData)
	}

	ping() {
		console.log('Ping from DojotHelper');
		this.httpClient.ping();
	}

}

