import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, G } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);

const Waveform = () => {
  const waveOffset1 = useSharedValue(0);
  const waveOffset2 = useSharedValue(0);
  const waveOffset3 = useSharedValue(0); // Opposite wave below

  useEffect(() => {
    waveOffset1.value = withRepeat(
      withTiming(40, { duration: 2000 }),
      -1,
      true
    );

    waveOffset2.value = withRepeat(
      withTiming(-40, { duration: 2000 }),
      -1,
      true
    );

    waveOffset3.value = withRepeat(
      withTiming(40, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedProps1 = useAnimatedProps(() => {
    return {
      d: `
        M 0 50
        Q 50 ${50 + waveOffset1.value} 100 50
        Q 150 ${50 - waveOffset1.value} 200 50
        Q 250 ${50 + waveOffset1.value} 300 50
        Q 350 ${50 - waveOffset1.value} 400 50
        Q 450 ${50 + waveOffset1.value} 500 50
        Q 550 ${50 - waveOffset1.value} 600 50
        Q 650 ${50 + waveOffset1.value} 700 50
        Q 750 ${50 - waveOffset1.value} 800 50
        L 800 100
        L 0 100
        Z
      `,
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    return {
      d: `
        M 0 60
        Q 50 ${60 + waveOffset2.value} 100 60
        Q 150 ${60 - waveOffset2.value} 200 60
        Q 250 ${60 + waveOffset2.value} 300 60
        Q 350 ${60 - waveOffset2.value} 400 60
        Q 450 ${60 + waveOffset2.value} 500 60
        Q 550 ${60 - waveOffset2.value} 600 60
        Q 650 ${60 + waveOffset2.value} 700 60
        Q 750 ${60 - waveOffset2.value} 800 60
        L 800 100
        L 0 100
        Z
      `,
    };
  });

  const animatedProps3 = useAnimatedProps(() => {
    return {
      d: `
        M 0 80
        Q 50 ${80 - waveOffset3.value} 100 80
        Q 150 ${80 + waveOffset3.value} 200 80
        Q 250 ${80 - waveOffset3.value} 300 80
        Q 350 ${80 + waveOffset3.value} 400 80
        Q 450 ${80 - waveOffset3.value} 500 80
        Q 550 ${80 + waveOffset3.value} 600 80
        Q 650 ${80 - waveOffset3.value} 700 80
        Q 750 ${80 + waveOffset3.value} 800 80
        L 800 120
        L 0 120
        Z
      `,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={width} height={150} viewBox={`0 0 ${width} 120`}>
        <Defs>
          <LinearGradient id="waveGradient1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#00AEEF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#00AEEF" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="waveGradient2" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0077BE" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0077BE" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="waveGradient3" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0057A0" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0057A0" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Main Wave */}
        <G opacity={0.7}>
          <AnimatedPath
            animatedProps={animatedProps1}
            fill="url(#waveGradient1)"
            stroke="#00AEEF"
            strokeWidth="3"
          />
        </G>

        {/* Second Wave (Shifted) */}
        <G opacity={0.5}>
          <AnimatedPath
            animatedProps={animatedProps2}
            fill="url(#waveGradient2)"
            stroke="#0077BE"
            strokeWidth="3"
          />
        </G>

        {/* Opposite Wave Below (Properly Curved Now) */}
        <G opacity={0.5}>
          <AnimatedPath
            animatedProps={animatedProps3}
            fill="url(#waveGradient3)"
            stroke="#0057A0"
            strokeWidth="3"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center",
    position: "absolute",
    top: height * 0.5,
    transform: [{ translateY: -(height * 0.1) }],
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Waveform;
