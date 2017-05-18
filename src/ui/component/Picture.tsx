import React, { PureComponent } from 'react';
import {
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import { CustomCachedImage, ImageCache } from 'react-native-img-cache';
import Image from 'react-native-image-progress';
import { Circle } from 'react-native-progress';

const { width: WINDOW_WIDTH } = Dimensions.get('window');

interface Props {
    src: string;
    title: string;
    cellIndex: number;
    imageIndex: number;
    swtichImageStatus: (cellIndex: number, imageIndex: number, status: 'REQUEST' | 'RESOLVE' | 'REJECT') => void;
}

export enum LoadStatus {
    LOADING, LOADED, FAILED,
}

interface State {
    randomKey: number;
    progress: number;
    fadeAnim: Animated.Value,
    status: LoadStatus;
    style: {
        width: string | number;
        height: number;
    };
}

const initState: State = {
    randomKey: Math.random(),
    progress: 0,
    fadeAnim: new Animated.Value(0),
    status: LoadStatus.LOADING,
    style: {
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
    },
};

export default class Picture extends PureComponent<Props, State> {
    public static defaultProps = {
        src: '',
        title: '',
    };
    public state = initState;
    public componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            { toValue: 1, useNativeDriver: true, }
        ).start();  
    }
    public componentWillUnmount() {
        ImageCache.get().cancel(this.props.src);
    }
    
    public render() {
        return (
            <Animated.View style={[style.view, { opacity: this.state.fadeAnim, }]} key={this.state.randomKey}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <CustomCachedImage
                        component={Image}
                        source={{ uri: this.props.src, onProgress: this.onProgress }}
                        indicator={Circle}
                        indicatorProps={{ progress: this.state.progress }}
                        style={this.state.style}
                        //onProgress={this.onProgress}
                        onError={this.onError}
                        onLoad={this.onLoad}
                    />
                    {
                        // <Image
                        //    source={{ uri: this.props.src, cache: 'force-cache' }}
                        //    style={this.state.style}
                        //    resizeMode="contain"
                        //    onProgress={this.onProgress}
                        //    onError={this.onError}
                        //    onLoad={this.onLoad}
                        // >
                        //    <Circle
                        //        progress={this.state.progress}
                        //        size={100}
                        //        style={[
                        //            style.progress,
                        //            { display: this.state.status === LoadStatus.LOADED ? 'none' : 'flex' },
                        //        ]}
                        //    />
                        // </Image>
                    }
                </TouchableWithoutFeedback>
            </Animated.View>
        );
    }
    private onProgress = (loaded: number, total: number) => {
        this.setState({
            progress: loaded / total,
        });
    }
    private onError = () => {
        this.props.swtichImageStatus(
            this.props.cellIndex,
            this.props.imageIndex,
            'REJECT',
        );
        this.setState({ status: LoadStatus.FAILED });
    }
    private onLoad = () => {
        this.props.swtichImageStatus(
            this.props.cellIndex,
            this.props.imageIndex,
            'RESOLVE',
        );
        this.setState({ status: LoadStatus.LOADED });
    }
    private handlePress = () => {
        const status = this.state.status;
        if (status !== LoadStatus.LOADED) {
            this.setState({ ...initState, randomKey: Math.random() });
        }
    }
}

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
