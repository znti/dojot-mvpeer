const HttpHelper = require('./HttpHelper');

module.exports = class DojotHelper {

	constructor(dojotConfigs) {
		this.tenants = [ 
			{id: '0', name: 'admin'},
			{id: '1', name: 'test'},
		];

		this.clientsMap = [];

		this.configs = dojotConfigs;
		console.log('Building a helper with configs', this.configs);

		this.resources = dojotConfigs.resources;
		console.log('Set resources as', this.resources);

		let dojotEndpoint = `${dojotConfigs.host}:${dojotConfigs.port}`

		this.tenants.map(tenant => {

			let tenantName = tenant.name;
			let tenantId = tenant.id;

			let username = 'admin';
			let passwd = 'admin';

			// TODO: Change to ids check once they are set, since name can vary
			if(tenantName !== 'admin') {
				username = `${tenantName}Admin`;
				passwd = 'temppwd';
			}

			let credentials = {username, passwd};

			console.log('Retrieving access token for tenant', tenantName);
			let httpClient = new HttpHelper(dojotEndpoint);
			httpClient.post(this.resources.auth, credentials).then(response => {
				let jwt = response.data.jwt;
				console.log('Setting client token', jwt, 'on tenant', tenantName);
				httpClient.setAuthToken(jwt).then(() => {
					console.log('Tenant', tenantName, 'client set.');
					this.clientsMap.push({
						tenantName,
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

	loadTenantClient(tenant) {
		return new Promise( (resolve, reject) => {
			console.log('Loading tenant', tenant, '\'s client from', this.clientsMap);
			let tenantData = this.clientsMap.find(client => {
				let clientsTenant = client.tenantName;
				let requestedTenant = tenant;
				console.log('Comparing', clientsTenant, 'against requested tenant', requestedTenant);
				return clientsTenant === requestedTenant;
			});
			if(tenantData) {
				console.log('Got candidate', tenantData);
				resolve(tenantData.client);
			} else {
				console.log('No client found');
				reject({response: {status:404, data:{message: 'Tenant not found'} } });
			}
		});
	}

	getDevices(tenant) {
		let endpoint = this.configs.devices;

		return this.loadTenantClient(tenant).then(client => {
			console.log('Got client', client);
			return client.get(this.resources.devices)
		});
	}

	addDevice(tenant, deviceData) {
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.resources.devices, deviceData);
		});
	}

	getTemplates(tenant) {
		console.log('Loading templates');
		return this.loadTenantClient(tenant).then(client => {
			return client.get(this.resources.templates)
		});
	}

	addTemplate(tenant, templateData) {
		console.log('Adding template', templateData);
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.resources.templates, templateData)
		});
	}

	getTenants(tenant) {
			// TODO: get from dojot
			return Promise.resolve({
				status:200,
				data: {
					tenants: this.tenants,
				}
			});
	}

}

