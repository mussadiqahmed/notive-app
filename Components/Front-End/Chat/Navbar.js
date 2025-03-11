import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from '../Settings/DarkModeContext'; // Import the dark mode hook

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Navbar = ({ navigation }) => {
  const [messageCount, setMessageCount] = useState(5);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected folder
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  const toggleGradient = (index) => {
    setSelectedItem(selectedItem === index ? null : index); // Toggle selection
  };

  const menuItems = [
    { label: "Inbox", icon: "folder", isFolder: true },
    { label: "Personal", icon: "folder", isFolder: true },
    { label: "Finances", icon: "folder", isFolder: true },
    { label: "New Folder", icon: "folder", isFolder: true },
    { label: "Recently Deleted", icon: "trash-can-outline", isFolder: false },
    { label: "Settings", icon: "cog-outline", isFolder: false },
    { label: "Add Folder", icon: "plus-circle", isFolder: false },
  ];

  const tags = ["All tags", "#tax", "#question", "#finances", "#mysterioso"];

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <Image
  source={isDarkMode ? require("../../../assets/LogoDark.png") : require("../../../assets/Logo.png")} 
  style={styles.logo}
        />
        <TouchableOpacity style={styles.clipboardContainer}>
          <Icon
            name="clipboard-edit-outline"
            size={width * 0.08}
            color={dynamicStyles.iconColor}
          />
        </TouchableOpacity>
      </View>

      {menuItems.map((item, index) => {
        const isSelected = selectedItem === index;
        return (
          <TouchableOpacity
          key={index}
          onPress={() => {
            toggleGradient(index); // Keep the existing gradient toggle logic
            if (item.label === "Settings") {  // Check if the selected item is "Settings"
              navigation.navigate("Change_Pass"); // Navigate to the Settings screen
            }
            else if (item.label === "Add Folder"){
              navigation.navigate("Add_Folder"); // Navigate to the Settings screen

            }
          }}
          style={styles.inboxWrapper}
        >
            {isSelected ? (
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientInbox}
              >
                <View style={styles.inboxContent}>
                  <View style={styles.leftContainer}>
                    <View style={styles.iconWrapper}>
                      {item.isFolder && (
                        <Icon
                          name="chevron-right"
                          size={width * 0.05}
                          color="white"
                        />
                      )}
                      <Icon
                        name={item.icon}
                        size={width * 0.05}
                        color="white"
                        style={styles.folderIcon}
                      />
                    </View>
                    <Text style={[styles.inboxText, dynamicStyles.inboxText]}>
                      {item.label}
                    </Text>
                  </View>
                  {item.isFolder && (
                    <View
                      style={[
                        styles.messageCountContainer,
                        isSelected && {
                          backgroundColor: "rgba(231, 233, 235, 0.25)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageCountText,
                          isSelected && { color: "white" },
                        ]}
                      >
                        {messageCount}
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            ) : (
              <View style={[styles.inboxContent, styles.defaultInbox, dynamicStyles.defaultInbox]}>
                <View style={styles.leftContainer}>
                  <View style={styles.iconWrapper}>
                    <Icon
                      name={item.icon}
                      size={width * 0.05}
                      color="#6F767E"
                      style={styles.folderIcon}
                    />
                  </View>
                  <Text style={styles.inboxText}>{item.label}</Text>
                </View>
                {item.isFolder && (
                  <View style={[styles.messageCountContainer, dynamicStyles.messageCountContainer,
                  ]}>
                    <Text style={[styles.messageCountText, dynamicStyles.messageCountText]}>{messageCount}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Tags Label */}
      <Text style={[styles.tagsLabel, dynamicStyles.tagsLabel]}>Tags</Text>

      {/* Tags List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
      >
        {tags.map((tag, index) => (
          <TouchableOpacity key={index} style={[styles.tag,dynamicStyles.tag]}>
            <Text style={[styles.tagText, dynamicStyles.tagText]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <View style={styles.innerRectangle}>
            <Image
              source={require("../../../assets/stars.png")} // Adjust path as needed
              style={{
                width: width * 0.06,
                height: width * 0.06,
                marginRight: 6,
              }}
              resizeMode="contain"
            />
            <Text style={styles.notiveAiText}>NotiveAI</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require("../../../assets/recording.png")} // Adjust path as needed
              style={{
                width: width * 0.08,
                height: width * 0.08,
                tintColor: "black",
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};
export default Navbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 16,
  },
  logo: {
    width: width * 0.40,
    height: width * 0.15,
    resizeMode: "contain",
  },
  clipboardContainer: {
    padding: width * 0.03,
  },
  inboxWrapper: {
    width: width * 0.9,
    marginTop: height * 0.01,
    borderRadius: 12,
    overflow: "hidden",
  },
  inboxContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    borderRadius: 12,
  },
  gradientInbox: {
    width: "100%",
    borderRadius: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIcon: {
    marginRight: width * 0.02,
  },
  inboxText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#6F767E",
    fontFamily: "Inter",
  },
  messageCountContainer: {
    backgroundColor: "#E7E9EB",
    borderRadius: 6,
    paddingVertical: width * 0.01,
    paddingHorizontal: width * 0.03,
    minWidth: width * 0.07,
    alignItems: "center",
    justifyContent: "center",
  },
  messageCountText: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "black",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: width * 0.9,
    height: 1,
    backgroundColor: "#D9D9D9",
    marginVertical: height * 0.02,
  },
  tagsLabel: {
    alignSelf: "flex-start",
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginLeft: width * 0.05,
    marginBottom: height * 0.01,
  },
  tagsContainer: {
    flexDirection: "row",
    width: width * 0.9,
    flexGrow: 0, // Prevent it from taking unnecessary vertical space
  },
  tag: {
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    marginRight: width * 0.03,
  },
  tagText: {
    fontSize: width * 0.03,
    fontWeight: "600",
    color: "#6F767E",
  },

  bottomContainer: {
    position: "absolute",
    bottom: height * 0.05,
    alignSelf: "center",
  },

  gradientButton: {
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
  },

  innerRectangle: {
    width: width * 0.6,
    height: height * 0.07,
    backgroundColor: "black",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15, // Adds spacing inside the rectangle
    right: 16,
  },

  notiveAiText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "white",
    fontFamily: "inter",
  },
});



// Dynamic styles for dark mode
const lightModeStyles = {
 
  container: {
    backgroundColor: "#FCFCFC",
  },
  rectangle: {
    borderColor: "#EFEFEF",
  },
  
  inboxText: {
    color: "white",
  },
  messageCountContainer: {
    backgroundColor: "#E7E9EB",
  },
  messageCountText: {
    color: "black",
  },
  divider: {
    backgroundColor: "#D9D9D9",
  },
  tagsLabel: {
    color: "#6F767E",
  },

  tag: {
    backgroundColor: "#EFEFEF",
  },
  tagText: {
    color: "#6F767E",
  },

};

// Dynamic styles for dark mode
const darkModeStyles = {
 
  container: {
    backgroundColor: "#1A1D1F",
  },
  rectangle: {
    borderColor: "#272B30",
  },
    iconColor:'white',
  inboxText: {
    color: "white",
  },
  messageCountContainer: {
    backgroundColor: "#2D2E30",
  },
  messageCountText: {
    color: "white",
  },
  divider: {
    backgroundColor: "#FFFFFF0D",
  },
  tagsLabel: {
    color: "#6F767E",
  },

  tag: {
    backgroundColor: "#292D2F",
  },
  tagText: {
    color: "#6F767E",
  },
  
};