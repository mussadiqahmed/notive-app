import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Change_Password = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
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

        {/* Dropdown Settings Menu */}
        <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
          <SettingsDropdown />
          <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>Change Password</Text>

          {/* Old Password */}
          <Text style={[styles.label, dynamicStyles.label]}>Old Password</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon 
              name="lock" 
              size={scaleFont(22)} 
              style={[styles.iconColor, dynamicStyles.iconColor]} 
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your old password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              secureTextEntry={!showOldPassword}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
              <Icon 
                name={showOldPassword ? "eye-off" : "eye"} 
                size={scaleFont(22)} 
                style={[styles.iconColor, dynamicStyles.iconColor]}
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <Text style={[styles.label, dynamicStyles.label]}>New Password</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon 
              name="lock" 
              size={scaleFont(22)} 
              style={[styles.iconColor, dynamicStyles.iconColor]} 
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your new password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Icon 
                name={showNewPassword ? "eye-off" : "eye"} 
                size={scaleFont(22)} 
                style={[styles.iconColor, dynamicStyles.iconColor]}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.label, dynamicStyles.label]}>Confirm New Password</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon 
              name="lock" 
              size={scaleFont(22)} 
              style={[styles.iconColor, dynamicStyles.iconColor]} 
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Confirm your new password"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={scaleFont(22)} 
                style={[styles.iconColor, dynamicStyles.iconColor]}
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <Text style={[styles.passwordHint, dynamicStyles.passwordHint]}>
            Password must be at least 8 characters long
          </Text>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, dynamicStyles.submitButton]}
            onPress={() => Keyboard.dismiss()}
          >
            <Text style={[styles.submitText, dynamicStyles.submitText]}>Change Password</Text>
          </TouchableOpacity>
          
          {/* Only show bottom padding when keyboard is visible */}
          {keyboardVisible && <View style={{ height: scaleHeight(170) }} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default Change_Password;

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
    marginBottom: scaleHeight(5),
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(16),
    fontWeight: "700",
    color: "black",
    marginBottom: scaleHeight(10),
    marginTop: scaleHeight(15),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#F3F5F7",
    borderRadius: 15,
    backgroundColor: "#F3F5F7",
    paddingHorizontal: scaleFont(15),
    height: scaleHeight(50),
    marginBottom: scaleHeight(15),
  },
  inputField: {
    flex: 1,
    fontSize: scaleFont(16),
    color: "black",
    marginLeft: scaleFont(10),
  },
  passwordHint: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(14),
    color: "gray",
    marginBottom: scaleHeight(15),
  },
  submitButton: {
    width: "90%",
    backgroundColor: "#7C3DFA",
    marginTop: scaleHeight(10),
    paddingVertical: scaleHeight(15),
    borderRadius: 40,
    alignItems: "center",
  },
  submitText: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    color: "white",
  },
  iconColor: {
    color: '#6C727580'
  }
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
  inputContainer: {
    borderColor: "#222628",
    backgroundColor: "#222628",
  },
  inputField: {
    color: "#B0B2B5",
  },
  passwordHint: {
    color: "#6C7275",
  },
  iconColor: {
    color: "#6C727580",
  },
  submitButton: {
    backgroundColor: "#7C3DFA",
  },
  submitText: {
    color: "white",
  },
};