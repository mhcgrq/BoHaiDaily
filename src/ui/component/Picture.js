import React, { PureComponent } from 'react';
import { View, Dimensions, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
import { CustomCachedImage, ImageCache } from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import { Circle } from 'react-native-progress';
const { width: WINDOW_WIDTH } = Dimensions.get('window');
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus[LoadStatus["LOADING"] = 0] = "LOADING";
    LoadStatus[LoadStatus["LOADED"] = 1] = "LOADED";
    LoadStatus[LoadStatus["FAILED"] = 2] = "FAILED";
})(LoadStatus || (LoadStatus = {}));
const initState = {
    randomKey: Math.random(),
    progress: 0,
    status: LoadStatus.LOADING,
    style: {
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
    },
};
export default class Picture extends PureComponent {
    constructor() {
        super(...arguments);
        // private static placeholder = require('../../../assets/placeholder.png');
        this.state = initState;
        // private onProgress = (event: { nativeEvent: { loaded: number, total: number }}) => {
        //     const { loaded, total } = event.nativeEvent;
        //     this.setState({
        //         progress: loaded / total,
        //     });
        // }
        // private onError = () => {
        //     this.props.swtichImageStatus(
        //         this.props.cellIndex,
        //         this.props.imageIndex,
        //         'REJECT',
        //     );
        //     this.setState({ status: LoadStatus.FAILED });
        // }
        // private onLoad = () => {
        //     this.props.swtichImageStatus(
        //         this.props.cellIndex,
        //         this.props.imageIndex,
        //         'RESOLVE',
        //     );
        //     this.setState({ status: LoadStatus.LOADED });
        // }
        this.handlePress = () => {
            const status = this.state.status;
            if (status !== LoadStatus.LOADED) {
                this.setState(Object.assign({}, initState, { randomKey: Math.random() }));
            }
        };
    }
    componentDidMount() {
        setTimeout(() => {
            console.log(ImageCache.get());
        }, 10000);
        // Image.prefetch(this.props.src);
        // Image.getSize(
        //     this.props.src,
        //     (width: number, height: number) => {
        //         this.setState({
        //             style: {
        //                 width: '100%',
        //                 aspectRatio: width / height,
        //                 maxHeight: WINDOW_HEIGHT - 90,
        //             },
        //         });
        //     },
        //     () => {},
        // );
    }
    render() {
        return (<View style={style.view} key={this.state.randomKey}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <CustomCachedImage component={Image} source={{ uri: this.props.src }} indicator={Circle} style={this.state.style}/>
                    
                </TouchableWithoutFeedback>
            </View>);
    }
}
Picture.defaultProps = {
    src: '',
    title: '',
};
const style = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
    },
    progress: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//# sourceMappingURL=Picture.js.map