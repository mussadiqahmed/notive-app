
import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDarkMode } from "../Settings/DarkModeContext";
import conversationsApi from "../../../Backend/conversationsApi";

const { width, height } = Dimensions.get("window");

const Chatbot = ({navigation, route}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  const scrollViewRef = React.useRef(null);
  
  const folderId = route?.params?.folderId;

  // Load conversation when component mounts
  useEffect(() => {
    loadConversation();
  }, []);

  const loadConversation = async () => {
    try {
      const existingConversationId = route?.params?.conversationId;
      
      if (existingConversationId) {
        // Load existing conversation
        setConversationId(existingConversationId);
        const messagesResponse = await conversationsApi.getMessages(existingConversationId);
        setMessages(messagesResponse.messages || []);
      } else {
        // Get or create a conversation for this folder
        const response = await conversationsApi.getConversations(folderId);
        let conv = response.conversations?.[0];
        
        if (!conv) {
          // Create a new conversation
          const newConv = await conversationsApi.createConversation(
            folderId ? `Chat in ${route?.params?.folderName || 'Folder'}` : 'General Chat',
            folderId
          );
          conv = newConv.conversation;
        }
        
        setConversationId(conv.id);
        
        // Load messages for this conversation
        const messagesResponse = await conversationsApi.getMessages(conv.id);
        setMessages(messagesResponse.messages || []);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      Alert.alert('Error', 'Failed to load conversation');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isLoading) return;
    
    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await conversationsApi.sendMessage(conversationId, userMessage);
      setMessages(prev => [...prev, ...response.messages]);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
    style={[styles.container, dynamicStyles.container]}
    behavior={Platform.OS === "ios" ? "padding" : "position"}

  >
  
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Navbar")}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={width * 0.07}
              color= {isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Notive AI</Text>
        </View>
      </View>
    

      {/* Messages Container */}
      <View style={[styles.inputRectangle, dynamicStyles.inputRectangle]}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>
                👋 Hi! I'm NotiveAI, your AI assistant. How can I help you today?
              </Text>
            </View>
          ) : (
            messages.map((msg, index) => (
              <View key={index} style={msg.role === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}>
                {msg.role === 'user' ? (
                  <View style={styles.userMessageWrapper}>
                    <View style={[styles.userMessageBubble, dynamicStyles.userMessageBubble]}>
                      <Text style={[styles.userMessageText, dynamicStyles.userMessageText]}>
                        {msg.content}
                      </Text>
                    </View>
                    <Image
                      source={require("../../../assets/user_avatar.png")}
                      style={[styles.userAvatar, dynamicStyles.userAvatar]}
                    />
                  </View>
                ) : (
                  <View style={styles.aiMessageWrapper}>
                    <LinearGradient
                      colors={["#6340FF", "#FF40C6", "#FF8040"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.aiIcon}
                    >
                      <Image
                        source={require("../../../assets/Chatbot_Star.png")}
                        style={styles.StarImage}
                      />
                    </LinearGradient>
                    <View style={[styles.aiMessageBubble, dynamicStyles.aiMessageBubble]}>
                      <Text style={[styles.aiMessageText, dynamicStyles.aiMessageText]}>
                        {msg.content}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          )}
          
          {isLoading && (
            <View style={styles.aiMessageContainer}>
              <View style={styles.aiMessageWrapper}>
                <LinearGradient
                  colors={["#6340FF", "#FF40C6", "#FF8040"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiIcon}
                >
                  <Image
                    source={require("../../../assets/Chatbot_Star.png")}
                    style={styles.StarImage}
                  />
                </LinearGradient>
                <View style={[styles.aiMessageBubble, dynamicStyles.aiMessageBubble]}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#6340FF" />
                    <Text style={[styles.loadingText, dynamicStyles.loadingText]}>
                      NotiveAI is thinking...
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
        <TouchableOpacity>
        <Image
          source={isDarkMode ? require("../../../assets/recording2.png") : require("../../../assets/recording.png")}
          style={styles.IconImage}
        />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, dynamicStyles.input]}
          placeholder="Ask NotiveAI anything..."
          placeholderTextColor= {isDarkMode ? "#A7ACB0" : "#6F767E"}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity 
          onPress={handleSendMessage} 
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons name="send" size={25} color="white" />
          )}
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
    paddingTop: height * 0.02,
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
  // New chat layout styles
  userMessageContainer: {
    marginBottom: height * 0.02,
    alignItems: "flex-end",
  },
  aiMessageContainer: {
    marginBottom: height * 0.02,
    alignItems: "flex-start",
  },
  userMessageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    maxWidth: width * 0.75,
  },
  aiMessageWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: width * 0.85,
  },
  userMessageBubble: {
    backgroundColor: "#6340FF",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    marginRight: width * 0.02,
  },
  aiMessageBubble: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    marginLeft: width * 0.02,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userMessageText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  aiMessageText: {
    color: "#1A1D1F",
    fontSize: width * 0.04,
    fontWeight: "500",
    lineHeight: width * 0.05,
  },
  userAvatar: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: 20,
    backgroundColor: "#BBCEC5",
  },
  aiIcon: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  // Legacy styles (keeping for compatibility)
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
  sendButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  welcomeContainer: {
    alignItems: "center",
    paddingVertical: height * 0.04,
  },
  welcomeText: {
    fontSize: width * 0.04,
    color: "#6F767E",
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  loadingText: {
    fontSize: width * 0.035,
    color: "#6F767E",
    marginLeft: width * 0.02,
    fontStyle: "italic",
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
  inputRectangle: {
    backgroundColor: "#1A1D1F",
    borderColor: "#1A1D1F",
  },

  AvatarImage: {
    backgroundColor: "#CBDED5",
  },
  question: {
    color: "#6F767E",
  },
  response: {
    color: "#E0E3E5",
  },
  inputContainer: {
    backgroundColor: "#1A1D1F",
    borderColor: "#1A1D1F",
  },
  input: {
    color: "#A7ACB0",
  },
  welcomeText: {
    color: "#9CA3AF",
  },
  loadingText: {
    color: "#9CA3AF",
  },
  userMessageBubble: {
    backgroundColor: "#8246FB",
  },
  aiMessageBubble: {
    backgroundColor: "#2A2D2F",
    borderColor: "#3A3D40",
  },
  aiMessageText: {
    color: "#E0E3E5",
  },
  userAvatar: {
    backgroundColor: "#CBDED5",
  },
});