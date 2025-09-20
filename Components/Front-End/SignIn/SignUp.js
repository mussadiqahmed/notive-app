import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDarkMode } from '../Settings/DarkModeContext';
import axiosInstance from '../../../Backend/axiosSingleton'; // Import your axios instance
import { register } from '../../../Backend/authStorage';
import { useAuth } from '../Auth/AuthContext';
const { width, height } = Dimensions.get("window");

const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const SignUp = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async () => {
  const { name, email, password } = formData;
  
  // Clear any previous errors
  setError(null);
  setLoading(true);

  // Basic validation
  if (!name.trim()) {
    setLoading(false);
    Alert.alert('Validation Error', 'Please enter your full name');
    return;
  }
  
  if (!email.trim()) {
    setLoading(false);
    Alert.alert('Validation Error', 'Please enter your email address');
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setLoading(false);
    Alert.alert('Validation Error', 'Please enter a valid email address');
    return;
  }
  
  if (!password || password.length < 6) {
    setLoading(false);
    Alert.alert('Validation Error', 'Password must be at least 6 characters');
    return;
  }

  try {
    console.log('Attempting registration...');
    const response = await register(name, email, password);
    
    if (response.success) {
      // Update authentication status in AuthContext
      authLogin(response.user, response.token);
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully',
        [
          {
            text: 'Continue',
            onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Trail' }] }),
            style: 'default'
          }
        ],
        {
          // Style based on dark mode
          userInterfaceStyle: isDarkMode ? 'dark' : 'light'
        }
      );
    }
  } catch (error) {
    console.error('Signup Error:', error);
    
    // Handle specific error cases
    let errorMessage = error.message;
    
    if (errorMessage.includes('Email already registered')) {
      errorMessage = 'This email is already in use. Please try another email or sign in.';
    } else if (errorMessage.includes('network')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (errorMessage.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
    }
    
    // Set error state for inline display
    setError(errorMessage);
    
    // Also show as alert with theme-appropriate styling
    Alert.alert(
      'Registration Failed',
      errorMessage,
      [
        { 
          text: 'OK', 
          style: 'cancel' 
        },
        {
          text: 'Try Again',
          onPress: () => setLoading(false)
        }
      ],
      {
        userInterfaceStyle: isDarkMode ? 'dark' : 'light'
      }
    );
  } finally {
    if (!loading) {
      setLoading(false);
    }
  }
};

  return (
    <KeyboardAwareScrollView
      style={[{ flex: 1 }, dynamicStyles.scrollView]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={scaleHeight(20)}
      enableAutomaticScroll={true}
      keyboardOpeningTime={0}
    >
      <View style={[styles.container, dynamicStyles.container]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? "black" : "white"}
        />

        {/* Header with sign up option */}
        <View style={styles.headerContainer}>
          <Text style={[styles.signupText, dynamicStyles.text]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.SignUpText, dynamicStyles.text]}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={isDarkMode
              ? require("../../../assets/LogoDark.png")
              : require("../../../assets/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title and subtitle */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, dynamicStyles.text]}>Create an Account</Text>
          <Text style={[styles.subtitleText, dynamicStyles.text]}>
            Continue with a Google account or Apple account
          </Text>
        </View>

        {/* Social login buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[styles.socialButton, dynamicStyles.socialButton]}
            onPress={() => console.log('Google Sign-in')}
          >
            <Image
              source={require("../../../assets/google.png")}
              style={styles.socialButtonIcon}
            />
            <Text style={[styles.socialButtonText, dynamicStyles.text]}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, dynamicStyles.socialButton]}
            onPress={() => console.log("Apple Sign-in")}
          >
            <Image
              source={isDarkMode
                ? require("../../../assets/lightapple.png")
                : require("../../../assets/apple.png")}
              style={styles.socialButtonIcon}
            />
            <Text style={[styles.socialButtonText, dynamicStyles.text]}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
          <Text style={[styles.dividerText, dynamicStyles.text]}>or</Text>
          <View style={[styles.dividerLine, dynamicStyles.dividerLine]} />
        </View>

        {/* Name, Email and Password Inputs */}
        <View style={styles.formContainer}>
          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon
              name="person"
              size={moderateScale(20)}
              color={isDarkMode ? "#6C727580" : "#6F767E"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Full Name"
              placeholderTextColor={isDarkMode ? '#6C727580' : '#6F767E'}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon
              name="email"
              size={moderateScale(20)}
              color={isDarkMode ? "#6C727580" : "#6F767E"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Email"
              placeholderTextColor={isDarkMode ? '#6C727580' : '#6F767E'}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Icon
              name="lock"
              size={moderateScale(20)}
              color={isDarkMode ? "#6C727580" : "#6F767E"}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputField, dynamicStyles.inputField]}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={isDarkMode ? '#6C727580' : '#6F767E'}
              secureTextEntry
              autoCapitalize="none"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </View>
        </View>
        {/* Submit button */}
        <TouchableOpacity
          style={[styles.submitButton, dynamicStyles.submitButton, loading && styles.disabledButton]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={[styles.submitButtonText, dynamicStyles.text]}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

// Base styles
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingHorizontal: scaleWidth(10),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: scaleHeight(40),
    paddingHorizontal: scaleWidth(10),
  },
  signupText: {
    color: '#9A9FA5',
    fontSize: moderateScale(15),
    fontFamily: 'inter',
  },
  SignUpText: {
    color: 'black',
    fontFamily: 'inter',
    fontWeight: '700',
    fontSize: moderateScale(15),
    marginLeft: scaleWidth(5),
  },
  logoContainer: {
    marginTop: scaleHeight(90),
    marginBottom: scaleHeight(60),
    // marginLeft: scaleWidth(35),
  },
  logo: {
    width: scaleWidth(180),
    height: scaleHeight(70),
  },
  titleContainer: {
    marginBottom: scaleHeight(30),
  },
  titleText: {
    color: '#000',
    fontSize: moderateScale(35),
    fontFamily: 'inter',
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitleText: {
    color: '#9A9FA5',
    fontSize: moderateScale(13),
    fontFamily: 'inter',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: scaleHeight(10),
    paddingHorizontal: scaleWidth(30),
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(30),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCFCFC',
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(15),
    borderRadius: 15,
    width: scaleWidth(150),
    borderColor: '#EFEFEF',
    borderWidth: 2,
  },
  socialButtonIcon: {
    width: scaleWidth(20),
    height: scaleWidth(20),
    marginRight: scaleWidth(8),
  },
  socialButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'inter',
    fontWeight: '700'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleHeight(10),
    marginHorizontal: scaleWidth(30),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFEFEF',
  },
  dividerText: {
    color: '#9A9FA5',
    fontSize: moderateScale(14),
    fontFamily: 'inter',
    fontWeight: '700',
    marginHorizontal: scaleWidth(10),
  },
  formContainer: {
    marginHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(15),
    borderRadius: 15,
    marginBottom: scaleHeight(10),
  },
  inputIcon: {
    marginRight: scaleWidth(10),
  },
  inputField: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: 'inter',
    fontWeight: '700',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#6D24FF',
    paddingVertical: scaleHeight(15),
    borderRadius: 50,
    marginHorizontal: scaleWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: moderateScale(17),
    fontWeight: '700',
    fontFamily: 'inter',
  },
  disabledButton: {
    opacity: 0.7,
  },

});

// Dark mode styles
const darkModeStyles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#1A1D1F",
  },
  container: {
    backgroundColor: "#1A1D1F",
  },
  text: {
    color: "white",
  },
  socialButton: {
    backgroundColor: "#1A1D1F",
    borderColor: '#272B30'
  },
  inputContainer: {
    backgroundColor: "#222628",
  },
  inputField: {
    color: "#EFEFEF",
  },
  dividerLine: {
    backgroundColor: "#272B30",
  },
  submitButton: {
    backgroundColor: "#6D24FF",
  },
  errorContainer: {
  backgroundColor: '#422626', // Darker red background
},
errorText: {
  color: '#FF8A80', // Lighter red text
},
});