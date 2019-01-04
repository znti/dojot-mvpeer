import React, { Component } from 'react';

export default class Device extends Component {

	constructor(props) {
		super(props);

		let {onDeviceMessage, deviceId} = props;

		let message = {message: `hi from ${deviceId}`};

		this.state = {
			deviceId,
			message,
			onDeviceMessage,
		}
	}

	handleChange = (e) => {
		let message = e.target.value;
		try {
			message = JSON.parse(message);
			console.log('Parsed message into', message);
		} catch {
			console.error('Could not parse message into a valid json');
		}

		console.log(`[${this.state.deviceId}] - message set as`, message);
		this.setState({message});
	}

	handleSend = (e) => {
		let {deviceId, message} = this.state;
//		console.log(`Sending ${JSON.stringify(message)} from ${deviceId}`);
		this.state.onDeviceMessage(deviceId, message);
		
	}

	render() {
		let deviceId = this.state.deviceId;
		let defaultVal = this.state.message;

		return (
			<div>
				<h2>{`Device ${deviceId}`}</h2>
				<textarea
					defaultValue={JSON.stringify(defaultVal)}
					onChange={this.handleChange}
					>
				</textarea>
				<input type="button" value="Send" onClick={this.handleSend}/>
			</div>
		);
	}

}
