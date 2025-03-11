import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from './DarkModeContext'; // Import the custom hook

const { width, height } = Dimensions.get("window");

const Change_Password = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isDarkMode } = useDarkMode(); // Access dark mode state

const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  return (
        <View style={[styles.container, dynamicStyles.container]}>
    
    <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}
           onPress={() => navigation.navigate("Navbar")}>
            <Icon name="arrow-left" size={width * 0.07} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
        </View>
      </View>

      {/* Dropdown Settings Menu */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />

        {/* Change Password Section */}
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>Password</Text>

        {/* Old Password */}
        <Text style={[styles.label, dynamicStyles.label]}>Old Password</Text>
        <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
          <Icon name="lock" size={22}  style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]} />
          <TextInput
            style={[styles.inputField, dynamicStyles.inputField]}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
            <Icon 
              name={showOldPassword ? "eye-off" : "eye"} 
              size={22} 
              style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]}
            />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={[styles.label, dynamicStyles.label]}>New Password</Text>
        <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
          <Icon name="lock" size={22} style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]} />
          <TextInput
            style={[styles.inputField, dynamicStyles.inputField]}
            placeholder="New Password"
            placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Icon 
              name={showNewPassword ? "eye-off" : "eye"} 
              size={22} 
              style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.passwordRequirement}>Minimum 8 characters</Text>

        {/* Confirm Password */}
        <Text style={[styles.label, dynamicStyles.label]}>Confirm New Password</Text>
        <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
          <Icon name="lock" size={22} style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]} />
          <TextInput
            style={[styles.inputField, dynamicStyles.inputField]}
            placeholder="Confirm new password"
            placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon 
              name={showConfirmPassword ? "eye-off" : "eye"} 
              size={22} 
              style={[styles.leftIcon, styles.iconColor, dynamicStyles.iconColor]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.passwordRequirement}>Minimum 8 characters</Text>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Change Password</Text>
        </TouchableOpacity>
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
  rectangle_body: {
    alignItems: "center",
    width: width * 0.9,
    height: height * 0.85,
    paddingVertical: height * 0.03,
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
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.07,
    fontWeight: "900",
    color: "black",
    marginBottom: height * 0.005,
    marginTop: height * 0.01,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.04,
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#F3F5F7",
    borderRadius: 15,
    backgroundColor: "#F3F5F7",
    paddingHorizontal: width * 0.04,
    height: height * 0.07,
    marginBottom: height * 0.015,
  },
  inputField: {
    flex: 1,
    fontSize: width * 0.035,
    color: "black",
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
  iconColor:{
color: 'gray'
  },
  passwordRequirement: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.035,
    color: "gray",
    marginBottom: height * 0.02,
  },
  submitButton: {
    width: "90%",
    backgroundColor: "#7C3DFA",
    paddingVertical: height * 0.020,
    borderRadius: 40,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  submitText: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "white",
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
  inputContainer: {
    borderColor: "#222628",
    backgroundColor: "#222628",
  },
  inputField: {
    color: "#B0B2B5",
  },
 
  iconColor: {
    color: "#6C727580",
  },

};
