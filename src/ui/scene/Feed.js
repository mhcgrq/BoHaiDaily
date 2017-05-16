import React, { PureComponent } from 'react';
import { FlatList, } from 'react-native';
import { connect } from 'react-redux';
import FeedCell from '../component/FeedCell';
import { getFeed, requestFeedNextPage, swtichImageStatus } from '../../redux/action';
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
                this.props.dispatch(requestFeedNextPage());
            }
        };
        this.swtichImageStatus = (cellIndex, imageIndex, status) => {
            this.props.dispatch(swtichImageStatus(cellIndex, imageIndex, status));
        };
        // private onViewableItemsChanged = (info: {viewableItems: ViewToken[], changed: ViewToken[]}) => {
        //     console.log('info: ', info);
        // }
    }
    componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    render() {
        return (<FlatList data={this.props.data.toJS().filter((item, index) => {
            if (index === 0) {
                return true;
            }
            if (index !== 0 && item.src.length === 1) {
                return false;
            }
            return true;
        })} renderItem={this.renderItem} 
        // onViewableItemsChanged={this.onViewableItemsChanged}
        keyExtractor={(item) => item.title} onEndReached={this.onEndReached} onEndReachedThreshold={0}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});
export default connect(mapPropsToState)(Feed);
//# sourceMappingURL=Feed.js.map