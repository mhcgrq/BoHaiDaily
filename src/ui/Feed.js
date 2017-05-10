import React, { PureComponent } from 'react';
import { View, FlatList, Text, Image, } from 'react-native';
import { connect } from 'react-redux';
import { getFeed } from '../redux/action';
class Feed extends PureComponent {
    constructor() {
        super(...arguments);
        this.renderItem = (info) => {
            const { title, src } = info.item;
            console.log('src: ', src);
            return (<View key={title} style={{ display: 'flex' }}>
                <Text>{title}</Text>
                <Image source={{ uri: src }} style={{ width: 400, height: 400 }}/>
            </View>);
        };
    }
    componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    render() {
        return (<FlatList data={this.props.data.toJS()} renderItem={this.renderItem}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'data']),
});
export default connect(mapPropsToState)(Feed);
//# sourceMappingURL=Feed.js.map