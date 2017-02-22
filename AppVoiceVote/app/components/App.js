import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Recorder } from './Recorder';
import { GiftedChat } from 'react-native-gifted-chat';

import { sendMessage, socketConnect } from '../actions';

const ID_SELF = 1;

export class AppComponent extends Component {
	render() {
    const { roomName } = this.state || {};
    const { connected, messages } = this.props.state.messages;

		return (
      <View style={styles.container}>
        {connected ? (
          <View style={styles.container}>
            <Recorder style={styles.recorder} />
            <GiftedChat messages={messages} onSend={this.onSend} user={{ _id: ID_SELF }} />
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.inputs}
              onChangeText={roomName => this.setState({ roomName })}
              value={roomName}
              autoCapitalize="none"
              autoFocus={true}
            />
            <Button style={styles.inputs} onPress={this.connect} title="Connect to Device" />
          </View>
        )}
			</View>
		);
	}
  
  connect = () => {
    const { roomName } = this.state;
    this.props.actions.socketConnect(roomName);
  }
  
  onSend = (messages = []) => {
    this.props.actions.sendMessage(messages[0].text);
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
  inputs: {
    borderColor: '#333333',
    width: 140,
    height: 40,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 10,
  },
});


export const App = connect(
	state => ({ state }),
  dispatch => ({ actions: bindActionCreators({ sendMessage, socketConnect }, dispatch) }),
)(AppComponent);
