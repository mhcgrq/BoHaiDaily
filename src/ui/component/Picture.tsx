import React, { PureComponent } from 'react';
import {
    Image,
    View,
    ImageStyle,
} from 'react-native';

interface Props {
    src: string;
    title: string;
    imgStyle: ImageStyle;
}

export enum LoadStatus {
    LOADING, LOADED, FAILED,
}

interface State {
    progress: number;
    status: LoadStatus;
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
    };
    public render() {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Image
                    source={{ uri: this.props.src }}
                    defaultSource={Picture.placeholder}
                    style={this.props.imgStyle}
                    resizeMode="contain"
                    onProgress={this.onProgress}
                    onError={this.onError}
                    onLoad={this.onLoad}
                />
            </View>
        );
    }
    private onProgress = (event: { nativeEvent: { loaded: number, total: number }}) => {
        const {loaded, total} = event.nativeEvent;
        this.setState({
            progress: + (loaded / total).toFixed(2),
        });
    }
    private onError = () => {
        this.setState({ status: LoadStatus.FAILED });
    }
    private onLoad = () => {
        this.setState({ status: LoadStatus.LOADED });
    }
}
