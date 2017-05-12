import React, { PureComponent } from 'react';
import {
    View,
    FlatList,
    Text,
    ViewToken,
} from 'react-native';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import { Dispatch } from 'redux';
import { NavigationNavigatorProps } from 'react-navigation';
import Picture from '../component//Picture';
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
                onViewableItemsChanged={this.onViewableItemsChanged}
                keyExtractor={(item) => item.title}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.9}
            />
        );
    }
    private renderItem = (info: { item: { title: string; src: string[]; } }) => {
        const { title, src } = info.item;
        return (
            <View key={title} style={{ flex: 1 }}>
                <Text>{title}</Text>
                {
                    src.map((s) => (
                        <Picture
                            key={s}
                            src={s}
                            title={title}
                        />
                    ))
                }
            </View>
        );
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
