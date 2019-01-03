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

	sendDeviceMessage = (tenant, deviceId, messageData) => {
		let endpoint = `/api/tenants/${tenant}/devices/${deviceId}`;
		console.log('Sending', messageData, 'to', endpoint);
		return this.httpClient.post(endpoint, messageData);
	}

	addTemplate = (tenant, templateData) => {
		console.log('DojotClient adding new template', templateData, 'for tenant', tenant);
		let endpoint = `/api/tenants/${tenant}/templates`;
		return this.httpClient.post(endpoint, templateData);
	}

	getTemplates = (tenant) => {
		console.log('DojotClient loading templates for', tenant);
		let endpoint = `/api/tenants/${tenant}/templates`;
		return this.httpClient.get(endpoint);
	}

	addTenant = (tenantData) => {
		let endpoint = `/api/tenants`;
		console.log('addTenant requesting', endpoint, 'with data', tenantData);
		return this.httpClient.post(endpoint, tenantData);
	}

	getTenants = () => {
		let endpoint = `/api/tenants`;
		console.log('Requesting', endpoint);
		return this.httpClient.get(endpoint);
	}

}
