import React, { Component } from 'react';


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
			<div>
				<h1>Toolbar</h1>

				<div>
					<input type="text" onChange={(e) => this.handleChange(e, 'newTenantName')}/>
					<input type="button" onClick={this.addTenant} value="+ Tenant"/>
				</div>

				<h1>/Toolbar</h1>
			</div>
		);
	}
}
