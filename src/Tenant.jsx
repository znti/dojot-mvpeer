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
		let {tenantName, dojotClient} = this.state;
		console.log('Tenant', tenantName, 'just mounted');
		dojotClient.getTemplates(tenantName).then(response => {
			console.log('Loaded templates', response, 'for tenant', tenantName);
			let templates = response.data.templates;
			let selectedTemplateId = templates ? templates[0].id : -1
			this.setState({templates, selectedTemplateId });
		}).catch(error => {
			console.log('Failed to load templates for', tenantName, ':', error);
			this.setState({templates : []});
		});

		dojotClient.getDevices(tenantName).then(response => {
			console.log('Got response', response, 'for tenant', tenantName);
			console.log('Loaded devices', response, 'for tenant', tenantName);
			let devices = response.data.devices;
			this.setState({devices});
		}).catch(error => {
			console.log('Failed to load devices for', tenantName, ':', error);
			this.setState({devices : []});
		});
	}


	addDevice = () => {
		let {tenantName, selectedTemplateId, newDeviceName} = this.state;
		
		let deviceData = {
			"templates": [
				"" + selectedTemplateId,
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
		this.state.dojotClient.sendDeviceMessage(tenantId, deviceId, message).then(() => {
			console.log('im back');
		});
	}

	createSampleTemplate = () => {
		let tenantId = this.state.tenantName;

		let templateData = {
			label: "stub",
			attrs: [
			  {
			    label: "message",
			    type: "dynamic",
			    value_type: "string"
			  }
			]
		}

		console.log('Creating stub template', templateData, 'for tenant', tenantId); 
		this.state.dojotClient.addTemplate(tenantId, templateData). then(response => {
			let template = response.data.template;
			console.log('Template', template, 'created');
			this.setState({
				templates: [...this.state.templates, template],
				selectedTemplateId: template.id,
			});

		});
	}

	render() {

		let {templates, devices} = this.state;
		let hasStubTemplate = templates.find(x => x.label === "stub");
		let hasTemplates = templates.length > 0;

		let options = templates.map(template => {
							return (
								<option 
									key={template.id}
									value={template.id}
									>
									{template.label}
								</option>

							);
						});
		let templateSelector = (
				
					<select onChange={(e) => { this.handleChange(e, 'selectedTemplateId'); }}>
						{templates.map(template => {
							return (
								<option 
									key={template.id}
									value={template.id}
									>
									{template.label}
								</option>

							);
						})};

					</select>
		);


		let devicesList = this.state.devices.map((device) => {
					return (
						<Device 
							key={device.id}
							deviceData={device}
							onDeviceMessage={this.handleDeviceMessage}
							/>
					);
				});


		let addStubTemplateDiv = (
			<div>
				<input type="button" value="+ Sample template" onClick={this.createSampleTemplate}/>
			</div>
		);

		let templatesDiv = (
			<div>
				{templateSelector}				
				<input type="text" onChange={(e) => this.handleChange(e, 'newDeviceName')}/>
				<input type="button" onClick={this.addDevice} value="+ Device"/>
			</div>
		);
		

		return (
			<div>
				<h1>Tenant</h1>
				<h2>{`${this.state.tenantName}`}</h2>

					{!hasStubTemplate && addStubTemplateDiv}

					{hasTemplates && templatesDiv}

					{devicesList}

				<h1>/Tenant</h1>
			</div>
		);

	}
}
