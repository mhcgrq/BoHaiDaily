import React, { PureComponent } from 'react';
import { Animated, View, FlatList, StyleSheet, ActivityIndicator, InteractionManager, } from 'react-native';
import { connect } from 'react-redux';
import FeedCell from '../component/FeedCell';
import { getFeed, requestFeedNextPage, swtichImageStatus, hasUpdatedFeed } from '../../redux/action';
import ImageCache from '../../utils/img-cache';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class Feed extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            refreshing: true,
        };
        this.renderItem = (info) => {
            return (<FeedCell {...info.item} swtichImageStatus={this.swtichImageStatus} cellIndex={info.index}/>);
        };
        this.onEndReached = () => {
            if (this.props.data.size < this.props.totalLength) {
                this.setState({ refreshing: true });
                this.runAfterInteractions(() => {
                    this.props.dispatch(requestFeedNextPage());
                });
            }
        };
        this.swtichImageStatus = (cellIndex, imageIndex, status) => {
            this.runAfterInteractions(() => {
                this.props.dispatch(swtichImageStatus(cellIndex, imageIndex, status));
            });
        };
        this.onViewableItemsChanged = (info) => {
            this.runAfterInteractions(() => {
                console.log('info: ', info);
                info.changed.forEach((item) => {
                    if (!item.isViewable) {
                        item.item.src.forEach((s) => {
                            console.log(item.item.title);
                            ImageCache.get().cancel(s);
                        });
                    }
                });
            });
        };
        this.runAfterInteractions = (task) => {
            InteractionManager.runAfterInteractions(task);
        };
        this.ListFooterComponent = () => (<ActivityIndicator animating={this.state.refreshing}/>);
        this.ItemSeparatorComponent = () => (<View style={style.separator}/>);
    }
    componentDidMount() {
        this.runAfterInteractions(() => this.props.dispatch(getFeed(this.props.navigation.state.params.href)));
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.data.size !== nextProps.data.size) {
            this.setState({ refreshing: false });
        }
    }
    componentDidUpdate(prevProps) {
        this.runAfterInteractions(() => {
            if (this.props.data.size !== prevProps.data.size) {
                this.props.dispatch(hasUpdatedFeed());
            }
        });
    }
    render() {
        return (<AnimatedFlatList style={style.view} data={this.props.data.toJS()} renderItem={this.renderItem} onViewableItemsChanged={this.onViewableItemsChanged} keyExtractor={(item) => item.title} onEndReached={this.onEndReached} onEndReachedThreshold={0} ListFooterComponent={this.ListFooterComponent} ItemSeparatorComponent={this.ItemSeparatorComponent}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});
const style = StyleSheet.create({
    view: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    separator: {
        width: '100%',
        height: 1,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#ddd',
    },
});
export default connect(mapPropsToState)(Feed);
//# sourceMappingURL=Feed.js.map