import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useDarkMode } from '../Settings/DarkModeContext';

const Thanks = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Success icon circle */}
      <View style={styles.iconCircle}>
        <Icon 
          name="check" 
          size={moderateScale(50)} 
          color={isDarkMode ? "white" : "black"} 
        />
      </View>

      {/* Thank you header */}
      <Text style={[styles.header, dynamicStyles.header]}>
        Thank you for your purchase!
      </Text>

      {/* Order confirmation message */}
      <Text style={[styles.message, dynamicStyles.message]}>
        Your order has been received and is currently being processed. 
        You will receive an email confirmation with your order details shortly.
      </Text>

      {/* Continue button */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('Navbar')} 
        style={[styles.button, dynamicStyles.button]}
      >
        <Text style={styles.buttonText}>Go to Notive</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    backgroundColor: '#FCFCFC',
  },
  iconCircle: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  header: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(20),
    textAlign: 'center',
    lineHeight: verticalScale(32),
    paddingHorizontal: scale(20),
  },
  message: {
    fontSize: moderateScale(16),
    color: '#6C7275',
    textAlign: 'center',
    marginBottom: verticalScale(40),
    lineHeight: verticalScale(24),
    paddingHorizontal: scale(30),
    fontFamily: 'Karla'
  },
  button: {
    backgroundColor: '#8246FB',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(60),
    borderRadius: moderateScale(50),
    minWidth: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
});

const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  header: {
    color: "white",
  },
  message: {
    color: '#F0F1F1'
  },
  button: {
    backgroundColor: '#6D24FF',
  },
  iconCircle: {
    backgroundColor: '#32AE60',
  }
};

export default Thanks;