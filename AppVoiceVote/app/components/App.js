import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import uuid from 'uuid';

import { Recorder } from './Recorder';
import { GiftedChat } from 'react-native-gifted-chat';

export class App extends Component {
  state = {
		messages: [],
  }

	render() {
    const { messages } = this.state;

		return (
      <View style={styles.container}>
				<Recorder style={styles.recorder} />
				<GiftedChat messages={messages} user={{ _id: 2 }} />
			</View>
		);
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
		paddingTop: 30,
  },
});
