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
import { useDarkMode } from "./DarkModeContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Notification = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { isDarkMode } = useDarkMode();
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
          Notifications
        </Text>

        {/* Label with Toggle Switch */}
        <View style={styles.switchContainer}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Allow Notive AI chat with you through notifications
          </Text>

          <View
            style={[
              styles.switchBackground,
              {
                backgroundColor: isEnabled ? "#81b0ff" : "#767577",
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
    minHeight: "80%"
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
    fontSize: scaleFont(16),
    fontWeight: "600",
    fontFamily: "inter",
    color: "#33383F",
    marginBottom: scaleHeight(10),
    marginTop: scaleHeight(10),
    width: "70%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginLeft: scaleFont(10),
  },
  switchBackground: {
    borderRadius: 40,
    width: scaleWidth(70),
    height: scaleHeight(40),
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    transform: [{ scaleX: scaleFont(1.5) }, { scaleY: scaleFont(1.5) }],
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