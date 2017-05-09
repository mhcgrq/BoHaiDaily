import React, { PureComponent } from 'react';
import {
    // View,
    FlatList,
    Text,
    TouchableHighlight,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { getTimeline } from '../redux/action';

interface Props {
    status: string;
    data: List<Map<string, string>>;
    dispatch: Dispatch<any>;
}

class TimeLine extends PureComponent<Props, {}> {
    public componentDidMount() {
        this.props.dispatch(getTimeline(1));
    }
    public render() {
        return (
            <FlatList
                data={this.props.data.toJS()}
                renderItem={this.renderItem}
            />
        );
    }
    private renderItem = (info: { item: { title: string; href: string; } }) => {
        const { title, href } = info.item;
        return (
            <TouchableHighlight onPress={this.openFeed(title, href)}>
                <Text>{title}</Text>
            </TouchableHighlight>
        );
    }
    private openFeed = (title: string, href: string) => () => {
        console.log(title, href);
    }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['timeline', 'status']),
    data: state.getIn(['timeline', 'data']),
});

export default connect(mapPropsToState)(TimeLine);
