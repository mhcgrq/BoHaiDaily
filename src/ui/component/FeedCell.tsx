import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Picture from './Picture';
import ImageView from './ImageView';
import { FeedItem } from '../../redux/reducer';

interface Props extends FeedItem {
    cellIndex: number;
    swtichImageStatus: (cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') => void;
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
    },
});

export default function FeedCell(props: Props) {
    return (
        <View style={style.view}>
            <Text style={style.title}>{props.title}</Text>
            <ImageView
                style={{ height: WINDOW_WIDTH }}
            >
                {
                    props.src.map((s, index) => (
                        <Picture
                            cellIndex={props.cellIndex}
                            swtichImageStatus={props.swtichImageStatus}
                            imageIndex={index}
                            key={s.src}
                            src={s.src}
                            title={props.title}
                        />
                    ))
                }
            </ImageView>
        </View>
    );
}
