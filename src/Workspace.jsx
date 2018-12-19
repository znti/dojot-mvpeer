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

	render() {
		return (
			<div>
				<h1>Workspace</h1>
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
