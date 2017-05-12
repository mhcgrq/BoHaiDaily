import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Picture from './Picture';

interface Props {
    title: string;
    src: string[];
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const TITLE_HEIGHT = 50;
const PADDING = 20;
const MARGIN = 20;
export const CELL_HEIGHT = TITLE_HEIGHT + WINDOW_WIDTH + MARGIN * 2 + PADDING * 2;

const style = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        width: WINDOW_WIDTH,
        marginBottom: MARGIN,
        padding: PADDING,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    title: {
        // justifyContent: 'center',
        height: 30,
        fontSize: 20,
        lineHeight: 30,
    },
    image: {
        // alignItems: 'center',
        // justifyContent: 'center',
        width: WINDOW_WIDTH - PADDING,
        height: WINDOW_WIDTH - PADDING,
    },
});

export default function FeedCell(props: Props) {
    return (
        <View key={props.title} style={style.view}>
            <Text style={style.title}>{props.title}</Text>
            {
                props.src.map((s) => (
                    <Picture
                        imgStyle={style.image}
                        key={s}
                        src={s}
                        title={props.title}
                    />
                ))
            }
        </View>
    );
}
