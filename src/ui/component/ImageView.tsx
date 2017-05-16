import React, { PureComponent } from 'react';
import {
    ScrollView,
    ViewStyle,
    View,
    Modal,
    TouchableWithoutFeedback,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

interface Props {
    contentContainerStyle?: ViewStyle;
    style?: ViewStyle;
    isPreview?: boolean;
    minimumZoomScale?: number;
    maximumZoomScale?: number;
}

interface State {
    scrollIndex: number;
    modalVisible: boolean;
    scrolling: boolean;
}

export default class ImageView extends PureComponent<Props, State> {
    public static defaultProps = {
        contentContainerStyle: {},
        style: {},
        isPreview: true,
        minimumZoomScale: 1,
        maximumZoomScale: 5,
    };
    public state = {
        scrollIndex: 0,
        modalVisible: false,
        scrolling: false,
    };
    public render(): JSX.Element {
        const {
            contentContainerStyle,
            style,
            maximumZoomScale,
            minimumZoomScale,
            children,
        } = this.props;
        const childrenCount = React.Children.count(children);
        return (
            <View>
                <TouchableWithoutFeedback onPress={this.openModal}>
                    <ScrollView
                        contentContainerStyle={contentContainerStyle}
                        style={style}
                        horizontal
                        pagingEnabled
                        scrollEnabled={childrenCount > 1}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={this.updateCurrentIndex}
                        onScrollBeginDrag={this.toggleScrolling}
                        maximumZoomScale={maximumZoomScale}
                        minimumZoomScale={minimumZoomScale}
                        scrollEventThrottle={16}
                    >
                        {React.Children.map(children, this.mapChildren)}
                    </ScrollView>
                </TouchableWithoutFeedback>
                <Modal
                    visible={this.state.modalVisible}
                    animationType="fade"
                    supportedOrientations={['portrait']}
                >
                    <TouchableWithoutFeedback onPress={this.closeModal}>
                        <ImageView isPreview={false}>
                            {this.props.children}
                        </ImageView>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }

    private mapChildren = (child: React.ReactChild, index: number) => {
        if (this.props.isPreview) {
            return (
                <TouchableWithoutFeedback onPress={this.openModal}>
                    {child}
                </TouchableWithoutFeedback>
            );
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

    private openModal = () => {
        console.log(111);
        if (!this.state.scrolling) {
            this.setState({ modalVisible: true });
        }
    }

    private closeModal = () => {
        console.log(222);
        if (!this.state.scrolling) {
            this.setState({ modalVisible: false });
        }
    }

    private updateCurrentIndex = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
        this.toggleScrolling();
        if (this.props.isPreview && e && e.nativeEvent) {
            const totalWidth = e.nativeEvent.contentSize.width;
            const contentOffset = e.nativeEvent.contentOffset.x;
            this.setState({ scrollIndex: Math.round(totalWidth / contentOffset - 1) });
        }
    }

    private toggleScrolling = () => {
        this.setState({ scrolling: !this.state.scrolling });
    }
}
