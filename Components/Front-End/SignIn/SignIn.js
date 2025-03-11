import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons for email and lock icons
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Import the library
import { useDarkMode } from '../Settings/DarkModeContext'; // Import the dark mode hook

const { width, height } = Dimensions.get("window");

const SignIn = ({ navigation }) => {
  const { isDarkMode } = useDarkMode(); // Access dark mode state

  // Dynamic styles based on dark mode
  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <KeyboardAwareScrollView
      style={[{ flex: 1 }, dynamicStyles.scrollView]} // Apply dynamic style to the scroll view
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled" // This allows tapping outside the input fields to dismiss the keyboard
    >
      <View style={[styles.container, dynamicStyles.container]}>
        
        {/* Text Container */}
        <View style={styles.textContainer}>
          <View style={styles.signupTextContainer}>
            <Text style={[styles.signupText, dynamicStyles.text]}>Don't have an account?</Text>
          </View>
          <View style={styles.signinTextContainer}>
            <TouchableOpacity>
              <Text style={[styles.signinText, dynamicStyles.text]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image   source={isDarkMode ? require("../../../assets/LogoDark.png") : require("../../../assets/Logo.png")} 
 style={styles.image} />
        </View>

        {/* Create Account Heading */}
        <View style={styles.headingContainer}>
          <Text style={[styles.createAccountText, dynamicStyles.text]}>Create an Account</Text>
          <Text style={[styles.subHeadingText, dynamicStyles.text]}>Continue with a Google account or Apple account</Text>
        </View>

        {/* Google and Apple Sign-in Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={() => console.log('Google Sign-in')}>
            <Image source={require("../../../assets/google.png")} style={styles.buttonImage} />
            <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={() => console.log("Apple Sign-in")}>
      <Image
        source={isDarkMode 
          ? require("../../../assets/lightapple.png") 
          : require("../../../assets/apple.png")}
        style={styles.buttonImage}
      />
      <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Apple</Text>
    </TouchableOpacity>
        </View>

        {/* Or Continue with Email Address */}
        <View style={styles.emailContainer}>
          <Text style={[styles.orContinueText, dynamicStyles.text]}>Or continue with an email address:</Text>
        </View>

        {/* Email and Password Inputs */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
            <Icon name="email" size={width * 0.06} color={isDarkMode ? "#6C727580" : "#6F767E"} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            />
          </View>
          <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
            <Icon name="lock" size={width * 0.06} color={isDarkMode ? "#6C727580" : "#6F767E"} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
            />
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={[styles.getStartedButton, dynamicStyles.getStartedButton]} onPress={() => navigation.navigate('Navbar')}>
          <Text style={[styles.getStartedText, dynamicStyles.getStartedText]}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: width * 0.05, // Make padding responsive based on width
    paddingTop: height * 0.06, // Padding from top to be responsive based on screen height
  },
  textContainer: {
    flexDirection: 'row', // Align items in a row (horizontally)
    justifyContent: 'flex-end', // Align everything to the right
    alignItems: 'center', // Vertically center the texts
    marginBottom: height * 0.08, // Optional space below text container
    padding: 20,
  },
  signupTextContainer: {
    justifyContent: 'center', // Ensure "Don't have an account?" is centered vertically
  },
  signinTextContainer: {
    justifyContent: 'center', // Ensure "Sign up" is centered vertically
    marginLeft: 5, // Optional: add a small gap between the two texts
  },
  signupText: {
    color: '#9A9FA5',
    fontSize: width * 0.035, // Responsive font size based on width
    fontFamily: 'inter',
  },
  signinText: {
    color: 'black',
    fontFamily: 'inter',
    fontWeight: '700',
    fontSize: width * 0.035, // Responsive font size
  },
  imageContainer: {
    alignItems: 'flex-start', // Center the image horizontally
    marginTop: height * 0.06,
  },
  image: {
    width: width * 0.40, // Responsive image size based on width
    height: width * 0.15, // Square shape image
    resizeMode: 'contain',
  },
  headingContainer: {
    alignItems: 'center', // Center both heading and subheading
    marginTop: height * 0.02, // Top margin for heading
  },
  createAccountText: {
    color: '#000',
    fontSize: width * 0.1, // Responsive font size
    fontFamily: 'inter',
    fontWeight: '700',
  },
  subHeadingText: {
    color: '#9A9FA5',
    fontSize: width * 0.035, // Responsive font size
    fontFamily: 'inter',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: height * 0.02, // Space between heading and subheading
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center buttons vertically
    marginTop: height * 0.05, // Gap from the top
  },
  button: {
    flexDirection: 'row', // Image and text side by side
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFCFC', // Button color
    paddingVertical: height * 0.01, // Vertical padding responsive to screen height
    paddingHorizontal: width * 0.04, // Horizontal padding responsive to screen width
    borderRadius: 15,
    marginHorizontal: width * 0.01, // Small gap between buttons
    width: width * 0.4, // Responsive width (40% of the screen)
    borderColor: '#EFEFEF',
    borderWidth: 2,
  },
  buttonText: {
    color: 'Black',
    fontSize: width * 0.05, // Responsive font size
    marginLeft: width * 0.03, // Space between image and text
    fontFamily: 'inter',
    fontWeight: '700'
  },
  buttonImage: {
    width: width * 0.075, // Responsive image size for buttons
    height: width * 0.075, // Keep image square
    resizeMode: 'contain',
  },
  emailContainer: {
    marginTop: height * 0.05, // Gap from the top
    alignItems: 'flex-start',
  },
  orContinueText: {
    color: '#9A9FA5',
    fontSize: width * 0.035, // Responsive font size
    fontFamily: 'inter',
    fontWeight: '700',
  },
  inputContainer: {
    marginTop: height * 0.02,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingVertical: height * 0.010,
    paddingHorizontal: width * 0.04,
    borderRadius: 15,
    marginBottom: height * 0.02, // Space between inputs
  },
  inputIcon: {
    width: width * 0.06, // Icon size responsive to screen width
    height: width * 0.06,
    resizeMode: 'contain',
    marginRight: width * 0.03, // Space between icon and input field
  },
  input: {
    flex: 1,
    fontSize: width * 0.04, // Responsive font size for input
    paddingVertical: height * 0.010,
    fontFamily: 'inter',
    fontWeight: '700',
  },
  getStartedButton: {
    backgroundColor: '#6D24FF', // Green color for button
    paddingVertical: height * 0.015, // Vertical padding responsive to screen height
    paddingHorizontal: width * 0.1, // Horizontal padding responsive to screen width
    borderRadius: 50,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: width * 0.06, // Responsive font size
    fontWeight: '700',
    fontFamily: 'inter',
  },
});

// Dynamic styles for light mode
const lightModeStyles = {
  scrollView: {
    backgroundColor: "#FCFCFC",
  },
  container: {
    backgroundColor: "#FCFCFC",
  },
  text: {
    color: "black",
  },
  button: {
    backgroundColor: "#FCFCFC",
  },
  buttonText: {
    color: "black",
  },
  inputWrapper: {
    backgroundColor: "#F4F4F4",
  },
  input: {
    color: "black",
  },
  getStartedButton: {
    backgroundColor: "#6D24FF",
  },
  getStartedText: {
    color: "#fff",
  },
};

// Dynamic styles for dark mode
const darkModeStyles = {
  scrollView: {
    backgroundColor: "#1A1D1F",
  },
  container: {

    backgroundColor: "#1A1D1F",
  },
  text: {
    color: "white",
  },
  button: {
    backgroundColor: "#1A1D1F",
    borderColor:'#272B30'
  },
  buttonText: {
    color: "white",
  },
  inputWrapper: {
    backgroundColor: "#222628",
  },
  input: {
    color: "#aaa",
  },
 
  getStartedText: {
    color: "#fff",
  },
};
