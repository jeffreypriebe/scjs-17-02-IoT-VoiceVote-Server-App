import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { AppContainer } from './app-container';

export default class AppVoiceVote extends Component {
  render() {
    return <AppContainer />;
  }
}

AppRegistry.registerComponent('AppVoiceVote', () => AppVoiceVote);
