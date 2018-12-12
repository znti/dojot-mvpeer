const axios = require('axios');

module.exports = class HttpHelper {

	ping() {
		console.log('Ping from HttpHelper');
	}

	constructor(dojotConfigs) {
		this.configs = dojotConfigs;
		
		console.log('Initializing http helper with configs', this.configs);
		this.http = axios.create({
			baseURL: this.configs.server,
		});

	}

	setAuthToken(jwt) {
		return new Promise((resolve, reject) => {
		console.log('Setting auth token as', jwt);
			this.http = axios.create({
				baseURL: this.configs.server,
				timeout: 5000,
				headers: {
					'Authorization': `Bearer ${jwt}`,
					'Content-Type': 'application/json',
				}
			});

			resolve();
		});
	}

	get(endpoint) {
		console.log('Requesting GET', endpoint);
		return this.http.get(endpoint);
	}

	post(endpoint, data) {
		console.log('Requesting POST', endpoint, 'with data', data);
		return this.http.post(endpoint, data);
	}
}
