import React, { Component } from 'react';
import Tenant from './Tenant';

export default class Workspace extends Component {
	static displayName = 'Workspace';

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

				{this.props.tenants.map((tenant) => {
					return <Tenant 
							key={tenant.name} 
							tenantName={tenant.name}
							dojotClient={this.props.dojotClient}
							/>
				})}

			</div>
		);
	}
}
