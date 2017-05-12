import React, { PureComponent } from 'react';
import {
    FlatList,
    ViewToken,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import FeedCell, { CELL_HEIGHT } from '../component/FeedCell';
import { getFeed, requestFeedNextPage } from '../../redux/action';

interface Props extends NavigationNavigatorProps<{ title: string; href: string; }> {
    status: string;
    data: List<Map<string, string>>;
    dispatch: Dispatch<any>;
    totalLength: number;
}

interface State {
    refreshing: boolean;
}

class Feed extends PureComponent<Props, State> {
    public state = {
        refreshing: true,
    };
    public componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    public render() {
        return (
            <FlatList
                data={this.props.data.toJS()}
                renderItem={this.renderItem}
                getItemLayout={this.getItemLayout}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item) => item.title}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.9}
            />
        );
    }
    private getItemLayout = (_, index) => ({
        length: CELL_HEIGHT,
        offset: CELL_HEIGHT * index,
        index,
    })
    private renderItem = (info: { item: { title: string; src: string[]; } }) => {
        return (<FeedCell {...info.item} />);
    }
    private onEndReached = () => {
        if (this.props.data.size < this.props.totalLength) {
            this.props.dispatch(requestFeedNextPage());
        }
    }
    private onViewableItemsChanged = (info: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
        console.log('info: ', info);
    }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});

export default connect(mapPropsToState)(Feed);
