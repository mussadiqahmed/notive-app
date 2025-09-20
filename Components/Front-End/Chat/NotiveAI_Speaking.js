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
import { useDarkMode } from '../Settings/DarkModeContext'; // Import the dark mode hook

const { width, height } = Dimensions.get("window");

const NotiveAI_Speaking = ({navigation}) => {
  const [isListening, setIsListening] = useState(false);
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Navbar")}>
            <MaterialCommunityIcons name="arrow-left" size={width * 0.07} color= {isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Speaking to NotiveAI</Text>
        </View>
      </View>

      <View style={[styles.inputRectangle, dynamicStyles.inputRectangle]}>

      {/* Show Animated Wave When Speaking */}
      {isListening && <Waveform /> }

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={[styles.iconButton, dynamicStyles.iconButton]} onPress={() => navigation.navigate("Navbar")}>
          <MaterialCommunityIcons name="close" size={width * 0.08} color="#6F767E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, dynamicStyles.iconButton, styles.microphone]}
          onPressIn={() => setIsListening(true)}
          onPressOut={() => setIsListening(false)}
        >
          <MaterialCommunityIcons name="microphone-outline" size={width * 0.14} color="#6F767E" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconButton, dynamicStyles.iconButton]} onPress={() => navigation.navigate("AI_Voice")}>
          <MaterialCommunityIcons name="cog-outline" size={width * 0.08} color="#6F767E" />
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
    paddingTop: height * 0.02,
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
    height: height * 0.85,
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

// Dynamic styles for dark mode
const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  rectangle: {
    backgroundColor: "#1A1D1F",
    borderColor: "#1A1D1F",
  },
  text: {
    color: "white",
  },
  inputRectangle: {
    backgroundColor: "#1A1D1F",
    borderColor: "#1A1D1F",
  },

  iconButton: {
    borderColor: "#272B30",
  },
  
};
