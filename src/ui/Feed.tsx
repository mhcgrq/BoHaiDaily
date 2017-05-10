import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import { getFeed } from '../redux/action';

interface Props extends NavigationNavigatorProps<{ title: string; href: string; }> {
    status: string;
    data: List<Map<string, string>>;
    dispatch: Dispatch<any>;
}

class Feed extends PureComponent<Props, {}> {
    public componentDidMount() {
        this.props.dispatch(getFeed(this.props.navigation.state.params.href));
    }
    public render() {
        return (
            <FlatList
                data={this.props.data.toJS()}
                renderItem={this.renderItem}
            />
        );
    }
    private renderItem = (info: { item: { title: string; src: string; } }) => {
        const { title, src } = info.item;
        console.log('src: ', src);
        return (
            <View key={title} style={{ display: 'flex' }}>
                <Text>{title}</Text>
                <Image source={{ uri: src }} style={{width: 400, height: 400}}/>
            </View>
        );
    }
}

const mapPropsToState = (state: any) => ({
    status: state.getIn(['root', 'feed', 'status']),
    data: state.getIn(['root', 'feed', 'data']),
});

export default connect(mapPropsToState)(Feed);
