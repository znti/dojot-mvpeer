import axios from 'axios';

export default class HttpHelper {

	ping() {
		console.log('Ping from HttpHelper');
	}

	constructor(endpointUri) {
//		this.configs = dojotConfigs;
		this.endpoint = endpointUri;
		console.log('Initializing http helper pointing to', this.endpoint);
		this.http = axios.create({
			baseURL: this.endpoint,
		});

	}

	setAuthToken(jwt) {
		return new Promise((resolve, reject) => {
		console.log('Setting auth token as', jwt);
			this.http = axios.create({
				baseURL: this.endpoint,
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
