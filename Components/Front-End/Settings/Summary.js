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
import { useDarkMode } from './DarkModeContext';

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Summary = ({navigation}) => {
  const [storageUsed, setStorageUsed] = useState(100);
  const [totalStorage, setTotalStorage] = useState(100000);
  const [aiTokensUsed, setaiTokensUsed] = useState(100);
  const [totalAITokens, settotalAITokens] = useState(100000);
  const { isDarkMode } = useDarkMode();
  
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  useEffect(() => {
    setStorageUsed(36500);
    setTotalStorage(102450);
    setaiTokensUsed(125034);
    settotalAITokens(500000);
  }, []);

  const storagePercentage = (storageUsed / totalStorage) * 100;
  const formattedStorageUsed = (storageUsed / 1024).toFixed(1);
  const formattedTotalStorage = (totalStorage / 1024).toFixed(1);
  const formattedAITokensUsed = aiTokensUsed.toLocaleString();
  const formattedTotalAITokens = totalAITokens.toLocaleString();

  const getProgressBarColor = () => {
    if (storagePercentage > 80) return "#FF0000";
    if (storagePercentage > 50) return "#FFA500";
    return "#9AC93D";
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate("Navbar")}>
            <Icon name="arrow-left" size={scaleFont(24)} color={isDarkMode ? "white" : "black"} />
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
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <View style={[styles.planBox, dynamicStyles.planBox]}>
            <View style={styles.planRow}>
              <Image
                source={require("../../../assets/2GradientStar.png")}
                style={styles.starimage}
              />

              <MaskedView>
                <Text style={[styles.planText, dynamicStyles.planText]}>Standard </Text>
              </MaskedView>

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

            <Text style={[styles.detailsText, dynamicStyles.detailsText]}>
              Tokens: <Text style={[styles.blackText, dynamicStyles.blackText]}>500,000</Text> | Storage:{" "}
              <Text style={[styles.blackText, dynamicStyles.blackText]}>
                {storageUsed ? `${storageUsed} GB` : "Loading..."}
              </Text>
            </Text>

            <View style={styles.trialTextContainer}>
              <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientBackground, { opacity: 0.4 }]}
              ></LinearGradient>
              <Text style={[styles.trialText, dynamicStyles.trialText]}>Free trial ends in 47h:59m</Text>
            </View>

            <Text style={[styles.renewalText, dynamicStyles.renewalText]}>Renews Feb 04, 2025</Text>

            <View style={[styles.separator, dynamicStyles.separator]} />

            <View style={styles.buttonRow}>
              <TouchableOpacity>
                <Text style={styles.cancelText}>Cancel Renewal</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.changePlanContainer}>
                  <Icon name="refresh" size={scaleFont(20)} color="#6F767E" />
                  <Text style={styles.changeText}>Change Plan</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.storageContainer}>
          <View style={styles.storageRow}>
            <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
              <Image
                source={require("../../../assets/Storage.png")}
                style={styles.image}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={[styles.storageHeader, dynamicStyles.storageHeader]}>Storage Usage</Text>
              <Text style={[styles.detailsText, dynamicStyles.detailsText]}>
                {formattedStorageUsed} GB of {formattedTotalStorage} GB
              </Text>

              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={storagePercentage / 100}
                  width={null}
                  height={scaleHeight(4)}
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
          <View style={styles.storageRow}>
            <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
              <Image
                source={require("../../../assets/Token.png")}
                style={styles.image}
              />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={[styles.storageHeader, dynamicStyles.storageHeader]}>AI Token Usage</Text>
              <Text style={[styles.detailsText, dynamicStyles.detailsText]}>
                {formattedAITokensUsed} of {formattedTotalAITokens}
              </Text>

              <View style={styles.progressBarContainer}>
                <Progress.Bar
                  progress={storagePercentage / 100}
                  width={null}
                  height={scaleHeight(4)}
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
  gradientBorder: {
    padding: scaleWidth(3),
    width: "90%",
    borderRadius: scaleWidth(16),
    backgroundColor: "transparent",
  },
  planBox: {
    borderRadius: scaleWidth(14),
    padding: scaleWidth(15),
    backgroundColor: "#FFFFFF",
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleHeight(10),
  },
  planText: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    color: "black",
    marginLeft: scaleFont(10),
  },
  gradientText: {
    fontSize: scaleFont(18),
    fontWeight: "700",
  },
  detailsText: {
    fontSize: scaleFont(14),
    color: "gray",
    marginBottom: scaleHeight(5),
  },
  blackText: {
    color: "black",
    fontWeight: "600",
  },
  renewalText: {
    fontSize: scaleFont(12),
    color: "black",
    fontWeight: "600",
    marginBottom: scaleHeight(10),
    backgroundColor: "#D9D9D959",
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(5),
    width: "60%",
    borderRadius: 5,
    marginTop: scaleHeight(10),
  },
  separator: {
    height: scaleHeight(1),
    backgroundColor: "#EFEFEF",
    marginVertical: scaleHeight(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: scaleFont(14),
    color: "#EA4335",
    fontWeight: "600",
  },
  changePlanContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: scaleFont(14),
    color: "#6F767E",
    fontWeight: "600",
    marginLeft: scaleWidth(5),
  },
  trialTextContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(5),
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: scaleWidth(10),
    paddingVertical: scaleHeight(5),
    borderRadius: 8,
    width: "80%"
  },
  trialText: {
    color: "black",
    fontSize: scaleFont(12),
    fontWeight: "700",
  },
  storageContainer: {
    marginTop: scaleHeight(20),
    width: "90%",
    borderWidth: scaleWidth(2),
    borderColor: "#EFEFEF",
    borderRadius: scaleWidth(15),
    paddingHorizontal: scaleWidth(15),
    paddingVertical: scaleHeight(15),
  },
  storageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: scaleWidth(60),
    height: scaleWidth(60),
    borderRadius: scaleWidth(30),
    backgroundColor: "#1A1D1F",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scaleWidth(1),
    marginRight: scaleWidth(10),
  },
  starimage: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    resizeMode: "contain",
  },
  image: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  detailsContainer: {
    flex: 1,
  },
  storageHeader: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: scaleHeight(10),
  },
  progressBarContainer: {
    marginTop: scaleHeight(10),
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
    color: "#6F767E",
  },
  blackText: {
    color: "white",
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
    backgroundColor: "#1A1D1F",
    borderColor: 'white'
  },
  storageHeader: {
    color: "white",
  },
};