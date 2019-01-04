import React, { Component } from 'react';

import SimpleCard from './mui/SimpleCard';

export default class Toolbar extends Component {

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
		this.props.dojotClient.addTenant(tenantData).then(response => {
			console.log('Tenant', tenantName, 'added');
			this.props.onTenantAdded(tenantData);
		});
	}

	render() {
		console.log('rendering Toolbar');
		return (
			<SimpleCard>
				<h2>Add tenant</h2>
				<input type="text" onChange={(e) => this.handleChange(e, 'newTenantName')}/>
				<input type="button" onClick={this.addTenant} value="+ Tenant"/>
			</SimpleCard>

		);
	}
}
