/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import uuid from 'uuid';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import RNFetchBlob from 'react-native-fetch-blob';
import { GiftedChat } from 'react-native-gifted-chat';

export default class AppVoiceVote extends Component {
  state = {
    currentTime: 0.0,
    recording: false,
    stoppedRecording: false,
    finished: false,
		transcribing: false,
		transcribed: 'Record Something to start',
    audioPath: `${AudioUtils.DocumentDirectoryPath}/recording.wav`,
    hasPermission: true, // iOS somehow always has it? At launch? Dunno.
		messages: [],
  }

  prepareRecodingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: "Med",
      AudioEncoding: "lpcm",
      AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    this.prepareRecodingPath(this.state.audioPath);
    
    AudioRecorder.onProgress = data => this.setState({ currentTime: Math.floor(data.currentTime )});
    AudioRecorder.onFinished = data => this._finishRecording(data.status === "OK", data.audioFileURL);
		
		this.onSend = this.onSend.bind(this);
		
		this.RecordStart = this.RecordStart.bind(this);
		this.RecordStop = this.RecordStop.bind(this);
  }
  
	async Record() {
		const { recording } = this.state;
		if (recording) return this.RecordStop();
		else return this.RecordStart();
	}
  async RecordStart() {
    if(this.state.stoppedRecording) this.prepareRecodingPath(this.state.audioPath);
    
    this.setState({ recording: true });
		this.autoStop = setTimeout(() => this.RecordStop(), 4500);
    
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
      this.setState({ recording: false });
    }
  }
  async RecordStop() {
		if (this.autoStop) this.autoStop = undefined;
    this.setState({ stoppedRecording: true, recording: false });
		
		try {
			const filePath = await AudioRecorder.stopRecording();
			return filePath;
		} catch (error) {
			console.error(error);
		}
  }

  render() {
    const { messages, recording, transcribed } = this.state;
		const buttonText = recording ? 'Stop Recording' : 'Start Recording';

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Audio PoC
        </Text>
        <Button onPress={this.Record.bind(this)} title={buttonText} />
				<Button onPress={this.elephantInCairo.bind(this)} title="Un Elefante" />
				<Text>Result: {transcribed}</Text>
				<GiftedChat style={styles.chat} messages={messages} onSend={this.onSend} user={{ _id: 2 }} />
      </View>
    );
  }
	
	onSend(messages = []) {
		this.setState(prev => { messages: GiftedChat.append(prev.messages, messages) });
	}

	elephantInCairo() {
		console.log('elephant in cairo')
		this.setState({ messages: this.updateMessages(this.state.messages, `Elephant in Cairo : ${uuid.v4()}`) });
	}

	_finishRecording(didSucceed, filePath) {
		console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
		
		const gsReq = {
			config: {
				encoding: 'LINEAR16',
				sampleRate: 16000,
				languageCode: 'en-US',
				maxAlternatives: 1,
				profanityFilter: true
			},
			audio: { },
		};
		
		this.setState({ finished: didSucceed, transcribing: true });
		RNFetchBlob.fs.readFile(filePath.replace('file://',''), 'base64').then(data => {
			gsReq.audio.content = data;
			
			fetch(
				'https://speech.googleapis.com/v1beta1/speech:syncrecognize?key=AIzaSyCGj_tTEv9scx-5qhbCV4oK6IXiZOI24Fk',
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(gsReq),
				}
			).then(r => r.json())
			.then(response => {
				console.log(response);
				const { transcript:message } = (response && response.results && response.results[0] && response.results[0].alternatives) ? response.results[0].alternatives[0] : { transcript: '[UNRECOGNIZED]' };
				const messages = this.updateMessages(this.state.messages, message);
				//this.setState(prev => { messages: GiftedChat.append(prev.messages, messages) });
				this.setState({ transcribing: false, transcribed: message, messages });
			}).catch(error => {
				console.error(error);
				this.setState({ transcribing: false, transcribed: "[ERROR]" })
			})
		});
	}
	
	updateMessages (currentMessages, newMessage) {
		let newMessages = currentMessages.slice();
		newMessages.splice(0, 0, {
			_id: uuid.v4(),
			text: newMessage, createdAt: new Date(), user: { _id: 2, name: 'JP', avatar: 'https://facebook.github.io/react/img/logo_og.png' }
		});
		return newMessages;
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
	chat: {
		alignSelf: 'center',
		width: 620,
	},
});

AppRegistry.registerComponent('AppVoiceVote', () => AppVoiceVote);
