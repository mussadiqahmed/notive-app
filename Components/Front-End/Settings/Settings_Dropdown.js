import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDarkMode } from '../Settings/DarkModeContext';

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const settingsOptions = [
  { name: "Password", icon: "lock", screen: "Change_Pass" },
  { name: "Edit Profile", icon: "account-edit", screen: "Edit_Profile" },
  { name: "Appearance", icon: "palette", screen: "Appearance" },
  { name: "AI Voice", icon: "robot", screen: "AI_Voice" },
  { name: "Billing", icon: "credit-card", screen: "Billing" },
  { name: "Subscription", icon: "card-bulleted-outline", screen: "Subscription" },
  { name: "Usage Summary", icon: "chart-bar", screen: "Summary" },
  { name: "Notification", icon: "bell-outline", screen: "Notification" },
  { name: "Logout", icon: "logout", screen: "Logout" },
];

const SettingsDropdown = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useDarkMode();

  // Get the current option based on route name
  const getCurrentOption = () => {
    const currentOption = settingsOptions.find(option => option.screen === route.name);
    return currentOption || settingsOptions[0];
  };

  // Track the current option
  const [currentOption, setCurrentOption] = useState(getCurrentOption());

  useEffect(() => {
    // Update current option when route changes
    const option = settingsOptions.find(option => option.screen === route.name);
    if (option) {
      setCurrentOption(option);
      const index = settingsOptions.findIndex(opt => opt.screen === route.name);
      setSelectedIndex(index);
    }
  }, [route.name]);

  const handleOptionSelect = (index, screen, name) => {
    setSelectedIndex(index);
    setDropdownVisible(false);
    navigation.navigate(screen);
  };

  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, dynamicStyles.dropdownButton]}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <View style={styles.selectedOptionContainer}>
          <Icon 
            name={currentOption.icon} 
            size={scaleFont(20)} 
            color={dynamicStyles.iconColor} 
          />
          <Text style={[styles.selectedOptionText, { color: dynamicStyles.textColor }]}>
            {currentOption.name}
          </Text>
        </View>
        <Icon 
          name={dropdownVisible ? "chevron-up" : "chevron-down"} 
          size={scaleFont(20)} 
          color={dynamicStyles.iconColor} 
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownMenuContainer}>
          <View style={[styles.dropdownMenu, dynamicStyles.dropdownMenu]}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionItem, selectedIndex === index && dynamicStyles.selectedOption]}
                onPress={() => handleOptionSelect(index, option.screen, option.name)}
              >
                <Icon 
                  name={option.icon} 
                  size={scaleFont(20)} 
                  color={dynamicStyles.iconColor} 
                />
                <Text style={[styles.optionText, { color: dynamicStyles.textColor }]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SettingsDropdown;

const styles = StyleSheet.create({
  dropdownContainer: {
    alignItems: "center",
    width: "90%",
    zIndex: 10,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: scaleHeight(15),
    paddingHorizontal: scaleWidth(15),
    borderWidth: scaleWidth(2),
    borderRadius: scaleWidth(15),
    marginBottom: scaleHeight(10),
  },
  selectedOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOptionText: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    marginLeft: scaleWidth(10),
  },
  dropdownMenuContainer: {
    position: "absolute",
    top: scaleHeight(60), // Position below the dropdown button
    width: "100%",       // Match parent width
    alignSelf: "center", // Center horizontally
    zIndex: 100,
  },
  dropdownMenu: {
    borderRadius: scaleWidth(16),
    borderWidth: scaleWidth(2),
    paddingVertical: scaleHeight(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: scaleHeight(2) },
    shadowOpacity: 0.2,
    shadowRadius: scaleWidth(4),
    elevation: 5,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scaleHeight(15),
    paddingHorizontal: scaleWidth(15),
  },
  optionText: {
    fontSize: scaleFont(16),
    fontWeight: "500",
    marginLeft: scaleWidth(10),
  },
  selectedOption: {
    borderRadius: scaleWidth(10),
  },
});

// Light Mode Styles
const lightModeStyles = {
  dropdownButton: {
    backgroundColor: "#FCFCFC",
    borderColor: "#E8ECEF",
  },
  iconColor: "black",
  textColor: "black",
  dropdownMenu: {
    backgroundColor: "#FCFCFC",
    borderColor: "#EFEFEF",
  },
  selectedOption: {
    backgroundColor: "#E8ECEF",
  },
};

// Dark Mode Styles
const darkModeStyles = {
  dropdownButton: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30",
  },
  iconColor: "white",
  textColor: "white",
  dropdownMenu: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30",
  },
  selectedOption: {
    backgroundColor: "#272B30",
  },
};