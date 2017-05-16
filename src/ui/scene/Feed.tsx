import React, { PureComponent } from 'react';
import {
    FlatList,
    // ViewToken,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import FeedCell from '../component/FeedCell';
import { getFeed, requestFeedNextPage, swtichImageStatus } from '../../redux/action';
import { FeedItem } from '../../redux/reducer';

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
                data={this.props.data.toJS().filter((item: any, index: number) => {
                    if (index === 0) {
                        return true;
                    }
                    if (index !== 0 && item.src.length === 1) {
                        return false;
                    }
                    return true;
                })}
                renderItem={this.renderItem}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item) => item.title}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0}
            />
        );
    }
    private renderItem = (info: { item: FeedItem, index: number }) => {
        return (
            <FeedCell
                {...info.item}
                swtichImageStatus={this.swtichImageStatus}
                cellIndex={info.index}
            />
        );
    }
    private onEndReached = () => {
        if (this.props.data.size < this.props.totalLength) {
            this.props.dispatch(requestFeedNextPage());
        }
    }
    private swtichImageStatus = (cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') => {
        this.props.dispatch(swtichImageStatus(cellIndex, imageIndex, status));
    }
    // private onViewableItemsChanged = (info: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
    //     console.log('info: ', info);
    // }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});

export default connect(mapPropsToState)(Feed);
