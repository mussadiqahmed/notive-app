import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
} from "react-native";
import SettingsDropdown from "./Settings_Dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { useDarkMode } from "./DarkModeContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];
const plans = ["Lite", "Standard", "Pro"];
const planDetails = {
  Lite: { price: "$17/mo", tokens: "100,000", storage: "10 GB" },
  Standard: { price: "$47/mo", tokens: "500,000", storage: "100 GB" },
  Pro: { price: "$97/mo", tokens: "Unlimited", storage: "Unlimited" },
};

const Subscription = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const starImage = require("../../../assets/2Star.png");
  const selectedStarImage = require("../../../assets/2GradientStar.png");
  const { isDarkMode } = useDarkMode();

  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const getButtonLabel = (plan) => {
    if (!selectedPlan) return "Subscribe";

    const selectedIndex = plans.indexOf(selectedPlan);
    const currentIndex = plans.indexOf(plan);

    if (currentIndex > selectedIndex) return `Upgrade to ${plan}`;
    if (currentIndex < selectedIndex) return `Downgrade to ${plan}`;

    return "Subscribed";
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate("Navbar")}>
          <Icon
            name="arrow-left"
            size={scaleFont(24)}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
      </View>

      {/* Main Content */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>
          Choose a Subscription Plan
        </Text>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan;
            const buttonLabel = getButtonLabel(plan);
            const isDowngrade = buttonLabel.includes("Downgrade");

            return (
              <TouchableOpacity
                key={plan}
                onPress={() => setSelectedPlan(plan)}
                activeOpacity={0.8}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={gradientColors}
                    style={styles.gradientBorder}
                  >
                    <View
                      style={[
                        styles.planContainer,
                        styles.innerContainer,
                        dynamicStyles.innerContainer,
                      ]}
                    >
                      <View style={styles.titleContainer}>
                        {plan === "Pro" ? (
                          <MaskedView
                            style={{ flexDirection: "row", height: scaleFont(24) }}
                            maskElement={
                              <Icon name="crown" size={scaleFont(24)} color="white" />
                            }
                          >
                            <LinearGradient
                              colors={gradientColors}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Text style={{ fontSize: scaleFont(24), opacity: 0 }}>
                                👑
                              </Text>
                            </LinearGradient>
                          </MaskedView>
                        ) : (
                          <Image
                            source={selectedStarImage}
                            style={[styles.starImage, { height: scaleFont(24), width: scaleFont(24) }]}
                          />
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text
                            style={[
                              styles.planTitleBlack,
                              dynamicStyles.planTitleBlack,
                              { lineHeight: scaleFont(24) }
                            ]}
                          >
                            {plan}{" "}
                          </Text>
                          <MaskedView
                            style={{ flexDirection: "row", height: scaleFont(24) }}
                            maskElement={
                              <Text
                                style={[
                                  styles.planTitleMoney,
                                  { color: "black", lineHeight: scaleFont(24) }
                                ]}
                              >
                                {planDetails[plan].price}
                              </Text>
                            }
                          >
                            <LinearGradient
                              colors={gradientColors}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Text
                                style={[styles.planTitleMoney, { opacity: 0, lineHeight: scaleFont(24) }]}
                              >
                                {planDetails[plan].price}
                              </Text>
                            </LinearGradient>
                          </MaskedView>
                        </View>
                      </View>
                      <Text
                        style={[styles.planDetails, dynamicStyles.planDetails]}
                      >
                        Tokens:{" "}
                        <Text
                          style={[
                            styles.planTitleBlack,
                            dynamicStyles.planTitleBlack,
                          ]}
                        >
                          {planDetails[plan].tokens}
                        </Text>
                        {plan === "Pro"
                          ? " (Unlimited AI talk time)"
                          : " (~3 hours of AI talk time)"}
                      </Text>
                      <Text
                        style={[styles.planDetails, dynamicStyles.planDetails]}
                      >
                        Storage:{" "}
                        <Text
                          style={[
                            styles.planTitleBlack,
                            dynamicStyles.planTitleBlack,
                          ]}
                        >
                          {planDetails[plan].storage}
                        </Text>
                      </Text>

                      <TouchableOpacity style={styles.subscribedButton}>
                        <Text style={styles.subscribedText}>Subscribed</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[styles.planContainer, styles.borderStyle, dynamicStyles.borderStyle]}>
                    <View style={styles.titleContainer}>
                      {plan === "Pro" ? (
                        <Icon name="crown" size={scaleFont(24)} color="#6F767E" />
                      ) : (
                        <Image source={starImage} style={styles.starImage} />
                      )}
                      <Text style={[styles.planTitleBlack, dynamicStyles.planTitleBlack]}>{plan} </Text>
                      <Text style={[styles.planTitleMoney, dynamicStyles.planTitleMoney]}>
                        {planDetails[plan].price}
                      </Text>
                    </View>
                    <Text style={[styles.planDetails, dynamicStyles.planDetails]}>
                      Tokens:{" "}
                      <Text style={[styles.planTitleBlack, dynamicStyles.planTitleBlack]}>
                        {planDetails[plan].tokens}
                      </Text>
                      {plan === "Pro"
                        ? " (Unlimited AI talk time)"
                        : " (~3 hours of AI talk time)"}
                    </Text>
                    <Text style={[styles.planDetails, dynamicStyles.planDetails]}>
                      Storage:{" "}
                      <Text style={[styles.planTitleBlack, dynamicStyles.planTitleBlack]}>
                        {planDetails[plan].storage}
                      </Text>
                    </Text>

                    <TouchableOpacity
                      style={
                        isDowngrade
                          ? styles.downgradeButton
                          : styles.subscribeButton
                      }
                      onPress={() => setSelectedPlan(plan)}
                    >
                      <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Subscription;

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
  text: {
    fontSize: scaleFont(20),
    fontWeight: "700",
    color: "black",
    marginLeft: scaleFont(15),
  },
  rectangle_body: {
    width: "90%",
    paddingVertical: scaleHeight(20),
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: scaleHeight(15),
    alignSelf: "center",
    alignItems: 'center',
    maxHeight: "85%",
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: scaleHeight(10),
    paddingHorizontal: scaleWidth(15),
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(20),
    fontWeight: "700",
    color: "black",
    marginBottom: scaleHeight(10),
  },
  borderStyle: {
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 15,
    padding: scaleWidth(15),
    marginBottom: scaleHeight(10),
    width: "100%",
    backgroundColor: "#FFF",
    alignSelf: "center",
  },
  gradientBorder: {
    borderRadius: 15,
    padding: scaleWidth(2),
    width: "100%",
    alignSelf: "center",
    marginBottom: scaleHeight(10),
  },
  innerContainer: {
    backgroundColor: "#FFF",
    padding: scaleWidth(15),
    borderRadius: 15,
    width: "100%",
  },
  planContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starImage: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    marginRight: scaleWidth(10),
  },
  planTitleBlack: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    color: "black",
  },
  planTitleMoney: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    color: "black",
  },
  planDetails: {
    fontSize: scaleFont(14),
    color: "#6F767E",
    marginBottom: scaleHeight(5),
  },
  subscribeButton: {
    backgroundColor: "#A895FE",
    paddingVertical: scaleHeight(10),
    borderRadius: 50,
    marginTop: scaleHeight(10),
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#EFEFEF",
  },
  downgradeButton: {
    backgroundColor: "#FCFCFC",
    paddingVertical: scaleHeight(10),
    borderRadius: 50,
    marginTop: scaleHeight(10),
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#EFEFEF",
  },
  subscribedButton: {
    backgroundColor: "#E6E5E5",
    paddingVertical: scaleHeight(10),
    borderRadius: 50,
    marginTop: scaleHeight(10),
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: scaleFont(16)
  },
  subscribedText: {
    color: "#737E86",
    fontWeight: "700",
    fontSize: scaleFont(16)
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
  innerContainer: {
    backgroundColor: "#1A1D1F",
  },
  borderStyle: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30",
  },
  planDetails: {
    color: "#6F767EC4",
  },
  planTitleBlack: {
    color: "white",
  },
  planTitleMoney: {
    color: "white",
  },
  buttonText: {
    color: "white",
  },
  subscribedText: {
    color: "#6F767E",
  },
  downgradeButton: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30",
  },
};