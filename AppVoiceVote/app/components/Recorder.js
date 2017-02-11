import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { initRecording, startRecording, stopRecording } from '../actions';

class RecorderComponent extends Component {
  state = {
		currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    finished: false,
  }
	
	render() {
    const { recording } = this.state;
		const buttonText = recording ? 'Stop Recording' : 'Start Recording';
		
		return (
			<View style={styles.container}>
        <Text>Send a message</Text>
        <Button onPress={this.record.bind(this)} title={buttonText} />
			</View>
		);
	}

	componentDidMount() {
		const { actions: { initRecording } } = this.props;

		initRecording(
			finished => this.setState({ finished }),
			data => this.setState({ currentTime: Math.floor(data.currentTime) }),
		);

		this.RecordStart = this.recordStart.bind(this);
		this.RecordStop = this.recordStop.bind(this);
	}

	componentWillUnmount() {
		this.autoStop = undefined;
	}

	async record() {
		const { recording } = this.state;
		
		if (recording) return this.recordStop();
		else return this.recordStart();
	}
	async recordStart() {
		if (this.state.stoppedRecording) initRecording();

		this.setState({ recording: true });
		this.autoStop = setTimeout(() => this.recordStop(), 4500);

		try {
			const filePath = await startRecording();
		} catch (error) {
			console.error(error);
			this.setState({ recording: false });
		}
	}
	async recordStop() {
		if (this.autoStop) this.autoStop = undefined;
		this.setState({ stoppedRecording: true, recording: false });

		try {
			const filePath = await stopRecording();
			return filePath;
		} catch (error) {
			console.error(error);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		alignItems: 'center'
	},
});

export const Recorder = connect(
	state => ({ state }),
	dispatch => ({ actions: bindActionCreators({ initRecording }, dispatch) }),
)(RecorderComponent);