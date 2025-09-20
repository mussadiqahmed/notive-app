import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { FontAwesome5 } from "@expo/vector-icons";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import { useDarkMode } from "../Settings/DarkModeContext";

// Responsive scaling functions
const scaleSize = (size, factor = 0.5) => {
  const { width, height } = Dimensions.get('window');
  const standardWidth = 375; // Standard iPhone width
  const standardHeight = 812; // Standard iPhone height
  const scaleWidth = size * (width / standardWidth);
  const scaleHeight = size * (height / standardHeight);
  return size + (scaleWidth - size) * factor;
};

const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const PricingPlans = ({ onSelectPrice, onSelectName }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  
  const plans = [
    {
      name: "Lite",
      price: "$17/mo",
      tokens: "100,000",
      storage: "10 GB",
      unselectedImage: require("../../../assets/2Star.png"),
      selectedImage: require("../../../assets/2GradientStar.png"),
    },
    {
      name: "Standard",
      price: "$47/mo",
      tokens: "500,000",
      storage: "100 GB",
      unselectedImage: require("../../../assets/2Star.png"),
      selectedImage: require("../../../assets/2GradientStar.png"),
    },
    {
      name: "Pro",
      price: "$97/mo",
      tokens: "Unlimited",
      storage: "Unlimited",
      unselectedImage: null,
      selectedImage: null,
    },
  ];

  const handleSelectPlan = (index) => {
    const plan = plans[index];
    setSelectedPlan(index);
    const priceNumber = parseInt(plan.price.replace(/[^0-9]/g, ""), 10);
    onSelectPrice(priceNumber);
    onSelectName(plan.name);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {plans.map((plan, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => handleSelectPlan(index)}
          style={styles.planContainer}
        >
          {selectedPlan === index ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardBorder}
            >
              <View style={[styles.card, styles.selectedCard, dynamicStyles.card]}>
                <View style={styles.header}>
                  {plan.name === "Pro" ? (
                    <MaskedView
                      maskElement={
                        <FontAwesome5 name="crown" size={scaleSize(20)} color="black" />
                      }
                    >
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ width: scaleSize(25), height: scaleSize(24) }}
                      />
                    </MaskedView>
                  ) : (
                    <Image 
                      source={plan.selectedImage} 
                      style={[styles.image, { width: scaleSize(24), height: scaleSize(24) }]} 
                    />
                  )}
                  <Text style={[styles.title, dynamicStyles.title]}>
                    {plan.name}
                  </Text>

                  <MaskedView
                    maskElement={<Text style={styles.price}>{plan.price}</Text>}
                  >
                    <LinearGradient
                      colors={gradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={[styles.price, { opacity: 0 }]}>
                        {plan.price}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </View>
                <Text style={styles.details}>
                  Tokens:{" "}
                  <Text style={[styles.value, dynamicStyles.value]}>
                    {plan.tokens}
                  </Text>{" "}
                  | Storage:{" "}
                  <Text style={[styles.value, dynamicStyles.value]}>
                    {plan.storage}
                  </Text>
                </Text>

                <View style={styles.circle}>
                  <Svg height={scaleSize(34)} width={scaleSize(34)}>
                    <Defs>
                      <SvgGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#6340FF" stopOpacity="1" />
                        <Stop offset="50%" stopColor="#FF40C6" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#FF8040" stopOpacity="1" />
                      </SvgGradient>
                    </Defs>
                    <Circle
                      cx={scaleSize(18)}
                      cy={scaleSize(18)}
                      r={scaleSize(14)}
                      stroke="url(#grad)"
                      strokeWidth={scaleSize(3)}
                      fill="transparent"
                    />
                  </Svg>
                </View>
              </View>
            </LinearGradient>
          ) : (
            <View style={[styles.card, styles.unselectedCard, dynamicStyles.unselectedCard]}>
              <View style={styles.header}>
                {plan.name === "Pro" ? (
                  <FontAwesome5 name="crown" size={scaleSize(20)} color="#AAAAAA" />
                ) : (
                  <Image 
                    source={plan.unselectedImage} 
                    style={[styles.image, { width: scaleSize(24), height: scaleSize(24) }]} 
                  />
                )}
                <Text style={[styles.title, dynamicStyles.title]}>
                  {plan.name}
                </Text>
                <Text style={[styles.price, dynamicStyles.price]}>
                  {plan.price}
                </Text>
              </View>
              <Text style={styles.details}>
                Tokens:{" "}
                <Text style={[styles.value, dynamicStyles.value]}>
                  {plan.tokens}
                </Text>{" "}
                | Storage:{" "}
                <Text style={[styles.value, dynamicStyles.value]}>
                  {plan.storage}
                </Text>
              </Text>

              <View style={styles.circle}>
                <FontAwesome5 name="circle" size={scaleSize(30)} color="#EDEDED" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleSize(10),
    backgroundColor: "#FCFCFC",
  },
  planContainer: {
    width: '100%',
    marginBottom: scaleSize(10),
  },
  cardBorder: {
    borderRadius: scaleSize(12),
    padding: scaleSize(2.5),
  },
  card: {
    borderRadius: scaleSize(10),
    padding: scaleSize(20),
    width: '100%',
    backgroundColor: "#FFFFFF",
    position: "relative",
    borderColor: "#EDEDED",
    borderWidth: scaleSize(1),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: scaleSize(5),
    marginBottom: scaleSize(2),
  },
  image: {
    resizeMode: "contain",
  },
  title: {
    fontSize: scaleSize(16),
    fontWeight: "bold",
    marginRight: scaleSize(5),
    paddingLeft: scaleSize(5),
  },
  unselectedCard: {
    borderColor: "#EDEDED",
  },
  price: {
    fontSize: scaleSize(16),
    fontWeight: "bold",
    color: "#AAAAAA",
  },
  details: {
    fontSize: scaleSize(13),
    color: "#6F767E",
    fontWeight: "bold",
  },
  value: {
    fontWeight: "bold",
    color: "#000",
  },
  circle: {
    position: "absolute",
    right: scaleSize(20),
    top: '50%',
    transform: [{ translateY: -scaleSize(0) }],
    width: scaleSize(35),
    height: scaleSize(35),
    borderRadius: scaleSize(35) / 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#111315",
  },
  card: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30",
  },
  title: {
    color: "white",
  },
  value: {
    color: "white",
  },
  unselectedCard: {
    backgroundColor: "#111315",
    borderColor: "#272B30",
  },
  price: {
    color: "#AAAAAA",
  },
});

export default PricingPlans;