import React, { Component } from 'react';

export default class Device extends Component {

	constructor(props) {
		super(props);

		let {onDeviceMessage} = props;

		let deviceId = props.data.id;
		let message = {message: `hi from ${deviceId}`};

		this.state = {
			deviceId,
			message,
			onDeviceMessage,
		}
	}

	handleChange = (e) => {
		let message = e.target.value;
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
		let defaultVal = this.state.message; //{message: `hi from ${deviceId}`};
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
