import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "../Settings/DarkModeContext";
import conversationsApi from "../../../Backend/conversationsApi";

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const Inbox = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Conversations');
  const [expandedNote, setExpandedNote] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const notesData = [
    {
      id: "note1",
      title: "Shopping List",
      content: "Buy groceries, milk, and eggs.",
    },
    {
      id: "note2",
      title: "Project Plan",
      content: "Complete UI design and API integration.",
    },
    {
      id: "note3",
      title: "Weather Project",
      content: "Complete Weather UI design and API integration.",
    },
     {
      id: "note4",
      title: "Weather Project",
      content: "Complete Weather UI design and API integration.",
    },
     {
      id: "note5",
      title: "Weather Project",
      content: "Complete Weather UI design and API integration.",
    },
  ];

  // Load conversations when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "Conversations") {
      loadConversations();
    }
  }, [activeTab]);

  const loadConversations = async () => {
    setConversationsLoading(true);
    try {
      const response = await conversationsApi.getConversations();
      const conversations = response.conversations || [];
      
      // Regenerate titles for conversations that have generic titles and messages
      const updatedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          // Check if title is generic (like "New Chat" or contains date)
          if (conversation.title === 'New Chat' || 
              conversation.title.includes('New Chat') || 
              conversation.title.match(/\d{2}\/\d{2}\/\d{4}/)) {
            try {
              // First check if conversation has messages before trying to regenerate title
              const messagesResponse = await conversationsApi.getMessages(conversation.id);
              if (messagesResponse.messages && messagesResponse.messages.length > 0) {
                const titleResponse = await conversationsApi.regenerateConversationTitle(conversation.id);
                return { ...conversation, title: titleResponse.conversation.title };
              }
            } catch (error) {
              console.error('Error regenerating title for conversation:', conversation.id, error);
            }
          }
          return conversation;
        })
      );
      
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setConversationsLoading(false);
    }
  };

  const toggleNote = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "black" : "white"}
      />
      
      {/* List Header */}
      <Text style={[styles.listLabel, dynamicStyles.listLabel]}>List</Text>
      
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={scaleWidth(24)} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Inbox</Text>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="square-edit-outline" size={scaleWidth(24)} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={[styles.searchContainer, dynamicStyles.searchContainer]}>
        <Icon name="magnify" size={scaleFont(20)} color="#9CA3AF" />
        <TextInput
          style={[styles.searchInput, dynamicStyles.searchInput]}
          placeholder="Quick Search"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Notes' && styles.activeTab,
            dynamicStyles.tab,
            activeTab === 'Notes' && dynamicStyles.activeTab
          ]}
          onPress={() => setActiveTab('Notes')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'Notes' && styles.activeTabText,
            dynamicStyles.tabText,
            activeTab === 'Notes' && dynamicStyles.activeTabText
          ]}>
            Notes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Conversations' && styles.activeTab,
            dynamicStyles.tab,
            activeTab === 'Conversations' && dynamicStyles.activeTab
          ]}
          onPress={() => setActiveTab('Conversations')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'Conversations' && styles.activeTabText,
            dynamicStyles.tabText,
            activeTab === 'Conversations' && dynamicStyles.activeTabText
          ]}>
            Conversations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'Notes' ? (
          <View>
            {/* Pinned Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="pin" size={scaleWidth(16)} color="#6F767E" />
                <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                  Pinned
                </Text>
              </View>
              {[1, 2].map((item, index) => (
                <TouchableOpacity
                  key={`pinned-${index}`}
                  style={styles.notesContainer}
                  onPress={() => toggleNote(`pinned-${index}`)}
                >
                  <View
                    style={[
                      styles.notesContent,
                      expandedNote === `pinned-${index}` && [
                        styles.notesBox,
                        dynamicStyles.notesBox,
                      ],
                    ]}
                  >
                    <Text style={[styles.notesHeader, dynamicStyles.notesHeader]}>
                      {index === 0 ? "Journal entry (July)" : "Generate an NFT idea"}
                    </Text>
                    <Text
                      style={[styles.notesText, dynamicStyles.notesText]}
                      numberOfLines={expandedNote === `pinned-${index}` ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      {index === 0 
                        ? "Based on current predictions from various sources, Ethereum's price is expected to rise in t..."
                        : "NFT collection: 'Fusion Realms: A Hypermaximalist Dream in ProtoSurrealism'"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* All Notes Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                All Notes
              </Text>
              {notesData.map((note, index) => (
                <TouchableOpacity
                  key={note.id}
                  style={styles.notesContainer}
                  onPress={() => toggleNote(note.id)}
                >
                  <View
                    style={[
                      styles.notesContent,
                      expandedNote === note.id && [
                        styles.notesBox,
                        dynamicStyles.notesBox,
                      ],
                    ]}
                  >
                    <Text style={[styles.notesHeader, dynamicStyles.notesHeader]}>
                      {note.title}
                    </Text>
                    <Text
                      style={[styles.notesText, dynamicStyles.notesText]}
                      numberOfLines={expandedNote === note.id ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      {note.content}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.conversationsContainer}>
            {conversationsLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color="#6340FF" />
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                  Loading conversations...
                </Text>
              </View>
            ) : conversations.length > 0 ? (
              <View style={styles.conversationsSection}>
                <View style={styles.conversationsHeader}>
                  <Text style={[styles.previousDaysHeader, dynamicStyles.previousDaysHeader]}>
                    Previous 30 days
                  </Text>
                  <TouchableOpacity
                    style={styles.newChatButton}
                    onPress={() => navigation.navigate('Chatbot')}
                  >
                    <Icon name="plus" size={scaleWidth(16)} color="#6340FF" />
                    <Text style={styles.newChatButtonText}>New Chat</Text>
                  </TouchableOpacity>
                </View>
                {conversations.map((conversation, index) => (
                  <TouchableOpacity
                    key={conversation.id || index}
                    style={styles.conversationItem}
                    onPress={() => navigation.navigate('Chatbot', { conversationId: conversation.id })}
                  >
                    <Text style={[styles.conversationTitle, dynamicStyles.conversationTitle]}>
                      {conversation.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="chat" size={scaleWidth(48)} color="#6F767E" />
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                  Start a conversation with NotiveAI
                </Text>
                <TouchableOpacity
                  style={styles.startChatButton}
                  onPress={() => navigation.navigate('Chatbot')}
                >
                  <Text style={styles.startChatButtonText}>Start New Chat</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* NotiveAI Button */}
      <TouchableOpacity
        style={styles.notiveAIButton}
        onPress={() => navigation.navigate("NotiveAI_Speaking")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#8246FB', '#FF40C6', '#FF8040']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <View style={styles.innerRectangle}>
            <Image
              source={require("../../../assets/stars.png")}
              style={{
                width: scaleWidth(20),
                height: scaleWidth(20),
                marginRight: scaleWidth(6),
              }}
              resizeMode="contain"
            />
            <Text style={styles.notiveAiText}>NotiveAI</Text>
          </View>
          <View style={styles.actionButton}>
            <Image
              source={require("../../../assets/recording.png")}
              style={{
                width: scaleWidth(24),
                height: scaleWidth(24),
                tintColor: "black",
              }}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listLabel: {
    fontSize: scaleFont(12),
    color: '#9CA3AF',
    marginTop: scaleHeight(50),
    marginLeft: scaleWidth(20),
    marginBottom: scaleHeight(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleWidth(20),
    paddingBottom: scaleHeight(20),
    backgroundColor: 'white',
  },
  backButton: {
    padding: scaleWidth(8),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  editButton: {
    padding: scaleWidth(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: scaleWidth(12),
    fontSize: scaleFont(16),
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    marginHorizontal: scaleWidth(20),
    marginBottom: scaleHeight(20),
    borderRadius: scaleWidth(12),
    padding: scaleWidth(4),
  },
  tab: {
    flex: 1,
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(16),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#6F767E',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: scaleWidth(20),
  },
  section: {
    marginBottom: scaleHeight(24),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: scaleWidth(8),
    marginBottom: scaleHeight(16),
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
    marginBottom: scaleHeight(12),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileContent: {
    flex: 1,
    marginRight: scaleWidth(12),
  },
  fileTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scaleHeight(4),
  },
  fileDescription: {
    fontSize: scaleFont(14),
    color: '#6F767E',
    marginBottom: scaleHeight(4),
    lineHeight: scaleHeight(20),
  },
  notesContainer: {
    marginBottom: scaleHeight(12),
  },
  notesContent: {
    backgroundColor: 'white',
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notesBox: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  notesHeader: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scaleHeight(4),
  },
  notesText: {
    fontSize: scaleFont(14),
    color: '#6F767E',
    lineHeight: scaleHeight(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleHeight(16),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: scaleWidth(8),
  },
  conversationsContainer: {
    flex: 1,
  },
  conversationsSection: {
    flex: 1,
  },
  conversationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleHeight(16),
    paddingHorizontal: scaleWidth(4),
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FF',
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(8),
    borderRadius: scaleWidth(20),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  newChatButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#6340FF',
    marginLeft: scaleWidth(4),
  },
  conversationItem: {
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleWidth(4),
  },
  conversationTitle: {
    fontSize: scaleFont(16),
    fontWeight: '400',
    color: '#000',
    textAlign: 'left',
    lineHeight: scaleHeight(24),
  },
  previousDaysHeader: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#000',
    marginBottom: scaleHeight(16),
    paddingHorizontal: scaleWidth(4),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: scaleHeight(40),
  },
  emptyText: {
    fontSize: scaleFont(16),
    color: '#6F767E',
    textAlign: 'center',
    marginTop: scaleHeight(16),
    paddingHorizontal: scaleWidth(20),
  },
  startChatButton: {
    backgroundColor: '#8246FB',
    paddingHorizontal: scaleWidth(24),
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(8),
    marginTop: scaleHeight(20),
  },
  startChatButtonText: {
    color: 'white',
    fontSize: scaleFont(14),
    fontWeight: '600',
  },
  notiveAIButton: {
    position: 'absolute',
    bottom: scaleHeight(40),
    alignSelf: 'center',
  },
  gradientButton: {
    width: scaleWidth(300),
    height: scaleHeight(60),
    borderRadius: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleWidth(20),
  },
  innerRectangle: {
    width: scaleWidth(200),
    height: scaleHeight(50),
    backgroundColor: 'black',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(15),
    right: scaleWidth(16),
  },
  notiveAiText: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: 'white',
    fontFamily: 'inter',
  },
  actionButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesContainer: {
    marginBottom: scaleHeight(12),
  },
  notesContent: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(16),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  notesBox: {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
  notesHeader: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    marginBottom: scaleHeight(4),
  },
  notesText: {
    fontSize: scaleFont(14),
    color: '#6F767E',
    lineHeight: scaleHeight(20),
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#111315',
  },
  listLabel: {
    color: '#9CA3AF',
  },
  header: {
    backgroundColor: '#111315',
  },
  headerTitle: {
    color: 'white',
  },
  searchContainer: {
    backgroundColor: '#1A1D1F',
    borderColor: '#2A2D2F',
  },
  searchInput: {
    color: 'white',
  },
  tabsContainer: {
    backgroundColor: '#1A1D1F',
    borderColor: '#2A2D2F',
  },
  contentContainer: {
    backgroundColor: '#1A1D1F',
  },
  fileCard: {
    backgroundColor: '#1A1D1F',
    borderColor: '#2A2D2F',
  },
  fileContent: {
    color: 'white',
  },
  activeTab: {
    backgroundColor: '#1A1D1F',
  },
  tabText: {
    color: '#9CA3AF',
  },
  activeTabText: {
    color: 'white',
  },
  sectionTitle: {
    color: 'white',
  },
  fileItem: {
    backgroundColor: '#1A1D1F',
    borderColor: '#2A2D2F',
  },
  fileTitle: {
    color: 'white',
  },
  fileDescription: {
    color: '#9CA3AF',
  },
  notesContent: {
    backgroundColor: '#1A1D1F',
    borderColor: '#2A2D2F',
  },
  notesBox: {
    backgroundColor: '#2A2D2F',
    borderColor: '#3A3D3F',
  },
  notesHeader: {
    color: 'white',
  },
  notesText: {
    color: '#9CA3AF',
  },
  conversationTitle: {
    color: 'white',
  },
  previousDaysHeader: {
    color: 'white',
  },
  newChatButton: {
    backgroundColor: '#2A2D2F',
    borderColor: '#4B5563',
  },
  newChatButtonText: {
    color: '#8246FB',
  },
  emptyText: {
    color: '#9CA3AF',
  },
});
