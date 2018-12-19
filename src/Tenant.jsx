import React, { Component } from 'react';
import Device from './Device';
import DojotClient from './DojotClient';


export default class Tenant extends Component {
	constructor(props) {
		super(props);

		let {tenantName, dojotClient} = props;

		this.state = {
			tenantName,
			dojotClient,
			devices: [],
			templates: [],

		}
	}


	componentDidMount() {
		console.log('Current tenant state', this.state);
		let {tenantName, dojotClient} = this.state;
		dojotClient.getTemplates(tenantName).then(response => {
			console.log('Got response', response, 'for tenant', tenantName);
			let templates = response.data.templates;
			let selectedTemplate = templates ? templates[0].id : -1
			this.setState({templates, selectedTemplate });
		}).catch(error => {
			console.log('Failed to load templates for', tenantName, ':', error);
			this.setState({templates : []});
		});

		dojotClient.getDevices(tenantName).then(response => {
			console.log('Got response', response, 'for tenant', tenantName);
			let devices = response.data.devices;
			this.setState({devices});
		}).catch(error => {
			console.log('Failed to load devices for', tenantName, ':', error);
			this.setState({devices : []});
		});
	}


	addDevice = () => {
		let {tenantName, selectedTemplate, newDeviceName} = this.state;
		
		let deviceData = {
			"templates": [
				"" + selectedTemplate,
			],
			"label": newDeviceName,
		};

		console.log('Adding device', deviceData, 'on tenant', tenantName);
		this.state.dojotClient.addDevice(tenantName, deviceData).then(response => {
			let device = response.data.devices[0];
			console.log('Device', device, 'created');
			this.setState({devices: [...this.state.devices, device]});
		});
	}

	handleChange = (event, fieldName) => {
		let newData = event.target.value;
		console.log('Updating', fieldName, 'to', newData);
		this.setState({[fieldName]: newData});
	};

	handleDeviceMessage = (deviceId, message) => {
		let tenantId = this.state.tenantName;
		this.state.dojotClient.sendDeviceMessage(tenantId, deviceId, message);
	}

	render() {
		return (
			<div>
				<h1>Tenant</h1>
				<h2>{`${this.state.tenantName}`}</h2>
				<div>
					<select onChange={(e) => { this.handleChange(e, 'selectedTemplate'); }}>
						{this.state.templates.map(template => {
							return (
								<option 
									key={template.id}
									value={template.id}
									>
									{template.label}
								</option>

							);
						})}
					</select>
					<input type="text" onChange={(e) => this.handleChange(e, 'newDeviceName')}/>
					<input type="button" onClick={this.addDevice} value="+ Device"/>
				</div>
				
				{this.state.devices.map((device) => {
					return (
						<Device 
							key={device.id}
							deviceId={device.id}
							onDeviceMessage={this.handleDeviceMessage}
							/>
					);
				})}

				<h1>/Tenant</h1>
			</div>
		);
	}
}
