
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");

const Chatbot = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("User Message:", message);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
  
      <View style={styles.rectangle}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={width * 0.07}
              color="black"
            />
          </TouchableOpacity>
          <Text style={styles.text}>Notive AI</Text>
        </View>
      </View>
    

      {/* Input Rectangle with Native Scrollbar */}
      <View style={styles.inputRectangle}>
        <ScrollView
         showsVerticalScrollIndicator={true} // Enables simple scrollbar

        >
          <View style={styles.messageContainer}>
            <Image
              source={require("../../../assets/user_avatar.png")}
              style={styles.AvatarImage}
            />
            <Text style={styles.question}>
              Hi! I'm working on a new AI project but feeling stuck.
            </Text>
          </View>

          <View style={styles.chatbotMessageContainer}>
            <LinearGradient
              colors={["#6340FF", "#FF40C6", "#FF8040"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientInbox}
            >
              <Image
                source={require("../../../assets/Chatbot_Star.png")}
                style={styles.StarImage}
              />
            </LinearGradient>
            <Text style={styles.response}>
              <Text>I’d love to help you brainstorm!</Text>
              {"\n\n"}
              As a fellow AI enthusiast, I understand the excitement of creating
              something innovative. Here are a few practical AI project ideas
              that could make everyday life easier:
              {"\n\n"}
              
              <Text style={styles.subHeading}>
                1. KitchenGenius - An AI app that:
              </Text>
              {"\n"} • <Text>Scans your fridge/pantry</Text>
              {"\n"} •{" "}
              <Text>Suggests recipes based on available ingredients</Text>
              {"\n"} • <Text>Learns your dietary preferences over time</Text>
              {"\n"} • <Text>Helps reduce food waste</Text>
              {"\n\n"}
              <Text style={styles.subHeading}>
                2. FocusFriend - A productivity assistant that:
              </Text>
              {"\n"} • <Text>Analyzes your most productive work hours</Text>
              {"\n"} • <Text>Suggests optimal break times</Text>
              {"\n"} •{" "}
              <Text>Blocks distracting apps/websites during focus periods</Text>
              {"\n"} • <Text>Adapts to your work patterns</Text>
              
              
            </Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TouchableOpacity>
        <Image
          source={require("../../../assets/recording.png")}
          style={styles.IconImage}
        />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask NeuraAI anything..."
          placeholderTextColor="#6F767E"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "space-between", // Keeps positions stable
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
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    paddingLeft: width * 0.03,
  },
  inputRectangle: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "#FCFCFC",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  chatbotMessageContainer: {
    flexDirection: "row",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  AvatarImage: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 30,
    backgroundColor: "#BBCEC5",
    marginRight: width * 0.03,
  },
  question: {
    fontSize: width * 0.04,
    color: "#6F767E",
    fontWeight: "500",
    flexShrink: 1,
  },
  gradientInbox: {
    width: width * 0.09,
    height: width * 0.09,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: width * 0.02,
  },
  StarImage: {
    width: width * 0.05,
    height: width * 0.05,
  },
  response: {
    fontSize: width * 0.035,
    color: "#1A1D1F",
    fontWeight: "500",
    flexShrink: 1,
    alignSelf: "flex-start",
    lineHeight: width * 0.05,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.9,
    backgroundColor: "#FCFCFC",
    borderRadius: 16,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    marginBottom: height * 0.02,
  },
  IconImage: {
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: 20,
    marginRight: width * 0.03,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#1A1D1F",
  },
  sendButton: {
    backgroundColor: "#6340FF",
    padding: width * 0.025,
    borderRadius: 30,
  },
});