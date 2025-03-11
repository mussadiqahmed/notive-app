import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from './DarkModeContext'; // Import the custom hook

const { width, height } = Dimensions.get("window");

const Add_Billing = ({navigation}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [savedCard, setSavedCard] = useState(null);
  const { isDarkMode } = useDarkMode(); // Access dark mode state

const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  const handleConfirm = () => {
    setSavedCard({ name, cardNumber, expiryDate, cvv });
    setShowForm(false);
    setName("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  // Handle expiry date formatting (MM/YY)
  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}`;
    }

    setExpiryDate(formattedText);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}
            onPress={() => navigation.navigate("Navbar")}>
              <Icon name="arrow-left" size={width * 0.07}  color={isDarkMode ? "white" : "black"}/>
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Settings</Text>
        </View>
      </View>

      {/* Settings Dropdown */}
      <View style={[styles.rectangle_body, dynamicStyles.rectangle_body]}>
        <SettingsDropdown />
        <Text style={[styles.label_Pass, dynamicStyles.label_Pass]}>Billing</Text>
        <Text style={[styles.label, dynamicStyles.label]}>Payment Method</Text>

        {savedCard && (
  <View style={[styles.cardInfo, dynamicStyles.cardInfo]}>
    <Text style={[styles.cardText, dynamicStyles.cardText]}>Name: {savedCard.name}</Text>
    <Text style={[styles.cardText, dynamicStyles.cardText]}>Card Number: **** **** **** {savedCard.cardNumber.slice(-4)}</Text>
    <Text style={[styles.cardText, dynamicStyles.cardText]}>Expiry Date: {savedCard.expiryDate}</Text>

    {/* Remove Card Button */}
    <TouchableOpacity style={[styles.removeButton, dynamicStyles.removeButton]} onPress={() => setSavedCard(null)}>
      <Text style={[styles.removeText, dynamicStyles.removeText]}>Remove</Text>
    </TouchableOpacity>
  </View>
)}


        {showForm ? (
          <View style={styles.formContainer}>
            {/* Icons Row */}
            <View style={styles.iconRow}>
              <Image source={require("../../../assets/paypal.png")} style={styles.icon} />
              <Image source={require("../../../assets/mastercard.png")} style={styles.icon} />
              <Image source={require("../../../assets/americanX.png")} style={styles.icon} />
            </View>

            {/* Name Field */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Icon name="account" size={20} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]}/>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Cardholder Name"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Card Number Field */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Icon name="credit-card-outline" size={20} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]} />
              <TextInput
                style={[styles.input, dynamicStyles.in]}
                placeholder="Card Number"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            {/* Expiry Date Field */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Icon name="calendar" size={20} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]} />
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="Expiry Date (MM/YY)"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
                keyboardType="numeric"
                value={expiryDate}
                onChangeText={handleExpiryDateChange}
                maxLength={5}
              />
            </View>

            {/* CVV Field */}
            <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
              <Icon name="lock-outline" size={20}style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]}/>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                placeholder="CVV"
                placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
                keyboardType="numeric"
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
            <Text style={styles.addText}>+ Add New Credit Card</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Add_Billing;

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
    height: height * 0.83,
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
  label: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    marginBottom: height * 0.02,
    marginTop: height * 0.01,
  },
  addButton: {
    marginTop: height * 0.02,
    marginLeft: height * 0.02,
    alignSelf: "flex-start", // Aligns button to the start (left)
  },
  
  addText: {
    fontSize: width * 0.045,
    color: "#8246FB",
    fontWeight: "600",
    fontFamily:"inter tight"
  },
  formContainer: {
    width: "90%",
    marginTop: height * 0.02,
    alignItems: "center",
   
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "flex-start", // Align with input fields
    marginLeft: 10, // Adjusted to match input fields' start position
    marginBottom: height * 0.02,
  },
  icon: {
    width: width * 0.10,
    height: height * 0.06,
    marginRight: width * 0.05,
    resizeMode: "contain",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: height * 0.015,
    width: "100%",
  },
  inputIcon: {
    marginLeft: 10, // Ensures the icon starts aligned with the input
    marginRight: 10,
  },

  input: {
    flex: 1,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: "#8246FB",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    borderRadius: 50,
    alignItems: "center",
    width: "90%"
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontFamily: 'inter',
    fontSize: width * 0.06,
  },
  cardInfo: {
    alignSelf: "flex-start",
    marginLeft: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: "#DFE1E6",
    borderRadius: 15,
    width: "90%",
    padding: height * 0.015, // Adjust padding to create space inside the border
  },
  
  cardText: {
    fontSize: width * 0.040,
    color: "#666D80",
    fontWeight: "600",
    marginTop: height * 0.01
  },
  removeButton: {
    marginTop: height * 0.02,
    backgroundColor: "#FFFFFF",
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
    borderWidth: 1,
    borderColor:"#DFE1E6"
  },
  removeText: {
    color: "black",
    fontWeight: "600",
    textAlign: "center",
  },
  iconColor:{
    color: '#B0B2B5'
  }
  
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
  inputContainer: {
    borderColor: "#222628",
    backgroundColor: "#222628",
  },
  input: {
    color: "#B0B2B5",
  },
  confirmButton: {
    backgroundColor: "white",
  },
  confirmText: {
    color: "black",
  },
  iconColor:{
    color: '#B0B2B5'
  },

  cardInfo: {
    borderColor: "#272B30",
    backgroundColor: '#1A1D1F',

  },
  
  cardText: {
    color: "white",
  },
  removeButton: {
    backgroundColor: "#1A1D1F",
    borderColor:"#24272E"
  },
  removeText: {
    color: "white",
  },
  
};