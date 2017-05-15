/// <reference path="../../../typing.d.ts" />
import React, { PureComponent } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import TimeLine from './Timeline';
import Feed from './Feed';

export const Navigator = StackNavigator({
    TimeLine: { screen: TimeLine },
    Feed: { screen: Feed },
});

interface NavigatiorProps {
    dispatch: Dispatch<any>;
    nav: any;
}

const mapStateToProps = (state: any) => ({
    nav: state.get('nav'),
});

class AppWithNavigationState extends PureComponent<NavigatiorProps, {}> {
    public render() {
        return (
            <Navigator
                navigation={addNavigationHelpers({
                    dispatch: this.props.dispatch,
                    state: this.props.nav,
                })}
            />
        );
    }
}

const ConnectedNavigatior = connect(mapStateToProps)(AppWithNavigationState);

export default ConnectedNavigatior;
