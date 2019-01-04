import React, { Component } from 'react';
import Tenant from './Tenant';

export default class Workspace extends Component {

	handleChange = (event, fieldName) => {
		let newData = event.target.value;
		console.log('Updating', fieldName, 'to', newData);
		this.setState({[fieldName]: newData});
	};

	render() {
		console.log('rendering Workspace');
		console.log(this.props)
		return (
			<div>
				<h1>Workspace</h1>

				{this.props.tenants.map((tenant) => {
					return <Tenant 
							key={tenant.name} 
							tenantName={tenant.name}
							dojotClient={this.props.dojotClient}
							/>
				})}

				<h1>/Workspace</h1>
			</div>
		);
	}
}
