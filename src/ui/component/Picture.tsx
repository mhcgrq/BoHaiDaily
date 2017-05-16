import React, { PureComponent } from 'react';
import {
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
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
    status: LoadStatus;
    style: {
        width: string | number;
        height: number;
        // aspectRatio: number;
        // maxHeight: number;
    };
}

const initState: State = {
    randomKey: Math.random(),
    progress: 0,
    status: LoadStatus.LOADING,
    style: {
        width: WINDOW_WIDTH,
        height: WINDOW_WIDTH,
        // aspectRatio: 1,
        // maxHeight: WINDOW_HEIGHT - 90,
    },
};

export default class Picture extends PureComponent<Props, State> {
    public static defaultProps = {
        src: '',
        title: '',
    };
    // private static placeholder = require('../../../assets/placeholder.png');
    public state = initState;
    public componentDidMount() {
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
    public render() {
        return (
            <View style={style.view} key={this.state.randomKey}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <Image
                        source={{ uri: this.props.src }}
                        style={this.state.style}
                        resizeMode="contain"
                        onProgress={this.onProgress}
                        onError={this.onError}
                        onLoad={this.onLoad}
                    >
                        <Circle
                            progress={this.state.progress}
                            size={100}
                            style={[
                                style.progress,
                                { display: this.state.status === LoadStatus.LOADED ? 'none' : 'flex' },
                            ]}
                        />
                    </Image>
                </TouchableWithoutFeedback>
            </View>
        );
    }
    private onProgress = (event: { nativeEvent: { loaded: number, total: number }}) => {
        const { loaded, total } = event.nativeEvent;
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
