import { useTheme } from '@/src/context/ThemeProvider';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface FullScreenViewProps {
  children: React.ReactNode;
  onClose: () => void;
  closeButton?: React.ReactNode;
}

export function FullScreenView({ children, onClose, closeButton }: FullScreenViewProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const savedOffsetX = useSharedValue(0);
  const savedOffsetY = useSharedValue(0);
  const [isGesturing, setIsGesturing] = useState(false);

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      runOnJS(setIsGesturing)(true);
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      }
      runOnJS(setIsGesturing)(false);
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setIsGesturing)(true);
    })
    .onUpdate((e) => {
      offsetX.value = savedOffsetX.value + e.translationX;
      offsetY.value = savedOffsetY.value + e.translationY;
    })
    .onEnd(() => {
      savedOffsetX.value = offsetX.value;
      savedOffsetY.value = offsetY.value;
      runOnJS(setIsGesturing)(false);
    });

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      if (!isGesturing) {
        runOnJS(onClose)();
      }
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.gestureContainer, animatedStyle]}>
            {children}
          </Animated.View>
        </GestureDetector>
        {closeButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
}); 