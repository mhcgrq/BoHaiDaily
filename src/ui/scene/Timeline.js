import React, { PureComponent } from 'react';
import { 
// View,
FlatList, Text, TouchableHighlight, } from 'react-native';
import { connect } from 'react-redux';
import { getTimeline, navOpenFeed } from '../../redux/action';
class TimeLine extends PureComponent {
    constructor() {
        super(...arguments);
        this.renderItem = (info) => {
            const { title, href } = info.item;
            return (<TouchableHighlight key={title} onPress={this.openFeed(title, href)}>
                <Text>{title}</Text>
            </TouchableHighlight>);
        };
        this.openFeed = (title, href) => () => {
            console.log(title, href);
            this.props.dispatch(navOpenFeed(title, href));
        };
    }
    componentDidMount() {
        this.props.dispatch(getTimeline(1));
    }
    render() {
        return (<FlatList data={this.props.data.toJS()} renderItem={this.renderItem} keyExtractor={(item) => item.title}/>);
    }
}
const mapPropsToState = (state) => ({
    status: state.getIn(['root', 'timeline', 'status']),
    data: state.getIn(['root', 'timeline', 'data']),
});
export default connect(mapPropsToState)(TimeLine);
//# sourceMappingURL=Timeline.js.map