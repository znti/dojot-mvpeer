import React, { Component } from 'react';
import DojotClient from './DojotClient';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

class App extends Component {

	constructor(props) {
		super(props);
		let dojotClient = new DojotClient();
		this.state = {
			dojotClient,
			tenants: [],
		};
	}

	componentWillMount() {
		console.log('Retrieving tenants data');
		this.state.dojotClient.getTenants().then(response => {
			let {tenants} = response.data;
			console.log('Loaded tenants:', tenants);
			this.setState({tenants});
		});
	}

	handleTenantAdded = (newTenantData) => {
		this.setState({tenants: [...this.state.tenants, newTenantData]}, () => {
			console.log('Update tenants to', this.state.tenants);
		});
	}

	render() {
		console.log('rendering App');
		return (
			<div>
				<Toolbar
					dojotClient={this.state.dojotClient}
					onTenantAdded={this.handleTenantAdded}
					/>
				<Workspace 
					tenants={this.state.tenants} 
					dojotClient={this.state.dojotClient}
					/>
			</div>
		);
	}
}

export default App;
