import React, { Component } from 'react';
//import Device from './Device';
import DojotClient from './DojotClient';
import Tenant from './Tenant';

export default class Workspace extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tenants: [
				{tenantName: 'admin', id: '0'},
				{tenantName: 'test', id: '1'},
			],
		}
	}


	componentWillMount() {
		let dojotClient = new DojotClient();
		this.setState({dojotClient});
	}

	render() {
		return (
			<div>
				<h1>Workspace</h1>
				{this.state.tenants.map((tenant) => {
					let data = {
						tenantName: tenant.tenantName,
						dojotClient: this.state.dojotClient
					}
					return <Tenant key={tenant.id} data={data}/>
				})}

				<h1>/Workspace</h1>
			</div>
		);
	}
}
