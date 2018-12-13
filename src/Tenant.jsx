import React, { Component } from 'react';
import Device from './Device';
import DojotClient from './DojotClient';


export default class Tenant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			...props,
			devices: [],

		}
	}


	componentDidMount() {
		console.log('Current tenant state', this.state);
		let dojotClient = this.state.data.dojotClient;
		let tenantName = this.state.data.tenantName;
		dojotClient.getDevices(tenantName).then(response => {
			console.log('Got response', response, 'for tenant', tenantName);
			let devices = response.data.devices;
			this.setState({devices});
		}).catch(error => {
			console.log('Failed to load devices for', tenantName, ':', error);
			this.setState({devices : []});
		});
	}

	render() {
		return (
			<div>
				<h1>Tenant</h1>
				<h2>{`${this.state.data.tenantName}`}</h2>
				
				{this.state.devices.map((device) => {
					return <Device data={device}/>
				})}

				<h1>/Tenant</h1>
			</div>
		);
	}
}
