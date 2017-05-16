import React, { PureComponent } from 'react';
import { ScrollView, View, Modal, TouchableWithoutFeedback, } from 'react-native';
export default class ImageView extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            scrollIndex: 0,
            modalVisible: false,
            scrolling: false,
        };
        this.mapChildren = (child, index) => {
            if (this.props.isPreview) {
                return (<TouchableWithoutFeedback onPress={this.openModal}>
                    {child}
                </TouchableWithoutFeedback>);
            }
            return (<ScrollView key={index} scrollEnabled={false}>
                {child}
            </ScrollView>);
        };
        this.openModal = () => {
            console.log(111);
            if (!this.state.scrolling) {
                this.setState({ modalVisible: true });
            }
        };
        this.closeModal = () => {
            console.log(222);
            if (!this.state.scrolling) {
                this.setState({ modalVisible: false });
            }
        };
        this.updateCurrentIndex = (e) => {
            this.toggleScrolling();
            if (this.props.isPreview && e && e.nativeEvent) {
                const totalWidth = e.nativeEvent.contentSize.width;
                const contentOffset = e.nativeEvent.contentOffset.x;
                this.setState({ scrollIndex: Math.round(totalWidth / contentOffset - 1) });
            }
        };
        this.toggleScrolling = () => {
            this.setState({ scrolling: !this.state.scrolling });
        };
    }
    render() {
        const { contentContainerStyle, style, maximumZoomScale, minimumZoomScale, children, } = this.props;
        const childrenCount = React.Children.count(children);
        return (<View>
                <TouchableWithoutFeedback onPress={this.openModal}>
                    <ScrollView contentContainerStyle={contentContainerStyle} style={style} horizontal pagingEnabled scrollEnabled={childrenCount > 1} showsHorizontalScrollIndicator={false} onMomentumScrollEnd={this.updateCurrentIndex} onScrollBeginDrag={this.toggleScrolling} maximumZoomScale={maximumZoomScale} minimumZoomScale={minimumZoomScale} scrollEventThrottle={16}>
                        {React.Children.map(children, this.mapChildren)}
                    </ScrollView>
                </TouchableWithoutFeedback>
                <Modal visible={this.state.modalVisible} animationType="fade" supportedOrientations={['portrait']}>
                    <TouchableWithoutFeedback onPress={this.closeModal}>
                        <ImageView isPreview={false}>
                            {this.props.children}
                        </ImageView>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>);
    }
}
ImageView.defaultProps = {
    contentContainerStyle: {},
    style: {},
    isPreview: true,
    minimumZoomScale: 1,
    maximumZoomScale: 5,
};
//# sourceMappingURL=ImageView.js.map