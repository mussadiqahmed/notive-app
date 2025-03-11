import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'; // Responsive scaling functions

const { width, height } = Dimensions.get('window'); // Get the screen width and height

const Thanks = ({ navigation }) => {
  const handleGoToNotices = () => {
    // Handle the button click (you can use navigation to redirect to another screen)
    console.log('Redirecting to notices...');
    // Example: navigation.navigate('Notices');
  };

  return (
    <View style={styles.container}>
      {/* Circle with thick icon */}
      <View style={styles.iconCircle}>
        <Icon name="check" size={moderateScale(50)} color="black" />
      </View>

      {/* Thank you header */}
      <Text style={styles.header}>Thank you for your purchase!</Text>

      {/* Order received message */}
      <Text style={styles.message}>
        Your order has been received and is currently being processed. You will receive an email confirmation with your order details shortly.
      </Text>

      {/* Button to go to notices */}
      <TouchableOpacity onPress={handleGoToNotices} style={styles.button}>
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
    padding: scale(20), 
    backgroundColor: '#FCFCFC',
  },
  iconCircle: {
    width: moderateScale(80), 
    height: moderateScale(80),
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20), 
  },
  header: {
    fontSize: moderateScale(30), 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(20),
    textAlign: 'center', 
  },
  message: {
    fontSize: moderateScale(17), 
    color: '#6C7275',
    textAlign: 'center', 
    marginBottom: verticalScale(30),
    fontFamily:'Karla'
  },
  button: {
    backgroundColor: '#8246FB',
    paddingVertical: verticalScale(15), 
    paddingHorizontal: scale(60),
    borderRadius: moderateScale(50), 
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(17), 
    fontWeight: 'bold',
  },
});

export default Thanks;
