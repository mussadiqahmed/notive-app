import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDarkMode } from '../Settings/DarkModeContext'; // Import the dark mode hook

const { width, height } = Dimensions.get("window");

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
  const { isDarkMode } = useDarkMode(); // Get dark mode state

  useEffect(() => {
    if (route.params && route.params.optionName) {
      const optionIndex = settingsOptions.findIndex(option => option.name === route.params.optionName);
      if (optionIndex !== -1) {
        setSelectedIndex(optionIndex);
      }
    }
  }, [route.params]);

  const handleOptionSelect = (index, screen, name) => {
    setSelectedIndex(index);
    setDropdownVisible(false);
    navigation.navigate(screen, { optionName: name });
  };

  const validIndex = selectedIndex >= 0 && selectedIndex < settingsOptions.length ? selectedIndex : 0;

  // Dynamic styles based on dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, dynamicStyles.dropdownButton]}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <View style={styles.selectedOptionContainer}>
          <Icon name={settingsOptions[validIndex].icon} size={width * 0.06} color={dynamicStyles.iconColor} />
          <Text style={[styles.selectedOptionText, { color: dynamicStyles.textColor }]}>
            {settingsOptions[validIndex].name}
          </Text>
        </View>
        <Icon name={dropdownVisible ? "chevron-up" : "chevron-down"} size={width * 0.06} color={dynamicStyles.iconColor} />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownMenuContainer}>
          <View style={[styles.dropdownMenu, dynamicStyles.dropdownMenu]}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.optionItem, validIndex === index && dynamicStyles.selectedOption]}
                onPress={() => handleOptionSelect(index, option.screen, option.name)}
              >
                <Icon name={option.icon} size={width * 0.06} color={dynamicStyles.iconColor} />
                <Text style={[styles.optionText, { color: dynamicStyles.textColor }]}>{option.name}</Text>
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
    width: width * 0.9,
    zIndex: 10, // Ensures dropdown stays on top
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: height * 0.02,
  },
  selectedOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOptionText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    marginLeft: width * 0.03,
  },
  dropdownMenuContainer: {
    position: "absolute",
    top: height * 0.08, // Adjust this value to fine-tune positioning
    left: "5%",
    width: "90%",
    zIndex: 100, // Ensures it's above other content
  },
  dropdownMenu: {
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: height * 0.01,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
  },
  optionText: {
    fontSize: width * 0.045,
    fontWeight: "500",
    marginLeft: width * 0.03,
  },
  selectedOption: {
    backgroundColor: "#E8ECEF",
    borderRadius: 10,
  },
  arrowButton: {
    alignItems: "center",
    paddingVertical: height * 0.01,
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
