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
import { useDarkMode } from "./DarkModeContext"; // Import dark mode context

const { width, height } = Dimensions.get("window");

const Edit_Profile = ({navigation}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

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
            <TouchableOpacity style={styles.backButton}
            onPress={() => navigation.navigate("Navbar")}>
              <Icon name="arrow-left" size={width * 0.07}  color={isDarkMode ? "white" : "black"}/>
            </TouchableOpacity>
            <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
          </View>
        </View>

        {/* Dropdown Settings Menu */}
        <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
          <SettingsDropdown />
          <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>Edit Profile</Text>

          {/* First Name */}
          <Text style={[styles.label, dynamicStyles.label]}>First Name</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon name="account" size={22} style={[styles.iconColor, dynamicStyles.iconColor]} />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your first name"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <Text style={[styles.label, dynamicStyles.label]}>Last Name</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon name="account" size={22} style={[styles.iconColor, dynamicStyles.iconColor]} />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your last name"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email */}
          <Text style={[styles.label, dynamicStyles.label]}>Email</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon name="email" size={22} style={[styles.iconColor, dynamicStyles.iconColor]} />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your email"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "gray"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone Number */}
          <Text style={[styles.label, dynamicStyles.label]}>Phone No</Text>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon name="phone" size={22} style={[styles.iconColor, dynamicStyles.iconColor]} />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Enter your phone number"
              placeholderTextColor={isDarkMode ? "#A0A0A0" : "# B0B2B5"}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={[styles.submitButton, dynamicStyles.submitButton]}>
            <Text style={[styles.submitText, dynamicStyles.submitText]}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Edit_Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollView: {
    alignItems: "center",
    paddingTop: height * 0.05,
    flexGrow: 1,
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
    paddingVertical: height * 0.03,
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: height * 0.015,
    height: height * 0.85
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
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.04,
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.01,
    marginTop: height * 0.01,
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
    marginLeft: width * 0.02
  },
  leftIcon: {
    marginRight: 10, 
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
  iconColor:{
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
 
  iconColor: {
    color: "#6C727580",
  },

};
