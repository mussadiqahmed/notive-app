import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
  ScrollView,
  Keyboard
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from './DarkModeContext';

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Add_Billing = ({navigation}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [savedCard, setSavedCard] = useState(null);
  const { isDarkMode } = useDarkMode();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleConfirm = () => {
    setSavedCard({ name, cardNumber, expiryDate, cvv });
    setShowForm(false);
    setName("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    Keyboard.dismiss();
  };

  const handleExpiryDateChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, "");

    if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}`;
    }

    setExpiryDate(formattedText);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.rectangle, dynamicStyles.rectangle]}>
          <View style={styles.leftContainer}>
            <TouchableOpacity style={styles.backButton}
              onPress={() => navigation.navigate("Navbar")}>
                <Icon name="arrow-left" size={scaleFont(24)} color={isDarkMode ? "white" : "black"}/>
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
                <Icon name="account" size={scaleFont(20)} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]}/>
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
                <Icon name="credit-card-outline" size={scaleFont(20)} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]} />
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  placeholder="Card Number"
                  placeholderTextColor={isDarkMode ? "#A0A0A0" : "#B0B2B5"}
                  keyboardType="numeric"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>

              {/* Expiry Date Field */}
              <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
                <Icon name="calendar" size={scaleFont(20)} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]} />
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
                <Icon name="lock-outline" size={scaleFont(20)} style={[styles.inputIcon, styles.iconColor, dynamicStyles.iconColor]}/>
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

          {/* Only show bottom padding when keyboard is visible */}
          {keyboardVisible && <View style={{ height: scaleHeight(170) }} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default Add_Billing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollView: {
    alignItems: "center",
    paddingTop: scaleHeight(40),
    flexGrow: 1,
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
    minHeight: "80%",
    backgroundColor: "#FCFCFC",
    marginTop: scaleHeight(15),
    alignSelf: "center",
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
  label: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(16),
    fontWeight: "700",
    color: "black",
    marginBottom: scaleHeight(10),
    marginTop: scaleHeight(5),
  },
  addButton: {
    marginTop: scaleHeight(10),
    marginLeft: scaleFont(20),
    alignSelf: "flex-start",
  },
  addText: {
    fontSize: scaleFont(16),
    color: "#8246FB",
    fontWeight: "600",
    fontFamily: "inter tight"
  },
  formContainer: {
    width: "90%",
    marginTop: scaleHeight(10),
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginLeft: scaleFont(10),
    marginBottom: scaleHeight(20),
  },
  icon: {
    width: scaleWidth(40),
    height: scaleHeight(40),
    marginRight: scaleWidth(15),
    resizeMode: "contain",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    paddingHorizontal: scaleFont(10),
    marginBottom: scaleHeight(10),
    width: "100%",
    height: scaleHeight(50),
  },
  inputIcon: {
    marginLeft: scaleFont(10),
    marginRight: scaleFont(10),
  },
  input: {
    flex: 1,
    padding: scaleFont(10),
    fontSize: scaleFont(16),
  },
  confirmButton: {
    backgroundColor: "#8246FB",
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleFont(40),
    borderRadius: 50,
    alignItems: "center",
    width: "100%",
    marginTop: scaleHeight(10),
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontFamily: 'inter',
    fontSize: scaleFont(18),
  },
  cardInfo: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: "#DFE1E6",
    borderRadius: 15,
    width: "90%",
    padding: scaleHeight(15),
  },
  cardText: {
    fontSize: scaleFont(14),
    color: "#666D80",
    fontWeight: "600",
    marginTop: scaleHeight(5)
  },
  removeButton: {
    marginTop: scaleHeight(10),
    backgroundColor: "#FFFFFF",
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleFont(40),
    borderRadius: 8,
    alignItems: "center",
    width: "50%",
    borderWidth: 1,
    borderColor: "#DFE1E6"
  },
  removeText: {
    color: "black",
    fontWeight: "600",
    textAlign: "center",
    fontSize: scaleFont(14),
  },
  iconColor: {
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
  iconColor: {
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
    borderColor: "#24272E"
  },
  removeText: {
    color: "white",
  },
};