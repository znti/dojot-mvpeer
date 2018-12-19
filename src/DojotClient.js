import mockData from './mock/data';
import configs from './configs'

import HttpHelper from './helpers/HttpHelperES6';

export default class DojotClient {

	constructor() {
		this.devices = mockData.devices;
		this.templates = mockData.templates;
		let serverEndpoint = `${configs.server.host}:${configs.server.port}`;
		console.log('Loading httpClient pointing to', serverEndpoint);
		this.httpClient = new HttpHelper(serverEndpoint);
	}

	getDevices = (tenant) => {
		console.log('DojotClient loading devices for', tenant);
		let endpoint = `/api/tenants/${tenant}/devices`;
		return this.httpClient.get(endpoint);
	}

	addDevice = (tenant, deviceData) => {
		console.log('DojotClient adding new device for tenant', tenant);
		let endpoint = `/api/tenants/${tenant}/devices`;
		return this.httpClient.post(endpoint, deviceData);
	}

	sendDeviceMessage = (tenant, deviceId, message) => {
		console.log(`Sending ${JSON.stringify(message)} to /${tenant}/${deviceId}`);
	}

	getTemplates = (tenant) => {
		console.log('DojotClient loading templates for', tenant);
		let endpoint = `/api/tenants/${tenant}/templates`;
		return this.httpClient.get(endpoint);
	}

	getTenants = () => {
		let endpoint = `/api/tenants`;
		console.log('Requesting', endpoint);
		return this.httpClient.get(endpoint);
	}

}
