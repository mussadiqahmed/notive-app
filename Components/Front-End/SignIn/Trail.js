import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Plans from "./Plans";
import { useDarkMode } from '../Settings/DarkModeContext';

// Responsive scaling functions
const scaleSize = (size, factor = 0.5) => {
  const { width, height } = Dimensions.get('window');
  const standardWidth = 375; // Standard iPhone width
  const standardHeight = 812; // Standard iPhone height
  const scaleWidth = size * (width / standardWidth);
  const scaleHeight = size * (height / standardHeight);
  return size + (scaleWidth - size) * factor;
};

const Trail = ({navigation}) => {
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedName, setSelectedName] = useState(null); 
  const { isDarkMode } = useDarkMode(); 
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  // Function to get date after 2 days
  const getFutureDate = (days) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.scrollContainer, dynamicStyles.scrollContainer]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.container, dynamicStyles.container]}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={isDarkMode ? require("../../../assets/LogoDark.png") : require("../../../assets/Logo.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.headerText, dynamicStyles.headerText]}>Start your free trial</Text>

        {/* Timeline with icons */}
        <View style={styles.timelineContainer}>
          {/* Gift icon section */}
          <View style={styles.timelineItem}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="gift" size={scaleSize(20)} color="white" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.headerTextSmall, dynamicStyles.headerTextSmall]}>
                Today - Free trial for 48 hours.
              </Text>
              <Text style={[styles.subText, dynamicStyles.subText]}>
                Start your free NotiveAI trial. Cancel Anytime.
              </Text>
            </View>
          </View>

          {/* Connecting vertical line */}
          <View style={styles.connectorLine}>
            <View style={[styles.verticalLine, { backgroundColor: "green" }]} />
            <View style={[styles.verticalLine, { backgroundColor: isDarkMode ? "#BFBFBF" : "#35475A33"}]} />
          </View>

          {/* Crown icon section */}
          <View style={styles.timelineItem}>
            <View style={[styles.iconCircleBottom, dynamicStyles.iconCircleBottom]}>
              <FontAwesome5 name="crown" size={scaleSize(20)} color="#E1A100" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.headerTextSmall, dynamicStyles.headerTextSmall]}>{getFutureDate(2)}</Text>
              <Text style={[styles.subText, dynamicStyles.subText]}>
                Your subscription starts, unless you've canceled during the trial.
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Choose Plan</Text>

        <Plans onSelectPrice={setSelectedPrice} onSelectName={setSelectedName} />
        
        <View style={styles.pricingContainer}>
          <View style={[styles.priceRow, dynamicStyles.priceRow]}>
            <Text style={[styles.priceLabel, dynamicStyles.priceLabel]}>Due {getFutureDate(2)}</Text>
            <Text style={[styles.priceValue, dynamicStyles.priceValue]}>
              {selectedPrice ? `$${selectedPrice}` : "$0"}
            </Text>
          </View>

          <View style={[styles.priceRow, dynamicStyles.priceRow]}>
            <View style={styles.todayPriceContainer}>
              <Text style={[styles.priceLabel, dynamicStyles.priceLabel]}>
                Due today <Text style={styles.freeText}>(48 hours free)</Text>
              </Text>
            </View>
            <Text style={[styles.priceValue, dynamicStyles.priceValue]}>$0</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.getStartedButton, dynamicStyles.getStartedButton]} 
          onPress={() => navigation.navigate("Thanks", { selectedPrice, selectedName })}
        >
          <Text style={styles.getStartedText}>Start your free trial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleSize(50),
  },
  logoContainer: {
    alignSelf: "flex-start",
    marginBottom: scaleSize(20),
  },
  logo: {
    width: scaleSize(170),
    height: scaleSize(60),
  },
  headerText: {
    fontSize: scaleSize(28),
    fontWeight: "bold",
    fontFamily: "inter",
    marginBottom: scaleSize(20),
  },
  timelineContainer: {
    marginBottom: scaleSize(30),
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconCircle: {
    backgroundColor: "green",
    width: scaleSize(44),
    height: scaleSize(44),
    borderRadius: scaleSize(22),
    justifyContent: "center",
    alignItems: "center",
    },
  iconCircleBottom: {
    backgroundColor: "white",
    width: scaleSize(44),
    height: scaleSize(44),
    borderRadius: scaleSize(22),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: scaleSize(2),
    borderColor: "#35475A33",
  },
  textContainer: {
    flex: 1,
    marginTop: scaleSize(1),
    marginLeft: scaleSize(10),
  },
  headerTextSmall: {
    fontSize: scaleSize(16),
    fontWeight: "bold",
    color: "#000",
    marginBottom: scaleSize(2),
  },
  subText: {
    fontSize: scaleSize(14),
    color: "#555",
    lineHeight: scaleSize(20),
  },
  connectorLine: {
    height: scaleSize(25),
    justifyContent: "center",
    paddingLeft: scaleSize(21), // Half of icon width + half of line width
  },
  verticalLine: {
    width: scaleSize(4),
    height: "100%",
    marginLeft: scaleSize(-1), // To center between the two lines
  },
  sectionTitle: {
    fontSize: scaleSize(20),
    fontWeight: "bold",
    fontFamily: "inter",
    color: "#33383F",
    marginVertical: scaleSize(5),
  },
  pricingContainer: {
    marginVertical: scaleSize(-10),
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: scaleSize(12),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: "#EDEDED",
  },
  priceLabel: {
    fontSize: scaleSize(14),
    color: "#6F767E",
    fontWeight: "600",
  },
  priceValue: {
    fontSize: scaleSize(14),
    fontWeight: "600",
    color: "#6F767E",
  },
  todayPriceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  freeText: {
    color: "#32AE60",
    fontSize: scaleSize(14),
    fontWeight: "bold",
  },
  getStartedButton: {
    backgroundColor: '#6D24FF',
    paddingVertical: scaleSize(14),
    borderRadius: scaleSize(50),
    marginTop: scaleSize(20),
    marginBottom: scaleSize(20),
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: scaleSize(16),
    fontWeight: '800',
    fontFamily: 'inter',
  },
});

const darkModeStyles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#111315",
  },
  container: {
    backgroundColor: "#111315",
  },
  headerText: {
    color: "white"
  },
  iconCircleBottom: {
    backgroundColor: "#111315",
    borderColor: "#BFBFBF",
  },
  headerTextSmall: {
    color: "white",
  },
  subText: {
    color: "#BFBFBF",
  },
  sectionTitle: {
    color: "white",
  },
  priceRow: {
    borderBottomColor: "#272B30",
  },
  priceLabel: {
    color: "white",
  },
  priceValue: {
    color: "white",
  },
  getStartedButton: {
    backgroundColor: '#6D24FF',
  },
});

export default Trail;