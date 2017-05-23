import React, { PureComponent } from 'react';
import {
    Animated,
    Dimensions,
    View,
    StyleSheet,
    Image as OriImage,
    GestureResponderEvent,
} from 'react-native';
import Image from 'react-native-image-progress';
import { Circle } from 'react-native-progress';
import ImageCache from '../../utils/img-cache';
import { PADDING, HEADER_HEIGHT } from '../../constants/constants';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

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
    progress: number;
    fadeAnim: Animated.Value;
    status: LoadStatus;
    aspectRatio: number;
    cachedSrc: string;
}

const initState: State = {
    progress: 0,
    fadeAnim: new Animated.Value(0),
    status: LoadStatus.LOADING,
    aspectRatio: 1,
    cachedSrc: '',
};

export default class Picture extends PureComponent<Props, State> {
    public static defaultProps = {
        src: '',
        title: '',
    };
    private static placeholder = require('../../../assets/placeholder.jpg');
    public state = initState;
    private mounted = false;
    public componentDidMount() {
        Animated.timing(
            this.state.fadeAnim,
            { toValue: 1, useNativeDriver: true },
        ).start();
        this.mounted = true;
        const cache = ImageCache.get();
        const source = { uri: this.props.src };
        cache.on(
            source,
            (uri) => { this.setState({ cachedSrc: uri, progress: 1 }); },
            'done',
        );
        cache.on(
            source,
            (_, args: { received: number, total: number }) => {
                const progress = args.received / args.total;
                if (progress >= 0 && progress <= 1) {
                    this.setState({ progress });
                }
            },
            'progress',
        );
        cache.on(
            source,
            this.onError,
            'failed',
        );
    }
    public componentWillUnmount() {
        ImageCache.get().cancel(this.props.src);
        ImageCache.get().disposeAll(this.props.src);
        this.mounted = false;
    }

    public render() {
        return (
            <Animated.View style={[style.view, { opacity: this.state.fadeAnim }]}>
                <Image
                    source={
                        this.state.cachedSrc
                        ? { uri: this.state.cachedSrc }
                        : Picture.placeholder
                    }
                    style={[style.image, { height: (WINDOW_WIDTH - PADDING * 2) / this.state.aspectRatio }]}
                    resizeMode="contain"
                    onError={this.onError}
                    onLoad={this.onLoad}
                >
                    <View
                        onResponderRelease={this.reloadImage}
                        onResponderStart={this.onResponderStart}
                        style={[
                            style.progress,
                            { display: this.state.status === LoadStatus.LOADED ? 'none' : 'flex' },
                        ]}
                    >
                        <Circle
                            progress={this.state.progress}
                            size={100}
                        />
                    </View>
                </Image>
            </Animated.View>
        );
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
        if (this.state.cachedSrc) {
            this.props.swtichImageStatus(
                this.props.cellIndex,
                this.props.imageIndex,
                'RESOLVE',
            );
            OriImage.getSize(
                this.state.cachedSrc,
                (width: number, height: number) => {
                    this.setState({
                        aspectRatio: width / height,
                    });
                },
                () => { },
            );
            this.setState({ status: LoadStatus.LOADED });
        }
    }
    private reloadImage = (e: GestureResponderEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const status = this.state.status;
        if (status !== LoadStatus.LOADED) {
            const cache = ImageCache.get();
            const source = { uri: this.props.src };
            cache.retry(source);
            this.setState({ ...initState });
        }
    }
    private onResponderStart = (e: GestureResponderEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }
}

const style = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: WINDOW_WIDTH - PADDING * 2,
        maxHeight: WINDOW_HEIGHT - HEADER_HEIGHT,
    },
    progress: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
});
