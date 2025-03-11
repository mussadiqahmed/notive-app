import React, { useState, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Progress from "react-native-progress";
import { useDarkMode } from './DarkModeContext'; // Import the custom hook

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Summary = ({navigation}) => {
  const [storageUsed, setStorageUsed] = useState(100); // Dummy storage used value (in MB)
  const [totalStorage, setTotalStorage] = useState(100000); // Dummy total storage value (in MB)
  const [aiTokensUsed, setaiTokensUsed] = useState(100); // Dummy storage used value (in MB)
  const [totalAITokens, settotalAITokens] = useState(100000); // Dummy total storage value (in MB)
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  useEffect(() => {
    // Setting dummy storage values directly
    setStorageUsed(36500); // Dummy value for used storage
    setTotalStorage(102450); // Dummy value for total storage (in MB)
    setaiTokensUsed(125034);
    settotalAITokens(500000);
  }, []);

  const storagePercentage = (storageUsed / totalStorage) * 100;
  const formattedStorageUsed = (storageUsed / 1024).toFixed(1); // Convert MB to GB and format
  const formattedTotalStorage = (totalStorage / 1024).toFixed(1); // Convert MB to GB and format

  const formattedAITokensUsed = aiTokensUsed.toLocaleString(); // Format the tokens used
  const formattedTotalAITokens = totalAITokens.toLocaleString(); // Format the total tokens
  const getProgressBarColor = () => {
    if (storagePercentage > 80) return "#FF0000"; // Red for high usage
    if (storagePercentage > 50) return "#FFA500"; // Orange for medium usage
    return "#9AC93D"; // Green for low usage
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate("Navbar")}>
            <Icon name="arrow-left" size={width * 0.07} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
        </View>
      </View>

      {/* Settings Dropdown */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>Usage Summary</Text>

        {/* Gradient Border Box */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // Left-to-right gradient
          style={styles.gradientBorder}
        >
          <View style={[styles.planBox, dynamicStyles.planBox]}>
            <View style={styles.planRow}>
            <Image
                source={require("../../../assets/2GradientStar.png")}
                style={styles.starimage}
              />

              {/* Standard Plan Text */}
              <MaskedView
              >
                <Text style={[styles.planText, dynamicStyles.planText]}>Standard </Text>
              </MaskedView>

              {/* Gradient Price Text */}
              <MaskedView
                maskElement={<Text style={[styles.gradientText, dynamicStyles.gradientText]}>$47/mo</Text>}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.gradientText, { opacity: 0 }]}>
                    $47/mo
                  </Text>
                </LinearGradient>
              </MaskedView>
            </View>

            {/* Tokens & Storage */}
            <Text style={[styles.detailsText, dynamicStyles.detailsText]}>
              Tokens: <Text style={[styles.blackText, dynamicStyles.blackText]}>500,000</Text> | Storage:{" "}
              <Text style={[styles.blackText, dynamicStyles.blackText]}>
                {storageUsed ? `${storageUsed} GB` : "Loading..."}
              </Text>
            </Text>

            {/* Free Trial Countdown */}
            <View style={styles.trialTextContainer}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientBackground, { opacity: 0.4 }]}
              ></LinearGradient>
              <Text style={[styles.trialText, dynamicStyles.trialText]}>Free trial ends in 47h:59m</Text>
            </View>

            {/* Renewal Date */}
            <Text style={[styles.renewalText, dynamicStyles.renewalText]}>Renews Feb 04, 2025</Text>

            {/* Separator Line */}
            <View style={[styles.separator, dynamicStyles.separator]} />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity>
                <Text style={styles.cancelText}>Cancel Renewal</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.changePlanContainer}>
                  <Icon name="refresh" size={width * 0.06} color="#6F767E" />
                  <Text style={styles.changeText}>Change Plan</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.storageContainer}>
          {/* Storage Row */}
          <View style={styles.storageRow}>
            {/* Image Icon on the Left (taking up a larger portion) */}
            <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
              <Image
                source={require("../../../assets/Storage.png")}
                style={styles.image}
              />
            </View>

            {/* Right Side Content */}
            <View style={styles.detailsContainer}>
              <Text style={[styles.storageHeader, dynamicStyles.storageHeader]}>Storage Usage</Text>
              <Text style={styles.detailsText}>
                {formattedStorageUsed} GB of {formattedTotalStorage} GB
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={storagePercentage / 100}
                  width={null}
                  height={height * 0.01}
                  color={getProgressBarColor()}
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  borderRadius={10}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.storageContainer}>
          {/* Storage Row */}
          <View style={styles.storageRow}>
            {/* Image Icon on the Left (taking up a larger portion) */}
            <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
              <Image
                source={require("../../../assets/Token.png")}
                style={styles.image}
              />
            </View>

            {/* Right Side Content */}
            <View style={styles.detailsContainer}>
              <Text style={[styles.storageHeader, dynamicStyles.storageHeader]}>AI Token Usage</Text>
              <Text style={[styles.detailsText, dynamicStyles.detailsText]}>
                {formattedAITokensUsed} of {formattedTotalAITokens}
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={storagePercentage / 100}
                  width={null}
                  height={height * 0.01}
                  color={getProgressBarColor()}
                  unfilledColor="#E0E0E0"
                  borderWidth={0}
                  borderRadius={10}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Summary;

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
    borderWidth: 1,
    borderColor: "#EFEFEF",
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
    height: height * 0.85,
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.07,
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },

  /** ✅ Gradient Border Box */
  gradientBorder: {
    padding: 3, // Border thickness
    borderRadius: 16, // Rounded border
    backgroundColor: "transparent",
  },

  planBox: {
    width: width * 0.80, // Increased width
    borderRadius: 14, // Slightly smaller to fit inside gradient border
    padding: width * 0.05,
    backgroundColor: "#FFFFFF",
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
  },
  planText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    marginLeft: width * 0.02,
  },
  gradientText: {
    fontSize: width * 0.05,
    fontWeight: "700",
  },
  detailsText: {
    fontSize: width * 0.04,
    color: "gray", // Default color for the rest of the text
    marginBottom: height * 0.005,
  },

  blackText: {
    color: "black", // Color for 500,000 and 100 GB
    fontWeight: "600", // Optional: to make the text bold
  },

  renewalText: {
    fontSize: width * 0.035,
    color: "black",
    fontWeight: "600",
    marginBottom: height * 0.01,
    backgroundColor: "#D9D9D959",
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.005,
    width: "60%",
    borderRadius: 5,
    marginTop: height * 0.01,
  },
  separator: {
    height: 1,
    backgroundColor: "#EFEFEF",
    marginVertical: height * 0.01,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: width * 0.04,
    color: "#EA4335",
    fontWeight: "600",
  },
  changePlanContainer: {
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Vertically center the icon and text
  },
  changeText: {
    fontSize: width * 0.04,
    color: "#6F767E",
    fontWeight: "600",
    marginLeft: 5, // Add some space between the icon and text
  },

  trialTextContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative", // Important for placing text on top of the gradient
    paddingHorizontal: width * 0.01, // Padding around the text (adjust as needed)
    paddingVertical: height * 0.005, // Padding around the text (adjust as needed)
  },

  gradientBackground: {
    position: "absolute", // Position background behind the text
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: width * 0.01, // Ensure the background takes full width
    paddingVertical: height * 0.005, // Ensure the background takes full height
    borderRadius: 8, // Rounded corners for the background
    width : "80%"
  },

  trialText: {
    color: "black",
    fontSize: width * 0.035,
    fontWeight: "700",
  },

  storageContainer: {
    marginTop: height * 0.02,
    width: width * 0.80,
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 15,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
  },
  storageRow: {
    flexDirection: "row", // Layout children horizontally
    alignItems: "flex-start", // Align items to the top
  },
  iconContainer: {
    width: width * 0.2, // Image takes up 20% of the container width
    height: width * 0.2, // Set height to match the width
    borderRadius: width * 0.1, // Make the icon circular (half the width and height)
    backgroundColor: "#1A1D1F", // Background color for the icon
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: width * 0.03, // Space between the icon and content
  },
  starimage: {
    width: 24, 
    height: 24,
    resizeMode: "contain", // Makes sure the image doesn't stretch
  },

  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  detailsContainer: {
    width: width * 0.50, // Content takes up the remaining 65% of the container width
  },
  storageHeader: {
    fontSize: width * 0.05,
    fontWeight: "600",
    color: "#333",
    marginBottom: height * 0.01,
  },
  detailsText: {
    fontSize: width * 0.035,
    color: "#6F767E",
    fontWeight: "600",
    marginBottom: height * 0.01,
  },
  progressBarContainer: {
    marginTop: height * 0.01,
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
  planBox: {
    backgroundColor: "#111315",
  },

  planText: {
    color: "white",
  },
  detailsText: {
    color: "red", // Default color for the rest of the text
  },

  blackText: {
    color: "white", // Color for 500,000 and 100 GB
  },

  renewalText: {
    color: "white",
    backgroundColor: "#D9D9D959",
  },
  separator: {
    backgroundColor: "#333333",
  },

  trialText: {
    color: "white",
  },

  iconContainer: {
    backgroundColor: "#1A1D1F", // Background color for the icon
    borderColor:'white'
  },

  storageHeader: {
    color: "white",
  },
  detailsText: {
    color: "#6F767E",
  },
  
};