import React, { PureComponent } from 'react';
import { View, FlatList, Text, } from 'react-native';
import { connect } from 'react-redux';
import Picture from '../component//Picture';
import { getFeed, requestFeedNextPage } from '../../redux/action';
class Feed extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            refreshing: true,
        };
        this.renderItem = (info) => {
            const { title, src } = info.item;
            return (<View key={title} style={{ flex: 1 }}>
                <Text>{title}</Text>
                {src.map((s) => (<Picture key={s} src={s} title={title}/>))}
            </View>);
        };
        this.onEndReached = () => {
            if (this.props.data.size < this.props.totalLength) {
                this.props.dispatch(requestFeedNextPage());
            }
        };
        this.onViewableItemsChanged = (info) => {
            console.log('info: ', info);
        };
    }
    componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    render() {
        return (<FlatList data={this.props.data.toJS()} renderItem={this.renderItem} onViewableItemsChanged={this.onViewableItemsChanged} keyExtractor={(item) => item.title} onEndReached={this.onEndReached} onEndReachedThreshold={0.9}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'visibleData']),
    totalLength: state.getIn(['root', 'feed', 'data']).size,
});
export default connect(mapPropsToState)(Feed);
//# sourceMappingURL=Feed.js.map