import React, { Component } from 'react';
import Device from './Device';

export default class Tenant extends Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			templates: [],
			selectedTemplateId: -1,
			newDeviceName: '',
		}
	}

	componentDidMount() {
		let {tenantName, dojotClient} = this.props;
		console.log('Tenant', tenantName, 'just mounted');
		dojotClient.getTemplates(tenantName).then(response => {
			console.log('Loaded templates', response, 'for tenant', tenantName);
			let templates = response.data.templates;
			this.setState({templates});
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
		let {selectedTemplateId, newDeviceName} = this.state;
		let {tenantName} = this.props;
		
		let deviceData = {
			"templates": [
				"" + selectedTemplateId,
			],
			"label": newDeviceName,
		};

		console.log('Adding device', deviceData, 'on tenant', tenantName);
		this.props.dojotClient.addDevice(tenantName, deviceData).then(response => {
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
		let tenantId = this.props.tenantName;
		this.props.dojotClient.sendDeviceMessage(tenantId, deviceId, message).then(() => {
			console.log('Message sent');
		});
	}

	createSampleTemplate = () => {
		let tenantId = this.props.tenantName;

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
		this.props.dojotClient.addTemplate(tenantId, templateData).then(response => {
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
		let hasDevices = devices.length > 0;



		return (
			<div>
				<h1>Tenant</h1>
				<h2>{`${this.props.tenantName}`}</h2>

					{!hasStubTemplate && (<input type="button" value="+ Sample template" onClick={this.createSampleTemplate}/>)}

					{hasTemplates && (
			<div>
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
				<input type="text" onChange={(e) => this.handleChange(e, 'newDeviceName')}/>
				<input type="button" onClick={this.addDevice} value="+ Device"/>
			</div>
					
					)}

					{hasDevices && (
									<div>
									{this.state.devices.map((device) => {
					return (
						<Device 
							key={device.id}
							deviceData={device}
							onDeviceMessage={this.handleDeviceMessage}
							/>
					);
				})};
					</div>
					)}

				<h1>/Tenant</h1>
			</div>
		);

	}
}
