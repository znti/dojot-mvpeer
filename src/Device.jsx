import React, { Component } from 'react';

export default class Device extends Component {

	constructor(props) {
		super(props);

		let deviceId = props.deviceData.id
		console.log('loaded device', props.deviceData);

		this.state = {
			message: {message: `hi from ${deviceId}`},
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
		let {message} = this.state;
		let deviceId = this.props.deviceData.id;
		this.props.onDeviceMessage(deviceId, message);
	}

	render() {

		let {deviceData} = this.props;

		let deviceId = deviceData.id;
		let deviceName = deviceData.label;

		console.log('rendering device', deviceId);

		let {message} = this.state;

		return (
			<div>
				<p>{`Device ${deviceName} (id ${deviceId})`}</p>
				<textarea
					defaultValue={JSON.stringify(message)}
					onChange={this.handleChange}
					>
				</textarea>
				<input type="button" value="Send" onClick={this.handleSend}/>
			</div>
		);
	}
}
