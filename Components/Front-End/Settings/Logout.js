import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext"; // Import the custom hook

const { width, height } = Dimensions.get("window");

const Logout = ({ navigation }) => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
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
              size={width * 0.07}
              style={dynamicStyles.iconColor}
            />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
        </View>
      </View>

      {/* Settings Dropdown */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>
          Log out
        </Text>
        <Text style={styles.label}>Log out of your account</Text>

        <TouchableOpacity
          style={[styles.confirmButton, dynamicStyles.confirmButton]}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={[styles.confirmText, dynamicStyles.confirmText]}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Logout;

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
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "red",
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
  },
  confirmButton: {
    backgroundColor: "#141718",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    borderRadius: 50,
    alignItems: "center",
    width: "90%",
  },
  confirmText: {
    color: "white",
    fontWeight: "700",
    fontFamily: "inter",
    fontSize: width * 0.05,
  },
});

const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  rectangle: {
    borderColor: "#1A1D1F",
    backgroundColor: "#1A1D1F",
  },

  text: {
    color: "white",
  },
  rectangle_body: {
    backgroundColor: "#1A1D1F",
  },
  label_Pass: {
    color: "white",
  },
  label: {
    color: "red",
  },
  confirmButton: {
    backgroundColor: "white",
  },
  confirmText: {
    color: "black",
  },
  iconColor: {
    color: "white",
  },
};
