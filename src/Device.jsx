import React, { Component } from 'react';

export default class Device extends Component {

	constructor(props) {
		super(props);
		this.state = {...props};
	}

	render() {
		let deviceId = this.state.data.id;
		return (
			<h2>{`Device ${deviceId}`}</h2>
		);
	}

}
