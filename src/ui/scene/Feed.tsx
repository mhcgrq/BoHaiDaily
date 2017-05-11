import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    Text,
    ViewToken,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import Picture from '../component//Picture';
import { getFeed } from '../../redux/action';

interface Props extends NavigationNavigatorProps<{ title: string; href: string; }> {
    status: string;
    data: List<Map<string, string>>;
    dispatch: Dispatch<any>;
}

interface State {
    cellVisibility: Map<string, boolean>;
}

class Feed extends PureComponent<Props, State> {
    public state = {
        cellVisibility: Map<string, boolean>(),
    };
    public componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    public componentWillReceiveProps(nextProps: Props) {
        let cellVisibility = Map<string, boolean>();
        nextProps.data
            .toJS()
            .forEach((item: { title: string; src: string; }) => {
                cellVisibility = cellVisibility.set(item.title, false);
            }),
        this.setState({ cellVisibility });
    }
    public render() {
        return (
            <FlatList
                data={this.props.data.toJS()}
                renderItem={this.renderItem}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item) => item.title}
            />
        );
    }
    private renderItem = (info: { item: { title: string; src: string; } }) => {
        const { title, src } = info.item;
        // console.log('src: ', src);
        return (
            <View key={title} style={{ flex: 1 }}>
                <Text>{title}</Text>
                <Picture
                    src={src}
                    title={title}
                    isViewable={this.state.cellVisibility.get(title)}
                />
            </View>
        );
    }
    private onViewableItemsChanged = (info: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
        let cellVisibility = this.state.cellVisibility;
        info.changed.forEach((item) => {
            cellVisibility = cellVisibility.set(item.key, item.isViewable);
        });
        this.setState({ cellVisibility });
    }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'data']),
});

export default connect(mapPropsToState)(Feed);
