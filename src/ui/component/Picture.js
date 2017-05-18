import React, { PureComponent } from 'react';
import { Animated, Dimensions, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
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
    fadeAnim: new Animated.Value(0),
    status: LoadStatus.LOADING,
    style: {
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
    },
};
export default class Picture extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = initState;
        this.onProgress = (loaded, total) => {
            this.setState({
                progress: loaded / total,
            });
        };
        this.onError = () => {
            this.props.swtichImageStatus(this.props.cellIndex, this.props.imageIndex, 'REJECT');
            this.setState({ status: LoadStatus.FAILED });
        };
        this.onLoad = () => {
            this.props.swtichImageStatus(this.props.cellIndex, this.props.imageIndex, 'RESOLVE');
            this.setState({ status: LoadStatus.LOADED });
        };
        this.handlePress = () => {
            const status = this.state.status;
            if (status !== LoadStatus.LOADED) {
                this.setState(Object.assign({}, initState, { randomKey: Math.random() }));
            }
        };
    }
    componentDidMount() {
        Animated.timing(this.state.fadeAnim, { toValue: 1, useNativeDriver: true, }).start();
    }
    componentWillUnmount() {
        ImageCache.get().cancel(this.props.src);
    }
    render() {
        return (<Animated.View style={[style.view, { opacity: this.state.fadeAnim, }]} key={this.state.randomKey}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <CustomCachedImage component={Image} source={{ uri: this.props.src, onProgress: this.onProgress }} indicator={Circle} indicatorProps={{ progress: this.state.progress }} style={this.state.style} 
        //onProgress={this.onProgress}
        onError={this.onError} onLoad={this.onLoad}/>
                    
                </TouchableWithoutFeedback>
            </Animated.View>);
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