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
import { NavigationNavigatorProps } from 'react-navigation';
import { getTimeline, navOpenFeed } from '../../redux/action';

interface Props extends NavigationNavigatorProps<{}> {
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
                keyExtractor={(item) => item.title}
            />
        );
    }
    private renderItem = (info: { item: { title: string; href: string; } }) => {
        const { title, href } = info.item;
        return (
            <TouchableHighlight key={title} onPress={this.openFeed(title, href)}>
                <Text>{title}</Text>
            </TouchableHighlight>
        );
    }
    private openFeed = (title: string, href: string) => () => {
        console.log(title, href);
        this.props.dispatch(navOpenFeed(title, href));
    }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'timeline', 'status']),
    data: state.getIn(['root', 'timeline', 'data']),
});

export default connect(mapPropsToState)(TimeLine);
