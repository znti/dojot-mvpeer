import React, { Component } from 'react';
//import Device from './Device';
import DojotClient from './DojotClient';
import Tenant from './Tenant';

export default class Workspace extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tenants: [],
		}
	}


	componentWillMount() {
		let dojotClient = new DojotClient();
		this.setState({dojotClient});

		console.log('Retrieving tenants data');
		dojotClient.getTenants().then(response => {
			let {tenants} = response.data;
			console.log('Loaded tenants:', tenants);
			this.setState({tenants});
		});
	}

	handleChange = (event, fieldName) => {
		let newData = event.target.value;
		console.log('Updating', fieldName, 'to', newData);
		this.setState({[fieldName]: newData});
	};

	addTenant = (event) => {
		let tenantName = this.state.newTenantName;

		let tenantData = {
			name: tenantName,
		}

		console.log('Adding tenant', tenantData);
		this.state.dojotClient.addTenant(tenantData).then(response => {
			console.log('Tenant', tenantName, 'added');
			this.setState({tenants: [...this.state.tenants, tenantData]});
		});
	}

	render() {
		return (
			<div>
				<h1>Workspace</h1>

				<div>
					<input type="text" onChange={(e) => this.handleChange(e, 'newTenantName')}/>
					<input type="button" onClick={this.addTenant} value="+ Tenant"/>
				</div>

				{this.state.tenants.map((tenant) => {
					return <Tenant 
							key={tenant.id} 
							tenantName={tenant.name}
							dojotClient={this.state.dojotClient}
							/>
				})}

				<h1>/Workspace</h1>
			</div>
		);
	}
}
