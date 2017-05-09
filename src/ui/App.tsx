import React from 'react';
// import {
//     View,
// } from 'react-native';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import store from '../index/configureStore';
import TimeLine from './Timeline';

const Router = StackNavigator({
    TimeLine: { screen: TimeLine },
});

const App = () => (
    <Provider store={store}>
        <Router />
    </Provider>
);

export default App;
