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
import { useDarkMode } from "./DarkModeContext";
import { useFolders } from "../Chat/FoldersContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Logout = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const { logout } = useFolders();
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
              size={scaleFont(24)}
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
        <Text style={[styles.label, dynamicStyles.label]}>Log out of your account</Text>

        <TouchableOpacity
          style={[styles.confirmButton, dynamicStyles.confirmButton]}
          onPress={async () => {
            await logout();
            // Navigate to sign in after logout
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    paddingTop: scaleHeight(40),
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
  rectangle_body: {
    alignItems: "center",
    width: "90%",
    paddingVertical: scaleHeight(20),
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: scaleHeight(15),
    alignSelf: "center",
    minHeight: "80%",
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(24),
    fontWeight: "900",
    color: "black",
    marginBottom: scaleHeight(10),
    marginTop: scaleHeight(5),
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(19),
    fontWeight: "700",
    color: "red",
    marginBottom: scaleHeight(10),
    marginTop: scaleHeight(30),
  },
  confirmButton: {
    backgroundColor: "#141718",
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleFont(40),
    borderRadius: 50,
    alignItems: "center",
    width: "90%",
  },
  confirmText: {
    color: "white",
    fontWeight: "700",
    fontFamily: "inter",
    fontSize: scaleFont(18),
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