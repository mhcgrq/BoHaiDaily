import React, { PureComponent } from 'react';
import { Image, View, Text, } from 'react-native';
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus[LoadStatus["LOADING"] = 0] = "LOADING";
    LoadStatus[LoadStatus["LOADED"] = 1] = "LOADED";
    LoadStatus[LoadStatus["FAILED"] = 2] = "FAILED";
})(LoadStatus || (LoadStatus = {}));
export default class Picture extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            progress: 0,
            status: LoadStatus.LOADING,
            size: { width: '100%', aspectRatio: 1 },
        };
        this.onProgress = (event) => {
            // if (this.props.isViewable) {
            const { loaded, total } = event.nativeEvent;
            this.setState({
                progress: +(loaded / total).toFixed(2),
            });
            // }
        };
        this.onError = () => {
            console.log('fail', this.props.title);
            // if (this.props.isViewable) {
            this.setState({ status: LoadStatus.FAILED });
            // }
        };
        this.onLoad = () => {
            // if (this.props.isViewable) {
            // Image.getSize(
            //     this.props.src,
            //     (width: number, height: number) => { this.calcSize(width, height); },
            //     () => {},
            // );
            // this.setState({ status: LoadStatus.LOADED });
            // }
        };
        // private calcSize = (width: number, height: number) => {
        //     let size: ImageSize;
        //     const aspectRatio = width / height;
        //     size = { width: '100%', aspectRatio };
        //     this.setState({ size });
        // }
    }
    componentDidMount() {
        console.log('mount', this.props.title, this.props.src);
        console.log('ss', Picture.placeholder);
    }
    componentWillUpdate(_, nextState) {
        console.log('progress', this.props.title, nextState.progress);
    }
    componentWillUnmount() {
        console.log('unmout:', this.props.title);
    }
    render() {
        return (<View style={{ flex: 1 }}>
                <Image source={{ uri: this.props.src }} defaultSource={Picture.placeholder} style={this.state.size} resizeMode="contain" onProgress={this.onProgress} onError={this.onError} onLoad={this.onLoad}/>
                <Text>{this.state.progress}</Text>
            </View>);
    }
}
Picture.defaultProps = {
    src: '',
    title: '',
};
Picture.placeholder = require('../../../assets/placeholder.png');
//# sourceMappingURL=Picture.js.map