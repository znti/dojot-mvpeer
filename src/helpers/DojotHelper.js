const HttpHelper = require('./HttpHelper');

const iotalib = require('@dojot/iotagent-nodejs');


module.exports = class DojotHelper {

	constructor(configss) {

		let dojotConfigs = configss.dojot;

		this.clientsMap = [];

		this.configs = dojotConfigs;
		console.log('Building a helper with configs', this.configs);

		this.resources = dojotConfigs.resources;
		console.log('Set resources as', this.resources);

		let dojotEndpoint = `${dojotConfigs.host}:${dojotConfigs.port}`

		this.dojotEndpoint = dojotEndpoint;

		this.iotAgentClient = new iotalib.IoTAgent('mvpeer');

		this.iotAgentClient.init().then(() => {
			console.log('Initialized iot agent');
			return this.getTenants();
				//.then(tenants => {
//				console.log('Retrieved tenants', tenants);
//				return tenants;
//			});
		}).then(tenants => {
			console.log('Setting clients for each tenant');
			tenants.map(tenant => {
				console.log('Preparing client for tenant', tenant);

				let tenantName = tenant;

				let username = 'admin';
				let passwd = 'admin';

				if(tenantName !== 'admin') {
					username = `${tenantName}_admin`;
					passwd = 'temppwd';
				}

				let credentials = {username, passwd};

				this.setTenantClient(tenantName, credentials);
			});
		});

	}

	setTenantClient(tenantName, credentials) {
			console.log('Retrieving access token for tenant', tenantName);
			let httpClient = new HttpHelper(this.dojotEndpoint);
			httpClient.post(this.resources.auth, credentials).then(response => {
				let jwt = response.data.jwt;
				httpClient.setAuthToken(jwt).then(() => {
					console.log('Tenant', tenantName, 'client set.');
					this.clientsMap.push({
						tenantName,
						client: httpClient,
					});
				}).catch(error => {
					let message = error.response.data.message;
					console.log('Failed to set auth token on', tenantName, message);
				});
			}).catch(error => {
				console.log('Failed to authenticate for', tenantName, ':', error);
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
			return client.get(this.resources.devices);
		});
	}

	addDevice(tenant, deviceData) {
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.resources.devices, deviceData);
		});
	}


	sendDeviceMessage(tenantName, deviceId, message) { 
		console.log('Sending message', message, 'to device', deviceId, 'on tenant', tenantName);
		let metadata = {
			timestamp: Date.now(),
		}
		this.iotAgentClient.updateAttrs(deviceId, tenantName, message, metadata);
		Promise.resolve({deviceId, tenantName, message, metadata});

//		let endpoint = `/tenants/${tenant}/devices/${deviceId}/messages`;
//		return this.iotAgentClient.post(endpoint, message)
			//.then(response => {
			//return Promise.resolve(tenants);
		//});
	}

	getTemplates(tenant) {
		console.log('Loading templates');
		return this.loadTenantClient(tenant).then(client => {
			return client.get(this.resources.templates);
		});
	}

	addTemplate(tenant, templateData) {
		console.log('Adding template', templateData);
		return this.loadTenantClient(tenant).then(client => {
			return client.post(this.resources.templates, templateData);
		});
	}

	addTenant(tenantData) {
		console.log('Adding tenant', tenantData);
		let tenant = 'admin';
		return this.loadTenantClient(tenant).then(client => {


			let tenantName = tenantData.name;
			let adminUsername = `${tenantName}_admin`;

			let userData = {
				username: adminUsername,
				service: tenantName,
				email: `${tenantName}@noemail.com`,
				name: adminUsername,
				profile: "admin"
			}

			console.log('Creating tenant from data', userData);

			return client.post(this.resources.tenants, userData).then(response => {
				console.log('Tenant created', response.data, response.status);	

				let username = adminUsername;
				let passwd = 'temppwd';

				setTimeout(() => {
					console.log('Adding a dojotClient for', tenantName);
					this.setTenantClient(tenantName, {username, passwd});
				}, 5000);

				return Promise.resolve({
					status: response.status,
					data: {
						message: 'tenant created',
						tenant: tenantName,
						admin: {
							username,
							passwd,
						}
					},
				})
			}).catch(err => {
				console.log('Failed to create tenant');
				return Promise.reject(err);
			});
		});
	}

	getTenants() {
		let tenants = this.iotAgentClient.messenger.tenants;
		return Promise.resolve(tenants);

	//	let endpoint = '/tenants';
	//	return this.iotAgentClient.get(endpoint).then(response => {
	//		let tenants = response.data.tenants;	
	//		let newTenants = tenants.map(t => { return {name:t} });
	//		console.log('Transformed', tenants, 'to', newTenants);
	//		return Promise.resolve(newTenants);
	//	});
	}

}

