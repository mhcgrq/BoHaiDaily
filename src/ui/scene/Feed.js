import React, { PureComponent } from 'react';
import { View, FlatList, Text, } from 'react-native';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Picture from '../component//Picture';
import { getFeed } from '../../redux/action';
class Feed extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            cellVisibility: Map(),
        };
        this.renderItem = (info) => {
            const { title, src } = info.item;
            // console.log('src: ', src);
            return (<View key={title} style={{ flex: 1 }}>
                <Text>{title}</Text>
                <Picture src={src} title={title} isViewable={this.state.cellVisibility.get(title)}/>
            </View>);
        };
        this.onViewableItemsChanged = (info) => {
            let cellVisibility = this.state.cellVisibility;
            info.changed.forEach((item) => {
                cellVisibility = cellVisibility.set(item.key, item.isViewable);
            });
            this.setState({ cellVisibility });
        };
    }
    componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    componentWillReceiveProps(nextProps) {
        let cellVisibility = Map();
        nextProps.data
            .toJS()
            .forEach((item) => {
            cellVisibility = cellVisibility.set(item.title, false);
        }),
            this.setState({ cellVisibility });
    }
    render() {
        return (<FlatList data={this.props.data.toJS()} renderItem={this.renderItem} onViewableItemsChanged={this.onViewableItemsChanged} keyExtractor={(item) => item.title}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'data']),
});
export default connect(mapPropsToState)(Feed);
//# sourceMappingURL=Feed.js.map