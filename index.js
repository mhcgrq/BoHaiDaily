import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import ConnectedNavigatior from './src/ui/App';
import store from './src/index/configureStore';

const App = () => (
    <Provider store={store}>
        <ConnectedNavigatior/>
    </Provider>
);


AppRegistry.registerComponent('BoHaiDaily', () => App);
