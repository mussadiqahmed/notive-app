import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Waveform from "./Waveform"; // Import the waveform

const { width, height } = Dimensions.get("window");

const NotiveAI_Speaking = () => {
  const [isListening, setIsListening] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={width * 0.07} color="black" />
          </TouchableOpacity>
          <Text style={styles.text}>Speaking to NotiveAI</Text>
        </View>
      </View>

      <View style={styles.inputRectangle}>

      {/* Show Animated Wave When Speaking */}
      {isListening && <Waveform /> }

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="close" size={width * 0.07} color="#6F767E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, styles.microphone]}
          onPressIn={() => setIsListening(true)}
          onPressOut={() => setIsListening(false)}
        >
          <MaterialCommunityIcons name="microphone" size={width * 0.14} color="#6F767E" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="cog" size={width * 0.07} color="#6F767E" />
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
};

export default NotiveAI_Speaking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  rectangle: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    paddingVertical: height * 0.03,
    paddingLeft: width * 0.03,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: height * 0.015,
  },


  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    paddingLeft: width * 0.03,
  },

  inputRectangle: {
    width: width * 0.9,
    height: height * 0.80,
    backgroundColor: "#FCFCFC",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },

  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: width * 0.7,
    position: "absolute",
    bottom: height * 0.05,
  },
  iconButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  microphone: {
    width: width * 0.22,
    height: width * 0.22,
    borderRadius: width * 0.11,
  },
});
