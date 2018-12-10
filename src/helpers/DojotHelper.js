const HttpHelper = require('./HttpHelper');

module.exports = class DojotHelper {

	constructor(dojotConfigs) {
		this.configs = dojotConfigs;
		console.log('Building a helper with configs', this.configs);
		this.httpClient = new HttpHelper(this.configs);

		console.log('Retrieving access token');
		let credentials = {username: 'admin', passwd: 'admin'};
		this.httpClient.post(this.configs.auth, credentials, (err, res) => {
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

	ping() {
		console.log('Ping from DojotHelper');
		this.httpClient.ping();
	}

}

