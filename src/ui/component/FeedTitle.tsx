import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

interface Props {
    title: string;
    index: number;
}

const FeedTitle = (props: Props) => {
    return (
        <View style={style.view}>
            <View style={style.index}><Text style={style.indexText}>{props.index + 1}</Text></View>
            <View style={style.title}><Text style={style.titleText}>{props.title}</Text></View>
        </View>
    );
};

const style = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minHeight: 80,
        paddingTop: 20,
        paddingBottom: 20,
    },
    titleText: {
        // lineHeight: 20,
    },
    indexText: {
        width: 30,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        color: '#fff',
        borderRadius: 15,
        backgroundColor: '#40D1E3',
        overflow: 'hidden',
    },
    index: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        marginRight: 20,
    },
    title: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
    },
})

export default FeedTitle;