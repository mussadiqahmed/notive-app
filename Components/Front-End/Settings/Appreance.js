import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions (same as Change_Password.js)
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Appearance = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.rectangle, dynamicStyles.rectangle]}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("Navbar")}
            >
              <Icon
                name="arrow-left"
                size={scaleFont(24)}
                color={isDarkMode ? "white" : "black"}
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
            onPress={() => toggleDarkMode()}
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
            onPress={() => toggleDarkMode()}
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
      </ScrollView>
    </View>
  );
};

export default Appearance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollView: {
    alignItems: "center",
    paddingTop: scaleHeight(40),
    flexGrow: 1,
  },
  rectangle: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    paddingVertical: scaleHeight(25),
    paddingLeft: scaleFont(15),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    alignSelf: "center",
  },
  rectangle_body: {
    alignItems: "center",
    width: "90%",
    paddingVertical: scaleHeight(20),
    borderRadius: 16,
    minHeight: '80%',
    backgroundColor: "#FCFCFC",
    marginTop: scaleHeight(15),
    alignSelf: "center",
    marginBottom: scaleHeight(20),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: scaleFont(20),
    fontWeight: "700",
    color: "black",
    marginLeft: scaleFont(15),
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(24),
    fontWeight: "900",
    color: "black",
    marginTop: scaleHeight(5),
    marginBottom: scaleHeight(20),
  },
  imageContainer: {
    alignItems: "center",
    padding: scaleFont(5),
    borderRadius: 12,
    marginBottom: scaleHeight(20),
    width: "90%",
  },
  selectedBorder: {
    borderWidth: 2,
    borderColor: "#7C3DFA", // Using the same purple as Change_Password.js
  },
  modeText: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    color: "black",
    alignSelf: "flex-start",
    marginTop: scaleHeight(15),
    paddingHorizontal: scaleFont(10),
  },
  image: {
    width: "100%",
    height: scaleHeight(150),
    borderRadius: 12,
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
  modeText: {
    color: "white",
  },
};