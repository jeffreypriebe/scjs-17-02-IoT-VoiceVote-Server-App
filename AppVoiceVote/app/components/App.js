import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Recorder } from './Recorder';
import { GiftedChat } from 'react-native-gifted-chat';

import { socketConnect } from '../actions';

const ID_SELF = 1;

export class AppComponent extends Component {
  
  componentDidMount() {
    this.props.actions.socketConnect('test');
  }
  

	render() {
    const { messages } = this.props.state.messages;

		return (
      <View style={styles.container}>
				<Recorder style={styles.recorder} />
				<GiftedChat messages={messages} user={{ _id: ID_SELF }} />
			</View>
		);
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


export const App = connect(
	state => ({ state }),
  dispatch => ({ actions: bindActionCreators({ socketConnect }, dispatch) }),
)(AppComponent);
