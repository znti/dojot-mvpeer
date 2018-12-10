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

	setAuthToken(jwt, cb) {
		console.log('Setting auth token as', jwt);
		this.http = axios.create({
			baseURL: this.configs.server,
			timeout: 1000,
			headers: {'Authorization': `Bearer ${jwt}` }
		});
		cb && cb();
	}
	
	get(endpoint, callback) {
		console.log('Requesting GET', endpoint);
	}

	post(endpoint, data, callback) {
		console.log('Requesting POST', endpoint, 'with data', data);
		this.http.post(endpoint, data)
		.then(response => {
			callback(false, response);
			//console.log('Got response code', response.status, 'with data', response.data );
		})
		.catch(error => {
			let response = error.response;
			callback(true, response);
			console.error(' Failed with response code', response.status, 'and data', response.data );
		});

	}
}
