import React, { PureComponent } from 'react';
import {
    ScrollView,
    ViewStyle,
    View,
    Modal,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    GestureResponderEvent,
} from 'react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

interface Props {
    contentContainerStyle?: ViewStyle;
    style?: ViewStyle;
    isPreview?: boolean;
    minimumZoomScale?: number;
    maximumZoomScale?: number;
    scrollOffset?: { x: number; y: number; };
}

interface State {
    scrollOffset: { x: number; y: number; };
    modalVisible: boolean;
}

interface TouchMeta {
    identifier: string;
    locationX: number;
    locationY: number;
    timestamp: number;
}

export default class ImageView extends PureComponent<Props, State> {
    public static defaultProps = {
        contentContainerStyle: {},
        style: {},
        isPreview: true,
        minimumZoomScale: 1,
        maximumZoomScale: 5,
        scrollOffset: { x: 0, y: 0 },
    };
    public state = {
        scrollOffset: { x: 0, y: 0 },
        modalVisible: false,
    };
    private startTouchEvent: TouchMeta;
    private endTouchEvent: TouchMeta;
    public render(): JSX.Element {
        const {
            contentContainerStyle,
            style,
            maximumZoomScale,
            minimumZoomScale,
            scrollOffset,
            children,
        } = this.props;
        const childrenCount = React.Children.count(children);
        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={contentContainerStyle}
                    style={style}
                    horizontal
                    pagingEnabled
                    contentOffset={scrollOffset}
                    scrollEnabled={childrenCount > 1}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.updateCurrentIndex}
                    scrollEventThrottle={16}
                    onTouchStart={this.handleStartTouch}
                    onTouchEnd={this.handleEndTouch}
                >
                    <View style={{ flex: 1 }}>
                        {React.Children.map(children, this.mapChildren)}
                    </View>
                </ScrollView>
                {
                    this.props.isPreview &&
                    <Modal
                        visible={this.state.modalVisible}
                        animationType="fade"
                        supportedOrientations={['portrait']}
                    >
                        <View
                            style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
                            onTouchStart={this.handleStartTouch}
                            onTouchEnd={this.handleEndTouch}
                        >
                            <ImageView
                                isPreview={false}
                                maximumZoomScale={maximumZoomScale}
                                minimumZoomScale={minimumZoomScale}
                                scrollOffset={this.state.scrollOffset}
                            >
                                {this.props.children}
                            </ImageView>
                        </View>
                    </Modal>
                }
            </View>
        );
    }

    private mapChildren = (child: React.ReactChild, index: number) => {
        if (this.props.isPreview) {
            return child;
        }
        return (
            <ScrollView
                key={index}
                scrollEnabled={false}
            >
                {child}
            </ScrollView>
        );
    }

    private toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    }

    private updateCurrentIndex = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (this.props.isPreview && e && e.nativeEvent) {
            const contentOffset = e.nativeEvent.contentOffset.x;
            this.setState({ scrollOffset: { x: contentOffset, y: 0 } });
        }
    }

    private handleStartTouch = (event: GestureResponderEvent) => {
        const nativeEvent = event.nativeEvent;
        this.startTouchEvent = {
            identifier: nativeEvent.identifier,
            locationX: nativeEvent.locationX,
            locationY: nativeEvent.locationY,
            timestamp: nativeEvent.timestamp,
        };
    }

    private handleEndTouch = (event: GestureResponderEvent) => {
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
            } else {
                console.log('on');
            }
            this.toggleModal();
        }
    }

    private isPress = (start: TouchMeta, end: TouchMeta) => {
        const {
            identifier: startI,
            locationX: startX,
            locationY: startY,
            timestamp: startT,
        } = start;
        const {
            identifier: endI,
            locationX: endX,
            locationY: endY,
            timestamp: endT,
        } = end;
        return startI === endI
            && Math.abs(startX - endX) < 10
            && Math.abs(startY - endY) < 10
            && Math.abs(startT - endT) < 150;
    }
}
