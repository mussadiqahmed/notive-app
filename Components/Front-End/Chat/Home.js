import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFolders } from './FoldersContext';
import { useDarkMode } from '../Settings/DarkModeContext';
import conversationsApi from '../../../Backend/conversationsApi';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Home = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const { folders, loading } = useFolders();
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  
  const selectedFolder = route.params?.selectedFolder;
  const folderName = selectedFolder?.name || 'Inbox';

  // Load conversations when tab changes or component mounts
  useEffect(() => {
    if (activeTab === 'Conversations') {
      loadConversations();
    }
  }, [activeTab, selectedFolder]);

  // Refresh conversations when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (activeTab === 'Conversations') {
        loadConversations();
      }
    }, [activeTab, selectedFolder])
  );

  const loadConversations = async () => {
    setConversationsLoading(true);
    try {
      const response = await conversationsApi.getConversations(selectedFolder?.id);
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

  // Get all files from all folders or from selected folder
  const getAllFiles = () => {
    if (selectedFolder) {
      return selectedFolder.files || [];
    }
    
    const allFiles = [];
    folders.forEach(folder => {
      if (folder.files && folder.files.length > 0) {
        folder.files.forEach(file => {
          allFiles.push({
            ...file,
            folderName: folder.name,
            folderId: folder.id
          });
        });
      }
    });
    return allFiles;
  };

  // Filter files based on search query
  const getFilteredFiles = () => {
    const allFiles = getAllFiles();
    if (!searchQuery.trim()) return allFiles;
    
    return allFiles.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.content && file.content.some(item => 
        item.type === 'text' && item.value.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    );
  };

  // Filter conversations based on search query
  const getFilteredConversations = () => {
    if (!searchQuery.trim()) return conversations;
    
    return conversations.filter(conversation => 
      conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleFilePress = (file, folderId) => {
    navigation.navigate('Make_Notes', {
      fileId: file.id,
      folderId: folderId,
      fileName: file.name,
      fileType: file.type,
      isViewingFile: true
    });
  };

  const handleFolderPress = (folder) => {
    navigation.navigate('Navbar', { selectedFolder: folder });
  };

  const handleNotiveAIClick = () => {
    navigation.navigate('Chatbot', {
      folderId: selectedFolder?.id,
      folderName: selectedFolder?.name
    });
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chatbot', {
      conversationId: conversation.id,
      folderId: selectedFolder?.id,
      folderName: selectedFolder?.name
    });
  };

  const handleCreateConversation = async () => {
    try {
      const response = await conversationsApi.createConversation(
        'New Chat',
        selectedFolder?.id
      );
      
      // Navigate to the new conversation
      navigation.navigate('Chatbot', {
        conversationId: response.conversation.id,
        folderId: selectedFolder?.id,
        folderName: selectedFolder?.name
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await conversationsApi.createConversation(
        selectedFolder?.id ? `New Chat in ${selectedFolder?.name}` : 'New Chat',
        selectedFolder?.id
      );
      
      // Navigate to the new conversation
      navigation.navigate('Chatbot', {
        conversationId: response.conversation.id,
        folderId: selectedFolder?.id,
        folderName: selectedFolder?.name
      });
    } catch (error) {
      console.error('Error creating new conversation:', error);
      Alert.alert('Error', 'Failed to create new conversation');
    }
  };

  const renderFileItem = (file, index) => (
    <TouchableOpacity
      key={`${file.id}-${index}`}
      style={[styles.fileItem, dynamicStyles.fileItem]}
      onPress={() => handleFilePress(file, file.folderId || selectedFolder?.id)}
    >
      <View style={styles.fileContent}>
        <Text style={[styles.fileTitle, dynamicStyles.fileTitle]} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={[styles.fileDescription, dynamicStyles.fileDescription]} numberOfLines={2}>
          {file.content && file.content.length > 0 
            ? file.content.find(item => item.type === 'text')?.value || 'No text content'
            : 'No content available'
          }
        </Text>
        {!selectedFolder && (
          <Text style={[styles.folderName, dynamicStyles.folderName]}>
            📁 {file.folderName}
          </Text>
        )}
      </View>
      <Icon 
        name={getFileIcon(file.type)} 
        size={scaleWidth(20)} 
        color={isDarkMode ? "#6F767E" : "#6F767E"} 
      />
    </TouchableOpacity>
  );

  const renderConversationItem = (conversation, index) => (
    <TouchableOpacity
      key={`${conversation.id}-${index}`}
      style={[styles.conversationItem, dynamicStyles.conversationItem]}
      onPress={() => handleConversationPress(conversation)}
    >
      <Text style={[styles.conversationTitle, dynamicStyles.conversationTitle]} numberOfLines={1}>
        {conversation.title}
      </Text>
    </TouchableOpacity>
  );

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return 'image';
      case 'video': return 'video';
      case 'document': return 'file-document';
      case 'note': return 'note-text';
      default: return 'file';
    }
  };

  const filteredFiles = getFilteredFiles();

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header Card */}
      <View style={[styles.headerCard, dynamicStyles.headerCard]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={scaleWidth(24)} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>{folderName}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="square-edit-outline" size={scaleWidth(24)} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Card */}
      <View style={[styles.contentCard, dynamicStyles.contentCard]}>
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
            {filteredFiles.filter(f => f.pinned).length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="pin" size={scaleWidth(16)} color="#6F767E" />
                  <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                    Pinned
                  </Text>
                </View>
                {filteredFiles
                  .filter(f => f.pinned)
                  .map((file, index) => (
                    <TouchableOpacity
                      key={`pinned-${file.id}-${index}`}
                      style={styles.notesContainer}
                      onPress={() => handleFilePress(file, file.folderId || selectedFolder?.id)}
                    >
                      <View style={[styles.notesContent, dynamicStyles.notesContent]}>
                        <Text style={[styles.notesHeader, dynamicStyles.notesHeader]}>
                          {file.name}
                        </Text>
                        <Text style={[styles.notesText, dynamicStyles.notesText]}>
                          {file.content && file.content.length > 0 
                            ? file.content.find(item => item.type === 'text')?.value || 'No text content'
                            : 'No content available'
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            )}

            {/* All Notes Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                All Notes
              </Text>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file, index) => (
                  <TouchableOpacity
                    key={`file-${file.id}-${index}`}
                    style={styles.notesContainer}
                    onPress={() => handleFilePress(file, file.folderId || selectedFolder?.id)}
                  >
                    <View style={[styles.notesContent, dynamicStyles.notesContent]}>
                      <Text style={[styles.notesHeader, dynamicStyles.notesHeader]}>
                        {file.name}
                      </Text>
                      <Text style={[styles.notesText, dynamicStyles.notesText]}>
                        {file.content && file.content.length > 0 
                          ? file.content.find(item => item.type === 'text')?.value || 'No text content'
                          : 'No content available'
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Icon name="note-text" size={scaleWidth(48)} color="#6F767E" />
                  <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                    {searchQuery ? 'No notes found matching your search' : 'No notes yet'}
                  </Text>
                </View>
              )}
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
            ) : getFilteredConversations().length > 0 ? (
              <View style={styles.conversationsSection}>
                <View style={styles.conversationsHeader}>
                  <Text style={[styles.previousDaysHeader, dynamicStyles.previousDaysHeader]}>
                    Previous 30 days
                  </Text>
                  <TouchableOpacity
                    style={styles.newChatButton}
                    onPress={handleNewChat}
                  >
                    <Icon name="plus" size={scaleWidth(16)} color="#6340FF" />
                    <Text style={styles.newChatButtonText}>New Chat</Text>
                  </TouchableOpacity>
                </View>
                {getFilteredConversations().map((conversation, index) => 
                  renderConversationItem(conversation, index)
                )}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="chat" size={scaleWidth(48)} color="#6F767E" />
                <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                  {searchQuery ? 'No conversations found matching your search' : 'Start a conversation with NotiveAI'}
                </Text>
                {!searchQuery && (
                  <TouchableOpacity
                    style={styles.startChatButton}
                    onPress={handleCreateConversation}
                  >
                    <Text style={styles.startChatButtonText}>Start New Chat</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
        </ScrollView>
      </View>

      {/* NotiveAI Button */}
      <TouchableOpacity
        style={styles.notiveAIButton}
        onPress={handleNotiveAIClick}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerCard: {
    marginHorizontal: scaleWidth(25),
    marginTop: scaleHeight(45),
    marginBottom: scaleHeight(10),
    backgroundColor: 'white',
    borderRadius: scaleWidth(12),
  },
  contentCard: {
    flex: 1,
    marginHorizontal: scaleWidth(25),
    marginBottom: scaleHeight(45),
    backgroundColor: 'white',
    borderRadius: scaleWidth(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(15),
    paddingTop: scaleHeight(15),
    paddingBottom: scaleHeight(15),
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: scaleWidth(8),
    marginRight: scaleWidth(12),
  },
  headerTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    flex: 1,
  },
  editButton: {
    padding: scaleWidth(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: scaleWidth(15),
    marginTop: scaleHeight(15),
    marginBottom: scaleHeight(15),
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(10),
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
    marginHorizontal: scaleWidth(15),
    marginBottom: scaleHeight(15),
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
    paddingHorizontal: scaleWidth(15),
  },
  section: {
    marginBottom: scaleHeight(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleHeight(12),
  },
  sectionTitle: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#000',
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
  folderName: {
    fontSize: scaleFont(12),
    color: '#9CA3AF',
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
    backgroundColor: 'transparent',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(8),
    borderRadius: scaleWidth(8),
  },
  addButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#6340FF',
    marginLeft: scaleWidth(4),
  },
  notesContainer: {
    marginBottom: scaleHeight(8),
  },
  notesContent: {
    backgroundColor: 'transparent',
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: scaleHeight(8),
  },
  notesHeader: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
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
  headerCard: {
    backgroundColor: '#1A1D1F',
  },
  contentCard: {
    backgroundColor: '#1A1D1F',
  },
  header: {
    backgroundColor: 'transparent',
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
    backgroundColor: '#111315',
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
  folderName: {
    color: '#6F767E',
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
  addButton: {
    backgroundColor: '#2A2D2F',
  },
  addButtonText: {
    color: '#8246FB',
  },
  notesContent: {
    backgroundColor: 'transparent',
    borderColor: '#2A2D2F',
  },
  notesHeader: {
    color: 'white',
  },
  notesText: {
    color: '#9CA3AF',
  },
});

export default Home; 