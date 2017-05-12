import React, { PureComponent } from 'react';
import {
    Image,
    View,
    Text,
} from 'react-native';

interface Props {
    src: string;
    title: string;
}

export enum LoadStatus {
    LOADING, LOADED, FAILED,
}

interface ImageSize {
    width?: string;
    height?: string;
    aspectRatio: number;
}

interface State {
    progress: number;
    status: LoadStatus;
    size: ImageSize;
}

export default class Picture extends PureComponent<Props, State> {
    public static defaultProps = {
        src: '',
        title: '',
    };
    private static placeholder = require('../../../assets/placeholder.png');
    public state = {
        progress: 0,
        status: LoadStatus.LOADING,
        size: { width: '100%', aspectRatio: 1 },
    };
    public componentDidMount() {
        console.log('mount', this.props.title, this.props.src);
        console.log('ss', Picture.placeholder);
    }
    public componentWillUpdate(_: Props, nextState: State) {
        console.log('progress', this.props.title, nextState.progress);
    }
    public componentWillUnmount() {
        console.log('unmout:', this.props.title);
    }
    public render() {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: this.props.src }}
                    defaultSource={Picture.placeholder}
                    style={this.state.size}
                    resizeMode="contain"
                    onProgress={this.onProgress}
                    onError={this.onError}
                    onLoad={this.onLoad}
                />
                <Text>{this.state.progress}</Text>
            </View>
        );
    }
    private onProgress = (event: { nativeEvent: { loaded: number, total: number }}) => {
        // if (this.props.isViewable) {
            const {loaded, total} = event.nativeEvent;
            this.setState({
                progress: + (loaded / total).toFixed(2),
            });
        // }
    }
    private onError = () => {
        console.log('fail', this.props.title);
        // if (this.props.isViewable) {
        this.setState({ status: LoadStatus.FAILED });
        // }
    }
    private onLoad = () => {
        // if (this.props.isViewable) {
            // Image.getSize(
            //     this.props.src,
            //     (width: number, height: number) => { this.calcSize(width, height); },
            //     () => {},
            // );
            // this.setState({ status: LoadStatus.LOADED });
        // }
    }
    // private calcSize = (width: number, height: number) => {
    //     let size: ImageSize;
    //     const aspectRatio = width / height;
    //     size = { width: '100%', aspectRatio };
    //     this.setState({ size });
    // }
}
