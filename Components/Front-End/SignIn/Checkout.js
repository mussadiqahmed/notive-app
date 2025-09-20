import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useDarkMode } from '../Settings/DarkModeContext';
import { RadioButton } from "react-native-paper";

// Responsive scaling functions
const scaleSize = (size, factor = 0.5) => {
  const { width, height } = Dimensions.get('window');
  const standardWidth = 375; // Standard iPhone width
  const standardHeight = 812; // Standard iPhone height
  const scaleWidth = size * (width / standardWidth);
  const scaleHeight = size * (height / standardHeight);
  return size + (scaleWidth - size) * factor;
};

const Checkout = ({ navigation }) => {
  const route = useRoute();
  const selectedPrice = route.params?.selectedPrice || 0;
  const selectedName = route.params?.selectedName || " ";
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, "");
    if (formattedText.length > 4) {
      formattedText = formattedText.slice(0, 4);
    }
    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}`;
    }
    setExpiryDate(formattedText);
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, dynamicStyles.headerText]}>Start your free trial</Text>
        <Text style={[styles.selectedPrice, dynamicStyles.selectedPrice]}>
          {selectedPrice ? `$${selectedPrice}` : "$0"}{" "}
          <Text style={[styles.selectedName,dynamicStyles.selectedName]}>
            {selectedName ? `Notive AI ${selectedName}` : "Notive AI"}
          </Text>
        </Text>
      </View>

      <View style={[styles.paymentContainer, dynamicStyles.paymentContainer]}>
        <View style={[styles.billingDetailsContainer, dynamicStyles.billingDetailsContainer]}>
          <Text style={[styles.label, dynamicStyles.label]}>Billing Email</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={scaleSize(20)}
              color={isDarkMode ? "#BFBFBF" : "#6C727580"}
              style={styles.icon}
            />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={isDarkMode ? "#BFBFBF" : "#6C727580"}
              style={[styles.input, dynamicStyles.input]}
              keyboardType="email-address"
            />
          </View>

          <Text style={[styles.label, dynamicStyles.label]}>Card Details</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="credit-card"
              size={scaleSize(20)}
              color={isDarkMode ? "#BFBFBF" : "#6C727580"}
              style={styles.icon}
            />
            <TextInput
              placeholder="Card Number"
              placeholderTextColor={isDarkMode ? "#BFBFBF" : "#6C727580"}
              style={[styles.input, dynamicStyles.input]}
              keyboardType="numeric"
              maxLength={16}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.smallInputContainer}>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor={isDarkMode ? "#BFBFBF" : "#6C727580"}
                style={[styles.smallInput, dynamicStyles.smallInput]}
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                maxLength={5}
              />
            </View>
            <View style={styles.smallInputContainer}>
              <TextInput
                placeholder="CVV"
                placeholderTextColor={isDarkMode ? "#BFBFBF" : "#6C727580"}
                style={[styles.smallInput, dynamicStyles.smallInput]}
                keyboardType="numeric"
                secureTextEntry
                maxLength={3}
              />
            </View>
          </View>
        </View>

        <View style={[styles.paymentOptionContainer, dynamicStyles.paymentOptionContainer]}>
          <RadioButton.Android
            value="apple"
            status={selectedPayment === "apple" ? "checked" : "unchecked"}
            onPress={() => setSelectedPayment("apple")}
            color="#4285F4"
          />
          <Text style={[styles.paymentText, dynamicStyles.paymentText]}>Apple Pay</Text>
          <TouchableOpacity style={[styles.payButton, dynamicStyles.payButton]}>
            <Image
              source={isDarkMode ? require("../../../assets/lightapple.png") : require("../../../assets/apple.png")}
              style={styles.buttonImage}
            />
            <Text style={[styles.payButtonText, dynamicStyles.payButtonText]}>Pay</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.paymentOptionContainer, dynamicStyles.paymentOptionContainer]}>
          <RadioButton.Android
            value="google"
            status={selectedPayment === "google" ? "checked" : "unchecked"}
            onPress={() => setSelectedPayment("google")}
            color="#4285F4"
          />
          <Text style={[styles.paymentText, dynamicStyles.paymentText]}>Google Pay</Text>
          <TouchableOpacity style={[styles.payButton, dynamicStyles.payButton]}>
            <Image
              source={require("../../../assets/google.png")}
              style={styles.buttonImage}
            />
            <Text style={[styles.payButtonText, dynamicStyles.payButtonText]}>Pay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.billingDetails}>
          <Text style={[styles.totalbill, dynamicStyles.totalbill]}>Billed now: $0</Text>
          <Text style={[styles.billingText, dynamicStyles.billingText]}>
            {selectedPrice ? `$${selectedPrice}` : "$0"} after 2 days, unless canceled
          </Text>
          <Text style={[styles.termsText, dynamicStyles.termsText]}>
            By clicking "Start Now", you agree to be charged {selectedPrice ? `$${selectedPrice}` : "$0"} every month, unless you cancel.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.startButton, dynamicStyles.startButton]}
          onPress={() => navigation.navigate("Thanks")}
        >
          <Text style={styles.startText}>Start Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: scaleSize(15),
  },
  headerContainer: {
    paddingVertical: scaleSize(60),
    alignItems: "flex-start",
    width: "100%",
  },
  headerText: {
    fontSize: scaleSize(24),
    fontWeight: "bold",
    color: "#333",
    marginBottom: scaleSize(10),
  },
  selectedPrice: {
    color: "#141718",
    fontSize: scaleSize(18),
    fontWeight: "bold",
  },
  selectedName: {
    color: "#6C7275",
    fontSize: scaleSize(18),
    fontWeight: "bold",
  },
  paymentContainer: {
    backgroundColor: "#FFFFFF",
    padding: scaleSize(5),
    borderRadius: scaleSize(10),
    shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: scaleSize(5),
    // elevation: 3,
    width: "100%",
    alignSelf: "center",
    marginBottom: scaleSize(20),
  },
  label: {
    fontSize: scaleSize(14),
    fontWeight: "bold",
    color: "#333",
    marginBottom: scaleSize(5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: scaleSize(1),
    borderColor: "#E8ECEF",
    borderRadius: scaleSize(8),
    paddingHorizontal: scaleSize(10),
    height: scaleSize(45),
    marginBottom: scaleSize(15),
  },
  billingDetailsContainer: {
    borderWidth: scaleSize(1),
    borderColor: "#E8ECEF",
    borderRadius: scaleSize(10),
    padding: scaleSize(15),
    marginBottom: scaleSize(15),
  },
  icon: {
    marginRight: scaleSize(10),
  },
  input: {
    flex: 1,
    fontSize: scaleSize(14),
    fontWeight: "bold",
    color: "#6C7275",
    height: scaleSize(40),
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallInputContainer: {
    borderWidth: scaleSize(1),
    borderColor: "#E8ECEF",
    borderRadius: scaleSize(8),
    height: scaleSize(45),
    flex: 0.48,
    justifyContent: "center",
    paddingHorizontal: scaleSize(10),
  },
  smallInput: {
    fontSize: scaleSize(14),
    color: "#6C7275",
    fontWeight: "bold",
    height: scaleSize(40),
  },
  paymentOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: scaleSize(1),
    borderColor: "#EDEDED",
    borderRadius: scaleSize(10),
    padding: scaleSize(10),
    marginBottom: scaleSize(10),
    width: "100%",
  },
  paymentText: {
    fontSize: scaleSize(16),
    fontWeight: "bold",
    flex: 1,
    marginLeft: scaleSize(10),
  },
  buttonImage: {
    width: scaleSize(20),
    height: scaleSize(20),
    resizeMode: "contain",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scaleSize(10),
    paddingVertical: scaleSize(8),
    borderRadius: scaleSize(8),
    borderWidth: scaleSize(1),
    borderColor: "#EDEDED",
  },
  payButtonText: {
    color: "Black",
    fontSize: scaleSize(14),
    fontWeight: "bold",
    marginLeft: scaleSize(5),
  },
  billingDetails: {
    marginTop: scaleSize(15),
  },
  totalbill: {
    fontSize: scaleSize(18),
    fontWeight: "bold",
    color: "black",
    marginBottom: scaleSize(5),
  },
  billingText: {
    fontSize: scaleSize(14),
    fontWeight: "bold",
    color: "#6F767E",
    marginBottom: scaleSize(10),
  },
  termsText: {
    fontSize: scaleSize(12),
    color: "#ACAEAE",
    lineHeight: scaleSize(18),
  },
  startButton: {
    backgroundColor: "#6D24FF",
    paddingVertical: scaleSize(15),
    borderRadius: scaleSize(50),
    marginTop: scaleSize(25),
    alignItems: "center",
  },
  startText: {
    color: "#fff",
    fontSize: scaleSize(16),
    fontWeight: "700",
    fontFamily: "inter",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#111315",
  },
  headerText: {
    color: "white",
  },
  selectedPrice: {
    color: "white",
  },
  selectedName: {
    color: "white",
  },
  paymentContainer: {
    backgroundColor: "#1A1D1F",
    shadowColor: "#000",
  },
  label: {
    color: "white",
  },
  billingDetailsContainer: {
    borderColor: "#272B30",
  },
  input: {
    color: "#BFBFBF",
  },
  smallInput: {
    color: "#BFBFBF",
  },
  paymentOptionContainer: {
    borderColor: "#272B30",
  },
  paymentText: {
    color: "white",
  },
  payButton: {
    borderColor: "#272B30",
  },
  payButtonText: {
    color: "white",
  },
  totalbill: {
    color: "white",
  },
  billingText: {
    color: "#6F767E",
  },
  termsText: {
    color: "#ACAEAE",
  },
  startButton: {
    backgroundColor: "#6D24FF",
  },
});

export default Checkout;