import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext"; // Import the custom hook

const { width, height } = Dimensions.get("window");

const Notification = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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
          Notifications
        </Text>

        {/* Label with Toggle Switch */}
        <View style={styles.switchContainer}>
          {/* Text at the left */}
          <Text style={[styles.label, dynamicStyles.label]}>
            Allow Notive AI chat with you through notifications
          </Text>

          {/* Rectangular background for Switch */}
          <View
            style={[
              styles.switchBackground,
              {
                backgroundColor: isEnabled ? "#81b0ff" : "#767577", // Dynamic background color based on switch state
              },
            ]}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={"white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switch}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Notification;

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
    fontSize: width * 0.045,
    fontWeight: "600",
    fontfamily: "inter",
    color: "#33383F",
    marginBottom: height * 0.02,
    marginTop: height * 0.02,
    width: width * 0.6, // Ensure the text takes up space on the left
  },
  switchContainer: {
    flexDirection: "row", // Align switch and label in a row
    alignItems: "center", // Align them vertically
    justifyContent: "space-between", // Ensure switch is on the right and text on the left
    width: width * 0.82, // Set width to control layout
    marginLeft: width * 0.01, // Add left margin to center the content
  },
  switchBackground: {
    backgroundColor: "#767577", // Default background color for the switch when disabled
    borderRadius: 20, // Make the background rounded
    width: 75, // Set width of the background rectangle
    height: 40, // Set height of the background rectangle
    justifyContent: "center", // Center the switch vertically
    alignItems: "center", // Center the switch horizontally
  },
  switch: {
    transform: [{ scaleX: 2.0 }, { scaleY: 2.0 }], // Increase the size of the switch
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
    color: "white",
  },
  switchBackground: {
    backgroundColor: "#767577",
  },
  iconColor: {
    color: "white",
  },
};
