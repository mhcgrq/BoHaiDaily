import React, { PureComponent } from 'react';
import {
    Animated,
    FlatList,
    ActivityIndicator,
    ViewToken,
    InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import { ImageCache } from 'react-native-img-cache';
import FeedCell from '../component/FeedCell';
import { getFeed, requestFeedNextPage, swtichImageStatus, hasUpdatedFeed } from '../../redux/action';
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Feed extends PureComponent<Props, State> {
    public state = {
        refreshing: true,
    };
    public componentDidMount() {
        this.runAfterInteractions(
            () => this.props.dispatch(
                getFeed(this.props.navigation.state.params.href)
            )
        );
    }
    public componentWillReceiveProps(nextProps: Props) {
        if (this.props.data.size !== nextProps.data.size) {
            this.setState({ refreshing: false });
        }
    }
    public componentDidUpdate(prevProps: Props) {
        this.runAfterInteractions(() => {
            if (this.props.data.size !== prevProps.data.size) {
                this.props.dispatch(hasUpdatedFeed());
            }
        });
    }
    
    public render() {
        return (
            <AnimatedFlatList
                data={this.props.data.toJS()}
                renderItem={this.renderItem}
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item: FeedItem) => item.title}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0}
                ListFooterComponent={this.ListFooterComponent as any}
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
            this.setState({ refreshing: true });
            this.runAfterInteractions(() => {
                this.props.dispatch(requestFeedNextPage());
            });
        }
    }
    private swtichImageStatus = (cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') => {
        this.runAfterInteractions(() => {
            this.props.dispatch(swtichImageStatus(cellIndex, imageIndex, status));
        });
    }
    private onViewableItemsChanged = (info: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
        this.runAfterInteractions(() => {
            console.log('info: ', info);
            const cache = ImageCache.get();
            console.log('cache: ', cache);
            info.changed.forEach((item) => {
                if (!item.isViewable) {
                    item.item.src.forEach((s: string) => {
                        cache.cancel(s);
                    });
                }
            });
        })
    }
    private runAfterInteractions = (task: () => void) => {
        InteractionManager.runAfterInteractions(task);
    }
    private ListFooterComponent = () => (
        <ActivityIndicator animating={this.state.refreshing} />
    )
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});

export default connect(mapPropsToState)(Feed);
