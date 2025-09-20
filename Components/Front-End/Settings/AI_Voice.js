import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from 'expo-speech';
import SettingsDropdown from "./Settings_Dropdown";
import { useDarkMode } from "./DarkModeContext";

const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const AI_Voice = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState("Male");
  const [activeArrow, setActiveArrow] = useState(null);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useDarkMode();
  
  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoading(true);
        const availableVoices = await Speech.getAvailableVoicesAsync();
        setVoices(availableVoices);
      } catch (error) {
        console.error("Error loading voices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadVoices();
  }, []);

  const speak = async () => {
    try {
      setIsSpeaking(true);
      Speech.stop(); // Stop any current speech
      
      const text = selectedGender === "Male" 
        ? "Hello, this is a male voice!" 
        : "Hello, this is a female voice!";
      
      // Enhanced voice selection with RSS characteristics
      const voiceForGender = voices.find(voice => {
        const voiceName = voice.name.toLowerCase();
        const voiceLanguage = voice.language.toLowerCase();
        
        // Prioritize English voices
        if (!voiceLanguage.includes('en')) return false;
        
        if (selectedGender === "Male") {
          // Male voice characteristics
          return (
            voiceName.includes('male') && 
            voiceName.includes('man') &&
            voiceName.includes('deep') &&
            voiceName.includes('low') &&
            voiceName.includes('uk') &&  // British male voices often sound more formal
            voiceName.includes('us')    // American male voices
          );
        } else {
          // Female voice characteristics
          return (
            voiceName.includes('female') || 
            voiceName.includes('woman') || 
            voiceName.includes('f1') ||
            voiceName.includes('high') ||
            voiceName.includes('soft') ||
            voiceName.includes('uk') ||  // British female voices
            voiceName.includes('us')     // American female voices
          );
        }
      });

      // Fallback to any English voice if specific gender voice not found
      const fallbackVoice = voices.find(voice => 
        voice.language.toLowerCase().includes('en')
      );

      await Speech.speak(text, {
        voice: voiceForGender?.identifier || fallbackVoice?.identifier,
        rate: 0.9,  // Slightly slower rate for clarity
        pitch: selectedGender === "Male" ? 0.6 : 1.1,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error("Error speaking:", error);
      setIsSpeaking(false);
    }
  };

  const toggleGender = (direction) => {
    setActiveArrow(direction);
    const newGender = selectedGender === "Male" ? "Female" : "Male";
    setSelectedGender(newGender);
    
    // Play the voice sample automatically when gender changes
    if (!isLoading) {
      speak();
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      // Clean up speech when component unmounts
      Speech.stop();
    };
  }, []);

  return (
    <View style={[styles.container, isDarkMode && darkModeStyles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.rectangle, isDarkMode && darkModeStyles.rectangle]}>
          <View style={styles.leftContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("Navbar")}
            >
              <Icon
                name="arrow-left"
                size={scaleFont(24)}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
            <Text style={[styles.text, isDarkMode && darkModeStyles.text]}>Settings</Text>
          </View>
        </View>

        {/* Settings Dropdown */}
        <View style={[styles.rectangle_body, isDarkMode && darkModeStyles.rectangle_body]}>
          <SettingsDropdown />
          <Text style={[styles.label_Pass, isDarkMode && darkModeStyles.label_Pass]}>
            AI Voice
          </Text>

          {/* Profile Image with Loading State */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={isSpeaking ? stopSpeaking : speak}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator 
                size="large" 
                color={isDarkMode ? "#FFF" : "#000"} 
                style={styles.loadingIndicator}
              />
            ) : (
              <Image
                source={selectedGender === "Male" 
                  ? require("../../../assets/AIVoice.png") 
                  : require("../../../assets/AIVoice.png")}
                style={styles.profileImage}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          {/* Gender Text */}
          <Text style={[styles.genderText, isDarkMode && darkModeStyles.genderText]}>
            {selectedGender}
          </Text>

          {/* Description */}
          <Text style={[styles.descriptionText, isDarkMode && darkModeStyles.descriptionText]}>
            {isSpeaking ? "Speaking..." : selectedGender === "Male"
              ? "Deep and resonant"
              : "Soft and melodic"}
          </Text>

          {/* Arrows */}
          <View style={styles.arrowContainer}>
            <TouchableOpacity
              onPress={() => toggleGender("left")}
              disabled={isLoading || isSpeaking}
              style={[
                styles.arrowButton,
                activeArrow === "left" && [
                  styles.activeArrow,
                  isDarkMode && darkModeStyles.activeArrow,
                ],
                (isLoading || isSpeaking) && styles.disabledButton,
              ]}
            >
              <Icon
                name="arrow-left"
                size={scaleFont(24)}
                color={
                  isLoading || isSpeaking 
                    ? "#CCCCCC"
                    : activeArrow === "left"
                      ? isDarkMode ? "white" : "black"
                      : isDarkMode ? "#B0B0B0" : "#6F767E"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleGender("right")}
              disabled={isLoading || isSpeaking}
              style={[
                styles.arrowButton,
                activeArrow === "right" && [
                  styles.activeArrow,
                  isDarkMode && darkModeStyles.activeArrow,
                ],
                (isLoading || isSpeaking) && styles.disabledButton,
              ]}
            >
              <Icon
                name="arrow-right"
                size={scaleFont(24)}
                color={
                  isLoading || isSpeaking 
                    ? "#CCCCCC"
                    : activeArrow === "right"
                      ? isDarkMode ? "white" : "black"
                      : isDarkMode ? "#B0B0B0" : "#6F767E"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AI_Voice;

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
  rectangle_body: {
    alignItems: "center",
    width: "90%",
    paddingVertical: scaleHeight(20),
    borderRadius: 16,
    minHeight: scaleHeight(650),
    backgroundColor: "#FCFCFC",
    marginTop: scaleHeight(15),
    alignSelf: "center",
    marginBottom: scaleHeight(20),
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
  label_Pass: {
    alignSelf: "flex-start",
    marginLeft: scaleFont(20),
    fontSize: scaleFont(24),
    fontWeight: "700",
    fontFamily: "inter",
    color: "black",
    marginBottom: scaleHeight(20),
    marginTop: scaleHeight(10),
  },
  profileImage: {
    width: scaleWidth(150),
    height: scaleWidth(150),
    marginBottom: scaleHeight(20),
  },
  loadingIndicator: {
    width: scaleWidth(150),
    height: scaleWidth(150),
    marginBottom: scaleHeight(20),
  },
  genderText: {
    fontSize: scaleFont(20),
    fontWeight: "700",
    color: "black",
  },
  descriptionText: {
    fontSize: scaleFont(16),
    fontWeight: "500",
    marginTop: scaleHeight(7),
    marginBottom: scaleHeight(20),
    color: "#6F767E",
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: scaleWidth(120),
  },
  arrowButton: {
    width: scaleWidth(50),
    height: scaleWidth(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scaleWidth(25),
  },
  activeArrow: {
    borderWidth: 3,
    borderRadius: scaleWidth(25),
    borderColor: "#EFEFEF",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

const darkModeStyles = StyleSheet.create({
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
  genderText: {
    color: "white",
  },
  descriptionText: {
    color: "#6F767E",
  },
  activeArrow: {
    borderColor: "#272B30",
  },
});