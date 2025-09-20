import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from '../Settings/DarkModeContext';
import { useFolders } from './FoldersContext';
import { useAuthNavigation } from './useAuthNavigation';
import { Menu, Provider } from 'react-native-paper';

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;


 const RecentlyDeletedSection = () => {
      const { folders, restoreFolder, permanentlyDeleteFolder } = useFolders();
      const { isDarkMode } = useDarkMode();
      const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;
      const [visibleMenu, setVisibleMenu] = useState(null);

      const deletedItems = folders.filter(f => f.isDeleted);

      const openMenu = (itemId) => setVisibleMenu(itemId);
      const closeMenu = () => setVisibleMenu(null);

      if (deletedItems.length === 0) {
        return (
          <View style={[styles.filesContainer, dynamicStyles.filesContainer]}>
            <Text style={[styles.fileText, dynamicStyles.fileText]}>No deleted items</Text>
          </View>
        );
      }

      return (
        <View style={[styles.filesContainer, dynamicStyles.filesContainer]}>
          {deletedItems.map(item => (
            <View key={item.id} style={styles.fileItem}>
              <Icon
                name={item.isFolder ? "folder" : "file"}
                size={scaleWidth(16)}
                color={isDarkMode ? "#6F767E" : "#6F767E"}
                style={styles.fileIcon}
              />
              <Text style={[styles.fileText, dynamicStyles.fileText]}>{item.name}</Text>

              <Menu
                visible={visibleMenu === item.id}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={() => openMenu(item.id)}>
                    <Icon name="dots-vertical" size={20} color={isDarkMode ? "white" : "black"} />
                  </TouchableOpacity>
                }>
                <Menu.Item
                  onPress={() => {
                    restoreFolder(item.id);
                    closeMenu();
                  }}
                  title="Restore"
                />
                <Menu.Item
                  onPress={() => {
                    Alert.alert(
                      "Permanently Delete",
                      "Are you sure you want to permanently delete this item?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel"
                        },
                        {
                          text: "Delete",
                          onPress: () => permanentlyDeleteFolder(item.id),
                          style: "destructive"
                        }
                      ]
                    );
                    closeMenu();
                  }}
                  title="Delete Permanently"
                  titleStyle={{ color: 'red' }}
                />
              </Menu>
            </View>
          ))}
        </View>
      );
    };

const Navbar = ({ navigation }) => {
  const [messageCount, setMessageCount] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : lightModeStyles;
  const [visibleMenu, setVisibleMenu] = useState(null);
  const { folders, addFile, deleteFolder, renameFolder, loading, error, refreshFolders } = useFolders();
  useAuthNavigation(); // This will handle auth navigation automatically


  const toggleGradient = (index) => {
    setSelectedItem(selectedItem === index ? null : index);
  };

  const menuItems = [
    ...folders.filter(f => !f.isDeleted).map(folder => ({
      ...folder,
      label: folder.name,
      isFolder: true,
      icon: folder.icon || 'folder'
    })),
    {
      label: "Recently Deleted",
      icon: "trash-can-outline",
      isFolder: false,
      id: 'recently-deleted',
      isDeletedSection: true
    },
    { label: "Settings", icon: "cog-outline", isFolder: false, id: 'settings' },
    { label: "Add Folder", icon: "plus-circle", isFolder: false, id: 'add-folder' },
  ];

  const toggleFolder = (folderId) => {
    // Navigate to Home component when folder is clicked
    const selectedFolder = folders.find(f => f.id === folderId);
    if (selectedFolder) {
      navigation.navigate("Home", { selectedFolder });
    }
  };

  const openMenu = (folderId) => setVisibleMenu(folderId);
  const closeMenu = () => setVisibleMenu(null);

  const handleAddFile = (folderId) => {
    closeMenu();
    navigation.navigate("Make_Notes", {
      folderId: folderId,
      isNewFile: true
    });
  };

  const handleDeleteFolder = (folderId) => {
    closeMenu();
    Alert.alert(
      "Delete Folder",
      "Are you sure you want to delete this folder?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteFolder(folderId),
          style: "destructive"
        }
      ]
    );
  };

  const handleRenameFolder = (folderId, currentName) => {
    closeMenu();
    Alert.prompt(
      "Rename Folder",
      "Enter new folder name:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (newName) => {
            if (newName && newName.trim()) {
              renameFolder(folderId, newName.trim());
            }
          }
        }
      ],
      'plain-text',
      currentName
    );
  };

  // Get real files from the folders context
  const getFilesForFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.files : [];
  };

  // Get appropriate icon for file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'note':
        return 'file-document-outline';
      case 'image':
        return 'image-outline';
      case 'video':
        return 'video-outline';
      case 'document':
        return 'file-pdf-outline';
      default:
        return 'file-outline';
    }
  };

  

  const tags = ["All tags", "#tax", "#question", "#finances", "#mysterioso"];

  return (
    <Provider>
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.rectangle, dynamicStyles.rectangle]}>
          <Image
            source={isDarkMode ? require("../../../assets/LogoDark.png") : require("../../../assets/Logo.png")}
            style={styles.logo}
          />
          <TouchableOpacity
            style={styles.clipboardContainer}
            onPress={() => navigation.navigate("Make_Notes")}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Icon
              name="clipboard-edit-outline"
              size={scaleWidth(25)}
              color={dynamicStyles.iconColor}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.menuScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuScrollContent}
        >
          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading folders...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, dynamicStyles.errorText]}>Error: {error}</Text>
              <TouchableOpacity onPress={refreshFolders} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Folders List */}
          {!loading && !error && menuItems.map((item, index) => {
          const key = item.isFolder ? item.id : `item-${index}`;
          const isSelected = selectedItem === index;
          const isExpanded = item.isFolder ? expandedFolders[item.id] :
            item.id === 'recently-deleted' ? selectedItem === index : false;

          return (
            <View key={key}>
              <TouchableOpacity
                onPress={() => {
                  toggleGradient(index);
                  if (item.label === "Settings") {
                    navigation.navigate("Change_Pass");
                  }
                  else if (item.label === "Add Folder") {
                    navigation.navigate("Add_Folder");
                  }
                  else if (item.isFolder || item.id === 'recently-deleted') {
                    if (item.isFolder) {
                      toggleFolder(item.id);
                    } else {
                      // For Recently Deleted, we just toggle selection
                      setSelectedItem(selectedItem === index ? null : index);
                    }
                  }
                }}
                style={styles.inboxWrapper}
                activeOpacity={0.7}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientInbox}
                  >
                    <View style={styles.inboxContent}>
                      <View style={styles.leftContainer}>
                        <View style={styles.iconWrapper}>
                          {item.isFolder && (
                            <Icon
                              name={isExpanded ? "chevron-down" : "chevron-right"}
                              size={scaleWidth(18)}
                              color="white"
                            />
                          )}
                          <Icon
                            name={item.icon}
                            size={scaleWidth(18)}
                            color="white"
                            style={styles.folderIcon}
                          />
                        </View>
                        <Text style={[styles.inboxText, dynamicStyles.inboxText, isSelected && { color: "white" }]}>
                          {item.label}
                        </Text>
                      </View>
                      <View style={styles.rightActions}>
                        {item.isFolder && (
                          <View
                            style={[
                              styles.messageCountContainer,
                              isSelected && {
                                backgroundColor: "rgba(231, 233, 235, 0.25)",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.messageCountText,
                                isSelected && { color: "white" },
                              ]}
                            >
                              {getFilesForFolder(item.id).length}
                            </Text>
                          </View>
                        )}
                        {item.isFolder && (
                          <Menu
                            visible={visibleMenu === item.id}
                            onDismiss={closeMenu}
                            anchor={
                              <TouchableOpacity
                                onPress={(e) => {
                                  e.stopPropagation();
                                  openMenu(item.id);
                                }}
                                style={styles.menuButton}
                              >
                                <Icon
                                  name="dots-vertical"
                                  size={20}
                                  color={isSelected ? "white" : (isDarkMode ? "white" : "black")}
                                />
                              </TouchableOpacity>
                            }
                          >
                            <Menu.Item
                              onPress={() => handleAddFile(item.id)}
                              title="Add File"
                            />
                            <Menu.Item
                              onPress={() => handleRenameFolder(item.id, item.name)}
                              title="Rename"
                            />
                            <Menu.Item
                              onPress={() => handleDeleteFolder(item.id)}
                              title="Delete"
                              titleStyle={{ color: 'red' }}
                            />
                          </Menu>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[styles.inboxContent, styles.defaultInbox, dynamicStyles.defaultInbox]}>
                    <View style={styles.leftContainer}>
                      <View style={styles.iconWrapper}>
                        <Icon
                          name={item.icon}
                          size={scaleWidth(18)}
                          color="#6F767E"
                          style={styles.folderIcon}
                        />
                      </View>
                      <Text style={[styles.inboxText, dynamicStyles.inboxText]}>{item.label}</Text>
                    </View>
                    <View style={styles.rightActions}>
                      {item.isFolder && (
                        <View style={[styles.messageCountContainer, dynamicStyles.messageCountContainer]}>
                          <Text style={[styles.messageCountText, dynamicStyles.messageCountText]}>{getFilesForFolder(item.id).length}</Text>
                        </View>
                      )}
                      {item.isFolder && (
                        <Menu
                          visible={visibleMenu === item.id}
                          onDismiss={closeMenu}
                          anchor={
                            <TouchableOpacity
                              onPress={(e) => {
                                e.stopPropagation();
                                openMenu(item.id);
                              }}
                              style={styles.menuButton}
                            >
                              <Icon
                                name="dots-vertical"
                                size={20}
                                color={isDarkMode ? "white" : "black"}
                              />
                            </TouchableOpacity>
                          }
                        >
                          <Menu.Item
                            onPress={() => handleAddFile(item.id)}
                            title="Add File"
                          />
                          <Menu.Item
                            onPress={() => handleRenameFolder(item.id, item.name)}
                            title="Rename"
                          />
                          <Menu.Item
                            onPress={() => handleDeleteFolder(item.id)}
                            title="Delete"
                            titleStyle={{ color: 'red' }}
                          />
                        </Menu>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Files dropdown for expanded folders */}
              {item.isFolder && isExpanded && (
                <View style={[styles.filesContainer, dynamicStyles.filesContainer]}>
                  {getFilesForFolder(item.id).length > 0 ? (
                    getFilesForFolder(item.id).map(file => (
                      <TouchableOpacity
                        key={file.id}
                        style={[styles.fileItem, dynamicStyles.fileItem]}
                        onPress={() => {
                          console.log("File clicked:", file.name, file.type);
                          // Navigate to Make_Notes to show file content in the same style
                          navigation.navigate("Make_Notes", {
                            fileId: file.id,
                            folderId: item.id,
                            fileName: file.name,
                            fileType: file.type,
                            isViewingFile: true
                          });
                        }}
                      >
                        <Icon
                          name={getFileIcon(file.type)}
                          size={scaleWidth(16)}
                          color={isDarkMode ? "#6F767E" : "#6F767E"}
                          style={styles.fileIcon}
                        />
                        <Text style={[styles.fileText, dynamicStyles.fileText]}>{file.name}</Text>
                        <Text style={[styles.fileType, dynamicStyles.fileType]}>{file.type}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyFolderMessage}>
                      <Text style={[styles.emptyFolderText, dynamicStyles.emptyFolderText]}>No files in this folder</Text>
                    </View>
                  )}
                </View>
              )}
              {item.id === 'recently-deleted' && isExpanded && (
                <RecentlyDeletedSection />
              )}
            </View>
          );
        })}

          {/* Divider Line */}
          <View style={[styles.divider, dynamicStyles.divider]} />

          {/* Tags Label */}
          <Text style={[styles.tagsLabel, dynamicStyles.tagsLabel]}>Tags</Text>

          {/* Tags List */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.tag, dynamicStyles.tag]}
                activeOpacity={0.7}
              >
                <Text style={[styles.tagText, dynamicStyles.tagText]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        {/* NotiveAI Button */}
        <TouchableOpacity
          style={styles.bottomContainer}
          onPress={() => navigation.navigate("NotiveAI_Speaking")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradientColors}
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
      
    </Provider>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    paddingTop: scaleHeight(40),
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: scaleWidth(340),
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleWidth(15),
    borderWidth: 2,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    marginBottom: scaleHeight(5),
  },
  logo: {
    width: scaleWidth(150),
    height: scaleHeight(50),
    resizeMode: "contain",
  },
  clipboardContainer: {
    padding: scaleWidth(10),
  },
  menuScroll: {
    flex: 1,
    width: '100%',
  },
  menuScrollContent: {
    alignItems: 'center',
    paddingBottom: scaleHeight(100),
  },
  inboxWrapper: {
    width: scaleWidth(350),
    marginTop: scaleHeight(5),
    borderRadius: 12,
    overflow: "hidden",
  },
  inboxContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleWidth(10),
    borderRadius: 12,
  },
  gradientInbox: {
    width: "100%",
    borderRadius: 12,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIcon: {
    marginRight: scaleWidth(8),
  },
  inboxText: {
    fontSize: scaleFont(15),
    fontWeight: "600",
    color: "#6F767E",
    fontFamily: "Inter",
    includeFontPadding: false,
  },
  messageCountContainer: {
    backgroundColor: "#E7E9EB",
    borderRadius: 6,
    paddingVertical: scaleHeight(3),
    paddingHorizontal: scaleWidth(10),
    minWidth: scaleWidth(25),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scaleWidth(10),
  },
  messageCountText: {
    fontSize: scaleFont(15),
    fontWeight: "bold",
    color: "black",
  },
  iconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: scaleWidth(360),
    height: 1,
    backgroundColor: "#D9D9D9",
    marginVertical: scaleHeight(15),
  },
  tagsLabel: {
    alignSelf: "flex-start",
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginLeft: scaleWidth(20),
    marginBottom: scaleHeight(8),
  },
  tagsContainer: {
    flexDirection: "row",
    width: scaleWidth(340),
    marginBottom: scaleHeight(20),
  },
  tagsContent: {
    paddingBottom: scaleHeight(5),
  },
  tag: {
    backgroundColor: "#EFEFEF",
    borderRadius: 24,
    paddingVertical: scaleHeight(6),
    paddingHorizontal: scaleWidth(16),
    marginRight: scaleWidth(12),
    height: scaleHeight(32),
    justifyContent: 'center',
  },
  tagText: {
    fontSize: scaleFont(12),
    fontWeight: "600",
    color: "#6F767E",
  },
  bottomContainer: {
    position: "absolute",
    bottom: scaleHeight(40),
    alignSelf: "center",
  },
  gradientButton: {
    width: scaleWidth(300),
    height: scaleHeight(60),
    borderRadius: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scaleWidth(20),
  },
  innerRectangle: {
    width: scaleWidth(200),
    height: scaleHeight(50),
    backgroundColor: "black",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaleWidth(15),
    right: scaleWidth(16),
  },
  notiveAiText: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    color: "white",
    fontFamily: "inter",
  },
  actionButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filesContainer: {
    width: scaleWidth(330),
    marginLeft: scaleWidth(20),
    marginTop: scaleHeight(5),
    marginBottom: scaleHeight(10),
    paddingVertical: scaleHeight(5),
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleWidth(15),
  },
  fileIcon: {
    marginRight: scaleWidth(10),
  },
  fileText: {
    fontSize: scaleFont(14),
    color: "#6F767E",
    flex: 1,
  },
  fileType: {
    fontSize: scaleFont(12),
    color: "#9CA3AF",
    marginLeft: scaleWidth(8),
  },
  emptyFolderMessage: {
    padding: scaleHeight(15),
    alignItems: 'center',
  },
  emptyFolderText: {
    fontSize: scaleFont(12),
    color: "#9CA3AF",
    fontStyle: 'italic',
  },
  menuButton: {
    padding: scaleWidth(5),
    marginLeft: scaleWidth(10),
  },
   deletedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleHeight(8),
    paddingHorizontal: scaleWidth(15),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  deletedText: {
    flex: 1,
    fontSize: scaleFont(14),
    color: "#6F767E",
  },
  loadingContainer: {
    padding: scaleHeight(20),
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scaleFont(16),
    color: "#6F767E",
  },
  errorContainer: {
    padding: scaleHeight(20),
    alignItems: 'center',
  },
  errorText: {
    fontSize: scaleFont(14),
    color: "#FF6B6B",
    textAlign: 'center',
    marginBottom: scaleHeight(10),
  },
  retryButton: {
    backgroundColor: "#6340FF",
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(8),
    borderRadius: scaleWidth(8),
  },
  retryButtonText: {
    color: "white",
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
});

const lightModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FCFCFC",
  },
  rectangle: {
    borderColor: "#EFEFEF",
  },
  iconColor: '#6F767E',
  inboxText: {
    color: "#6F767E",
  },
  defaultInbox: {
    backgroundColor: 'transparent',
  },
  messageCountContainer: {
    backgroundColor: "#E7E9EB",
  },
  messageCountText: {
    color: "black",
  },
  divider: {
    backgroundColor: "#D9D9D9",
  },
  tagsLabel: {
    color: "#6F767E",
  },
  tag: {
    backgroundColor: "#EFEFEF",
  },
  tagText: {
    color: "#6F767E",
  },
  filesContainer: {
    backgroundColor: "#F4F4F4",
  },
  fileText: {
    color: "#6F767E",
  },
  fileType: {
    color: "#9CA3AF",
  },
  emptyFolderText: {
    color: "#9CA3AF",
  },
});

const darkModeStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1D1F",
  },
  rectangle: {
    borderColor: "#272B30",
  },
  iconColor: 'white',
  inboxText: {
    color: "white",
  },
  defaultInbox: {
    backgroundColor: 'transparent',
  },
  messageCountContainer: {
    backgroundColor: "#2D2E30",
  },
  messageCountText: {
    color: "white",
  },
  divider: {
    backgroundColor: "#FFFFFF0D",
  },
  tagsLabel: {
    color: "#6F767E",
  },
  tag: {
    backgroundColor: "#292D2F",
  },
  tagText: {
    color: "#6F767E",
  },
  filesContainer: {
    backgroundColor: "#272B30",
  },
  fileText: {
    color: "#6F767E",
  },
  fileType: {
    color: "#9CA3AF",
  },
  emptyFolderText: {
    color: "#9CA3AF",
  },
  loadingText: {
    color: "#6F767E",
  },
  errorText: {
    color: "#FF6B6B",
  },
});