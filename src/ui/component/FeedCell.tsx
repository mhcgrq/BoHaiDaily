import React from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Picture from './Picture';
import ImageView from './ImageView';
import FeedTitle from './FeedTitle';
import { FeedItem } from '../../redux/reducer';

interface Props extends FeedItem {
    cellIndex: number;
    swtichImageStatus: (cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') => void;
}

const WINDOW_WIDTH = Dimensions.get('window').width;

const style = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        width: WINDOW_WIDTH - 40,
        backgroundColor: '#fff',
    },
    imageView: {
        width: WINDOW_WIDTH - 40,
        height: WINDOW_WIDTH * 9 / 16,
    },
});

export default function FeedCell(props: Props) {
    return (
        <View style={style.view}>
            <FeedTitle title={props.title} index={props.cellIndex} />
            <ImageView style={style.imageView}>
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
