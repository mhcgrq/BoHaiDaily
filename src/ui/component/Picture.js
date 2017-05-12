import React, { PureComponent } from 'react';
import { Image, View, } from 'react-native';
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
        };
        this.onProgress = (event) => {
            const { loaded, total } = event.nativeEvent;
            this.setState({
                progress: +(loaded / total).toFixed(2),
            });
        };
        this.onError = () => {
            this.setState({ status: LoadStatus.FAILED });
        };
        this.onLoad = () => {
            this.setState({ status: LoadStatus.LOADED });
        };
    }
    render() {
        return (<View style={{ flex: 1, alignItems: 'center' }}>
                <Image source={{ uri: this.props.src }} defaultSource={Picture.placeholder} style={this.props.imgStyle} resizeMode="contain" onProgress={this.onProgress} onError={this.onError} onLoad={this.onLoad}/>
            </View>);
    }
}
Picture.defaultProps = {
    src: '',
    title: '',
};
Picture.placeholder = require('../../../assets/placeholder.png');
//# sourceMappingURL=Picture.js.map