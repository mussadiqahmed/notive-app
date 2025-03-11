import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext"; // Import the custom hook

const { width, height } = Dimensions.get("window");

const Appearance = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Get dark mode state and toggle function

  // Dynamic styles based on the dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Navbar")}
          >
            <Icon
              name="arrow-left"
              size={width * 0.065}
              color={dynamicStyles.iconColor}
            />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
        </View>
      </View>

      {/* Settings Dropdown */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>
          Appearance
        </Text>

        {/* Light Mode Image */}
        <TouchableOpacity
          style={[styles.imageContainer, !isDarkMode && styles.selectedBorder]}
          onPress={() => {
            toggleDarkMode(); // Toggle to light mode
          }}
        >
          <Image
            source={require("../../../assets/LightMode.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.modeText, dynamicStyles.modeText]}>
            Light Mode
          </Text>
        </TouchableOpacity>

        {/* Dark Mode Image */}
        <TouchableOpacity
          style={[styles.imageContainer, isDarkMode && styles.selectedBorder]}
          onPress={() => {
            toggleDarkMode(); // Toggle to dark mode
          }}
        >
          <Image
            source={require("../../../assets/DarkMode.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={[styles.modeText, dynamicStyles.modeText]}>
            Dark Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Appearance;

/** ✅ Styles */
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
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "black",
    marginLeft: width * 0.03,
  },
  rectangle_body: {
    alignItems: "center",
    width: width * 0.9,
    paddingVertical: height * 0.03,
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: height * 0.015,
    height: height * 0.83,
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.07,
    fontWeight: "900",
    color: "black",
    marginBottom: height * 0.03,
  },
  imageContainer: {
    alignItems: "center",
    padding: 5,
    borderRadius: 12,
    marginBottom: height * 0.02,
    width: "90%",
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: "blue",
  },
  modeText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    alignSelf: "flex-start",
    marginTop: height * 0.04,
    paddingHorizontal: height * 0.025,
  },
  image: {
    width: width * 0.85,
    height: height * 0.2,
    borderRadius: 12,
  },
});

const lightModeStyles = {
  container: {
    backgroundColor: "#F4F4F4",
  },
  iconColor: "black",
  text: {
    color: "black",
  },
  rectangle_body: {
    backgroundColor: "#FCFCFC",
  },
  label_Pass: {
    color: "black",
  },
  modeText: {
    color: "black",
  },
};

const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  iconColor: "white",
  text: {
    color: "white",
  },
  rectangle: {
    backgroundColor: "#1A1D1F",
    borderColor: "black",
  },
  rectangle_body: {
    backgroundColor: "#1A1D1F",
  },
  label_Pass: {
    color: "white",
  },
  modeText: {
    color: "white",
  },
};
