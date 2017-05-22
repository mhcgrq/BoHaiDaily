import React from 'react';
import { View, StyleSheet, Dimensions, } from 'react-native';
import Picture from './Picture';
import ImageView from './ImageView';
import FeedTitle from './FeedTitle';
import { PADDING } from '../../constants/constants';
const WINDOW_WIDTH = Dimensions.get('window').width;
const style = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        width: WINDOW_WIDTH - PADDING * 2,
        backgroundColor: '#fff',
    },
    imageView: {
        flex: 1,
        width: WINDOW_WIDTH - PADDING * 2,
    },
});
export default function FeedCell(props) {
    return (<View style={style.view}>
            <FeedTitle title={props.title} index={props.cellIndex}/>
            <ImageView style={style.imageView}>
                {props.src.map((s, index) => (<Picture cellIndex={props.cellIndex} swtichImageStatus={props.swtichImageStatus} imageIndex={index} key={s.src} src={s.src} title={props.title}/>))}
            </ImageView>
        </View>);
}
//# sourceMappingURL=FeedCell.js.map