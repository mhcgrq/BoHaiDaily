import React, { PureComponent } from 'react';
import { Image, View, Dimensions, TouchableWithoutFeedback, StyleSheet, } from 'react-native';
import { Circle } from 'react-native-progress';
const { height: WINDOW_HEIGHT } = Dimensions.get('window');
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
        width: '100%',
        aspectRatio: 1,
        maxHeight: WINDOW_HEIGHT - 90,
    },
};
export default class Picture extends PureComponent {
    constructor() {
        super(...arguments);
        // private static placeholder = require('../../../assets/placeholder.png');
        this.state = initState;
        this.onProgress = (event) => {
            const { loaded, total } = event.nativeEvent;
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
        Image.getSize(this.props.src, (width, height) => {
            this.setState({
                style: {
                    width: '100%',
                    aspectRatio: width / height,
                    maxHeight: WINDOW_HEIGHT - 90,
                },
            });
        }, () => { });
    }
    render() {
        return (<View style={style.view} key={this.state.randomKey}>
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <Image source={{ uri: this.props.src }} style={this.state.style} resizeMode="contain" onProgress={this.onProgress} onError={this.onError} onLoad={this.onLoad}>
                        <Circle progress={this.state.progress} size={100} style={[
            style.progress,
            { display: this.state.status === LoadStatus.LOADED ? 'none' : 'flex' },
        ]}/>
                    </Image>
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