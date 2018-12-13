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
		let endpoint = `/api/${tenant}/devices`
		return this.httpClient.get(endpoint);
	}

	oGetDevices = (tenant) => {
		return new Promise((res, rej) => {
			console.log('DojotClient loading devices for', tenant);
			res(this.devices);
		});
	}

	addDevice = (tenant, deviceData) => {
		return new Promise((resolve, reject) => {
			console.log('DojotClient adding new device for tenant', tenant);
			resolve(this.devices);
		});
	}

}
