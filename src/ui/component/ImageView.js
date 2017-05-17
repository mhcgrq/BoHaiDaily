import React, { PureComponent } from 'react';
import { ScrollView, View, Modal, Dimensions, } from 'react-native';
const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
export default class ImageView extends PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            scrollOffset: { x: 0, y: 0 },
            modalVisible: false,
        };
        this.mapChildren = (child, index) => {
            if (this.props.isPreview) {
                return child;
            }
            return (<ScrollView key={index} scrollEnabled={false}>
                {child}
            </ScrollView>);
        };
        this.toggleModal = () => {
            this.setState({ modalVisible: !this.state.modalVisible });
        };
        this.updateCurrentIndex = (e) => {
            if (this.props.isPreview && e && e.nativeEvent) {
                const contentOffset = e.nativeEvent.contentOffset.x;
                this.setState({ scrollOffset: { x: contentOffset, y: 0 } });
            }
        };
        this.handleStartTouch = (event) => {
            const nativeEvent = event.nativeEvent;
            this.startTouchEvent = {
                identifier: nativeEvent.identifier,
                locationX: nativeEvent.locationX,
                locationY: nativeEvent.locationY,
                timestamp: nativeEvent.timestamp,
            };
        };
        this.handleEndTouch = (event) => {
            const nativeEvent = event.nativeEvent;
            this.endTouchEvent = {
                identifier: nativeEvent.identifier,
                locationX: nativeEvent.locationX,
                locationY: nativeEvent.locationY,
                timestamp: nativeEvent.timestamp,
            };
            if (this.isPress(this.startTouchEvent, this.endTouchEvent)) {
                if (this.state.modalVisible) {
                    console.log('off');
                }
                else {
                    console.log('on');
                }
                this.toggleModal();
            }
        };
        this.isPress = (start, end) => {
            const { identifier: startI, locationX: startX, locationY: startY, timestamp: startT, } = start;
            const { identifier: endI, locationX: endX, locationY: endY, timestamp: endT, } = end;
            return startI === endI
                && Math.abs(startX - endX) < 10
                && Math.abs(startY - endY) < 10
                && Math.abs(startT - endT) < 150;
        };
    }
    render() {
        const { contentContainerStyle, style, maximumZoomScale, minimumZoomScale, scrollOffset, children, } = this.props;
        const childrenCount = React.Children.count(children);
        return (<View>
                <ScrollView contentContainerStyle={contentContainerStyle} style={style} horizontal pagingEnabled contentOffset={scrollOffset} scrollEnabled={childrenCount > 1} showsHorizontalScrollIndicator={false} onMomentumScrollEnd={this.updateCurrentIndex} scrollEventThrottle={16} onTouchStart={this.handleStartTouch} onTouchEnd={this.handleEndTouch}>
                    {React.Children.map(children, this.mapChildren)}
                </ScrollView>
                {this.props.isPreview &&
            <Modal visible={this.state.modalVisible} animationType="fade" supportedOrientations={['portrait']}>
                        <View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }} onTouchStart={this.handleStartTouch} onTouchEnd={this.handleEndTouch}>
                            <ImageView isPreview={false} maximumZoomScale={maximumZoomScale} minimumZoomScale={minimumZoomScale} scrollOffset={this.state.scrollOffset}>
                                {this.props.children}
                            </ImageView>
                        </View>
                    </Modal>}
            </View>);
    }
}
ImageView.defaultProps = {
    contentContainerStyle: {},
    style: {},
    isPreview: true,
    minimumZoomScale: 1,
    maximumZoomScale: 5,
    scrollOffset: { x: 0, y: 0 },
};
//# sourceMappingURL=ImageView.js.map