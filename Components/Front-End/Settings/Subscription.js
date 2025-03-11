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
import { useDarkMode } from "./DarkModeContext"; // Import the custom hook

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];
const plans = ["Lite", "Standard", "Pro"];
const planDetails = {
  Lite: { price: "$17/mo", tokens: "100,000", storage: "10 GB" },
  Standard: { price: "$47/mo", tokens: "500,000", storage: "100 GB" },
  Pro: { price: "$97/mo", tokens: "Unlimited", storage: "Unlimited" },
};

const Subscription = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const starImage = require("../../../assets/2Star.png");
  const selectedStarImage = require("../../../assets/2GradientStar.png");
  const { isDarkMode } = useDarkMode(); // Access dark mode state

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
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate("Navbar")}>
          <Icon
            name="arrow-left"
            size={width * 0.07}
            color={isDarkMode ? "white" : "black"}
          />
        </TouchableOpacity>
        <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
      </View>

      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>
          Choose a Subscription Plan
        </Text>

        {/* Scrollable plans section */}
        <ScrollView
          style={styles.scrollContainer}
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
                            style={{ flexDirection: "row" }}
                            maskElement={
                              <Icon name="crown" size={24} color="white" />
                            }
                          >
                            <LinearGradient
                              colors={gradientColors}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Text style={{ fontSize: 24, opacity: 0 }}>
                                👑
                              </Text>
                            </LinearGradient>
                          </MaskedView>
                        ) : (
                          <Image
                            source={selectedStarImage}
                            style={styles.starImage}
                          />
                        )}
                        <Text
                          style={[
                            styles.planTitleBlack,
                            dynamicStyles.planTitleBlack,
                          ]}
                        >
                          {plan}{" "}
                        </Text>
                        <MaskedView
                          style={{ flexDirection: "row" }}
                          maskElement={
                            <Text
                              style={[
                                styles.planTitleMoney,
                                { color: "black" },
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
                              style={[styles.planTitleMoney, { opacity: 0 }]}
                            >
                              {planDetails[plan].price}
                            </Text>
                          </LinearGradient>
                        </MaskedView>
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
                  <View style={[styles.planContainer, styles.borderStyle]}>
                    <View style={styles.titleContainer}>
                      {plan === "Pro" ? (
                        <Icon name="crown" size={24} color="#6F767E" />
                      ) : (
                        <Image source={starImage} style={styles.starImage} />
                      )}
                      <Text style={styles.planTitleBlack}>{plan} </Text>
                      <Text style={styles.planTitleMoney}>
                        {planDetails[plan].price}
                      </Text>
                    </View>
                    <Text style={styles.planDetails}>
                      Tokens:{" "}
                      <Text style={styles.planTitleBlack}>
                        {planDetails[plan].tokens}
                      </Text>
                      {plan === "Pro"
                        ? " (Unlimited AI talk time)"
                        : " (~3 hours of AI talk time)"}
                    </Text>
                    <Text style={styles.planDetails}>
                      Storage:{" "}
                      <Text style={styles.planTitleBlack}>
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

/** ✅ Styles */
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
  text: {
    fontSize: width * 0.055,
    fontWeight: "700",
    color: "black",
    marginLeft: width * 0.03,
  },
  rectangle_body: {
    flex: 1,
    width: width * 0.9,
    paddingVertical: height * 0.03,
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
    marginTop: height * 0.015,
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
  },
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.02,
  },
  borderStyle: {
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 15,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    width: width * 0.8,
    backgroundColor: "#FFF",
    alignSelf: "center",
  },
  gradientBorder: {
    borderRadius: 15,
    padding: 2,
    width: width * 0.81,
    alignSelf: "center",
    marginBottom: height * 0.02,
  },
  innerContainer: {
    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: 15,
    width: width * 0.8,
  },
  planContainer: { alignItems: "flex-start" },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  starImage: { width: 24, height: 24, marginRight: width * 0.03 },
  planTitleBlack: {
    fontSize: width * 0.04,
    fontWeight: "700",
    color: "black",
  },
  planTitleMoney: { fontSize: width * 0.04, fontWeight: "700" },
  subscribeButton: {
    backgroundColor: "#A895FE",
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#EFEFEF",
  },
  downgradeButton: {
    backgroundColor: "#FCFCFC",
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#EFEFEF",
  },
  subscribedButton: {
    backgroundColor: "#E6E5E5",
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: { color: "black", fontWeight: "700", fontSize: 16 },
  subscribedText: { color: "#737E86", fontWeight: "700", fontSize: 16 },
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

  innerContainer: {
    backgroundColor: "#101010",
  },
  planDetails: {
    color: "#6F767EC4",
  },
  planTitleBlack: {
    color: "white",
  },
};
