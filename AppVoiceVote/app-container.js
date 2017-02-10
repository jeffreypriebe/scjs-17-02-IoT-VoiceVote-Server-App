import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { App } from './app/components';
import configureStore from './app/store'

const store = configureStore();

export class AppContainer extends Component {
	render() {
		return (
			<Provider store={store}>
				<App />
			</Provider>
		);
	}
}
