const HttpHelper = require('./HttpHelper');

module.exports = class DojotHelper {



	constructor(dojotConfigs) {
		this.tenants = [ 
			'admin',
			'test',
		];

		this.clientsMap = [];

		this.configs = dojotConfigs;
		console.log('Building a helper with configs', this.configs);
		//this.httpClient = new HttpHelper(this.configs);

		this.tenants.map(tenant => {

			let username = 'admin';
			let passwd = 'admin';

			if(tenant !== 'admin') {
				username = `${tenant}Admin`;
				passwd = 'temppwd';
			}

			let credentials = {username, passwd};

			console.log('Retrieving access token for tenant', tenant);
			let httpClient = new HttpHelper(this.configs);
			httpClient.post(this.configs.auth, credentials).then(response => {
				let jwt = response.data.jwt;
				console.log('Setting client token', jwt, 'on tenant', tenant);
				httpClient.setAuthToken(jwt).then(() => {
					console.log('Tenant', tenant, 'token set.');
					this.clientsMap.push({
						tenant,
						client: httpClient,
					});
				}).catch(error => {
					console.log('Failed to set auth token on', tenant);
				});
			}).catch(error => {
				console.log('Failed to authenticate for', tenant);
			});

		});

	}

	loadTenantClient(tenant, next) {
		return new Promise( (resolve, reject) => {
			console.log('Loading tenant', tenant, '\'s client from', this.clientsMap);
			let tenantData = this.clientsMap.find(c => c.tenant === tenant);
			console.log('Got candidate', tenantData);
			if(tenantData) {
				resolve(tenantData.client);
				next && next(tenantData.client)
			} else {
				reject({response: {status:404, data:{message: 'Tenant not found'} } });
			}
		});
	}

	getDevices(tenant) {
		let endpoint = this.configs.devices;

		return this.loadTenantClient(tenant).then(client => {
			console.log('Got client', client);
			return client.get(endpoint)
		});
	}

	addDevice(tenant, deviceData) {
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.configs.devices, deviceData);
		});
	}

	getTemplates(tenant) {
		console.log('Loading templates');
		return this.loadTenantClient(tenant).then(client => {
			return client.get(this.configs.templates)
		});
	}

	addTemplate(tenant, templateData) {
		console.log('Adding template', templateData);
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.configs.templates, templateData)
		});
	}

}

