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

const AI_Voice = ({navigation}) => {
  const [selectedGender, setSelectedGender] = useState("Male");
  const [activeArrow, setActiveArrow] = useState(null); // Track which arrow is active
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;
  const toggleGender = (direction) => {
    setActiveArrow(direction); // Set the active arrow (left or right)
    setSelectedGender((prevGender) =>
      prevGender === "Male" ? "Female" : "Male"
    );
  };

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
          AI Voice
        </Text>

        {/* Profile Image with TouchableOpacity */}
        <TouchableOpacity activeOpacity={0.4}>
          <Image
            source={require("../../../assets/AIVoice.png")}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Gender Text */}
        <Text style={[styles.genderText, dynamicStyles.genderText]}>
          {selectedGender}
        </Text>

        {/* Description Based on Gender */}
        <Text style={[styles.descriptionText, dynamicStyles.descriptionText]}>
          {selectedGender === "Male"
            ? "Cheerful and candid"
            : "Warm and expressive"}
        </Text>

        {/* Left & Right Arrows to Switch Gender */}
        <View style={styles.arrowContainer}>
          <TouchableOpacity
            onPress={() => toggleGender("left")}
            style={[
              styles.arrowButton,
              activeArrow === "left" && [
                styles.activeArrow,
                dynamicStyles.activeArrow,
              ],
              darkModeStyles.arrowButton, // Apply dark mode style
            ]}
          >
            <Icon
              name="arrow-left"
              size={width * 0.08}
              color={
                activeArrow === "left"
                  ? isDarkMode
                    ? "white"
                    : "black"
                  : isDarkMode
                  ? "#B0B0B0"
                  : "#6F767E"
              } // Change color based on dark mode
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleGender("right")}
            style={[
              styles.arrowButton,
              activeArrow === "right" && [
                styles.activeArrow,
                dynamicStyles.activeArrow,
              ],
            ]}
          >
            <Icon
              name="arrow-right"
              size={width * 0.08}
              color={
                activeArrow === "right"
                  ? isDarkMode
                    ? "white"
                    : "black"
                  : isDarkMode
                  ? "#B0B0B0"
                  : "#6F767E"
              } // Change color based on dark mode
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AI_Voice;

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
    fontFamily: "inter",
    color: "black",
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: height * 0.02,
  },
  genderText: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "black",
  },
  descriptionText: {
    fontSize: width * 0.045,
    fontWeight: "500",
    marginTop: height * 0.007,
    marginBottom: height * 0.02,
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.3,
  },
  arrowButton: {
    width: width * 0.12,
    height: width * 0.12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: width * 0.06, // Makes it a circle
  },
  activeArrow: {
    Color: "black", // Arrow stays black when active
    borderRadius: width * 0.06, // Keep it circular
    borderWidth: 3,
    borderColor: "#EFEFEF",
  },
});

// Dynamic styles for dark mode
const lightModeStyles = {
  container: {
    backgroundColor: "#F4F4F4",
  },
  rectangle: {
    backgroundColor: "#FCFCFC",
  },
  text: {
    color: "black",
  },
  rectangle_body: {
    backgroundColor: "#FCFCFC",
  },
  label_Pass: {
    color: "black",
  },

  genderText: {
    color: "black",
  },
  descriptionText: {
    color: "#6F767E",
  },

  activeArrow: {
    Color: "black",
    borderColor: "#EFEFEF",
  },
};

// Dynamic styles for dark mode
const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  rectangle: {
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

  genderText: {
    color: "white",
  },
  descriptionText: {
    color: "#6F767E",
  },

  activeArrow: {
    Color: "black",
    borderColor: "#272B30",
  },

  iconColor: {
    color: "white",
  },
};
