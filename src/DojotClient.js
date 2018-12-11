import mockData from './mock/data';

export default class DojotClient {

	constructor() {
		this.devices = mockData.devices;
		this.templates = mockData.templates;
	}

	getDevices = (tenant) => {
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
