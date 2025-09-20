import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useDarkMode } from "../Settings/DarkModeContext";
import NoteMedia from "./NoteMedia";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFolders } from './FoldersContext';
import { createNoteFile } from '../../../Backend/storageApi';
import { uploadFile } from '../../../Backend/storageApi';
import axiosInstance from '../../../Backend/axiosSingleton';
const { width, height } = Dimensions.get("window");

// Responsive scaling functions
const scaleWidth = size => (width / 375) * size;
const scaleHeight = size => (height / 812) * size;
const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;

const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Make_Notes = ({ navigation, route }) => {
  const [title, setTitle] = useState("Untitled Note");
const [fileName, setFileName] = useState("Untitled Note");
  const [timestamp, setTimestamp] = useState("");
  const [isBulletMode, setIsBulletMode] = useState(false);
  const [isNumberMode, setIsNumberMode] = useState(false);
  const [numberCount, setNumberCount] = useState(1);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [content, setContent] = useState([{ type: "text", value: "" }]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textHeights, setTextHeights] = useState({});
  const [inputHeight, setInputHeight] = useState(scaleHeight(200));
  const [isViewingFile, setIsViewingFile] = useState(false);
  const [currentFileId, setCurrentFileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  const { addFile, refreshFolders } = useFolders();
  const { folderId, isNewFile } = route.params || {};
  
  // Spinner animation
  const spinValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    
    return () => spinAnimation.stop();
  }, []);
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });





  const handleMediaSelection = () => {
    Alert.alert("Choose Media", "What do you want to add?", [
      { text: "Image", onPress: pickImage },
      { text: "Video", onPress: pickVideo },
      { text: "Document", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleTextChange = (text, index) => {
    const formattedText = handleNoteChange(text, index);

    setContent(prevContent => {
      const updatedContent = [...prevContent];
      updatedContent[index] = {
        ...updatedContent[index],
        value: formattedText,
      };
      return updatedContent;
    });

    // Update cursor position based on the new text length
    setCursorPosition(text.length);
  };

const handleSaveNote = async () => {
  // For existing files, we don't need folderId from route params
  if (!folderId && !currentFileId) return;
  
  setIsSaving(true);
  
  try {
    const baseURL = axiosInstance?.defaults?.baseURL || '';
    const uploadedContent = [];
    
    // Process media files - store local paths instead of base64 to avoid payload size issues
    for (const item of content) {
      if (item.type === 'media' && (item.image || item.video || item.document)) {
        // Handle media items that were inserted via insertMediaAtCursor
        const mediaType = item.image ? 'image' : item.video ? 'video' : 'document';
        const mediaData = item.image || item.video || item.document;
        
        // Store media with local URI - no base64 conversion to avoid size issues
        uploadedContent.push({
          type: 'media',
          [mediaType]: {
            id: mediaData.id || Date.now() + Math.random(),
            uri: mediaData.uri, // Local URI for access
            name: mediaData.name || `${mediaType}_${Date.now()}`,
            mimeType: mediaData.mimeType,
            // No base64 data - just store the local path
          }
        });
      } else if (item.type === 'image' || item.type === 'video' || item.type === 'document') {
        // Handle direct media items (legacy format) - store local paths
        uploadedContent.push({
          type: item.type,
          id: item.id || Date.now() + Math.random(),
          uri: item.uri, // Local URI for access
          name: item.name || `${item.type}_${Date.now()}`,
          mimeType: item.mimeType,
          // No base64 data - just store the local path
        });
      } else {
        // Text content, keep as is
        uploadedContent.push(item);
      }
    }



    console.log('Save function - Final state check:', { 
      currentFileId, 
      isViewingFile, 
      routeParams: route.params,
      folderId 
    });

    if (currentFileId) {
      // Update existing file - this happens when editing an existing file
      console.log('About to update existing file with ID:', currentFileId);
      
      const updateData = {
        name: title || 'Untitled Note',
        content: uploadedContent
      };
      
      console.log('Sending update request with data:', updateData);
      const response = await axiosInstance.put(`/files/${currentFileId}`, updateData);
      
      if (response.data.success) {
        console.log('File updated successfully');
        Alert.alert('Success', 'File updated successfully');
        await refreshFolders();
        
        // Navigate back to home page after successful update
        navigation.navigate('Home');
      } else {
        throw new Error(response.data.error || 'Failed to update file');
      }
    } else {
      // Create new file - this happens when creating a brand new note
      console.log('About to create new file. currentFileId:', currentFileId, 'isViewingFile:', isViewingFile);
      
      const newFile = {
        type: 'note',
        name: title || 'Untitled Note',
        title,
        content: uploadedContent,
        createdAt: new Date().toISOString(),
      };
      
      await addFile(folderId || route.params?.folderId, newFile);
      await refreshFolders(); // Refresh to show the new file
      navigation.navigate('Home');
    }
  } catch (e) {
    console.error('Save failed:', e);
    Alert.alert('Save Failed', 'Could not save your note. Please try again.');
  } finally {
    setIsSaving(false);
  }
};

  const removeMedia = (mediaId) => {
    setContent((prevContent) => {
      let updatedContent = [...prevContent];

      // Find index of the media to be removed
      const mediaIndex = updatedContent.findIndex(
        (item) => item.id === mediaId
      );

      if (mediaIndex !== -1) {
        updatedContent.splice(mediaIndex, 1); // Remove media

        // Remove the corresponding text input if it exists after the media
        if (
          mediaIndex < updatedContent.length &&
          updatedContent[mediaIndex]?.type === "text"
        ) {
          updatedContent.splice(mediaIndex, 1); // Remove the next text field
        }
      }

      // Ensure at least one input field remains
      if (
        updatedContent.length === 0 ||
        updatedContent.every((item) => item.type !== "text")
      ) {
        updatedContent.push({ type: "text", value: "" });
      }

      return updatedContent;
    });

    // Adjust cursor to prevent invalid index issues
    setCursorIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const insertMediaAtCursor = (newMedia) => {
    setContent((prevContent) => {
      let updatedContent = [...prevContent];

      // If only an empty text field exists, replace it with media
      if (
        updatedContent.length === 1 &&
        updatedContent[0].type === "text" &&
        updatedContent[0].value === ""
      ) {
        return [
          { type: "media", ...newMedia },
          { type: "text", value: "" },
        ];
      }

      // Insert media at the cursor index
      updatedContent.splice(cursorIndex + 1, 0, { type: "media", ...newMedia });

      // Ensure there's only **one** text input at the end
      if (updatedContent[updatedContent.length - 1].type !== "text") {
        updatedContent.push({ type: "text", value: "" });
      }

      return updatedContent;
    });

    // Move cursor to the newly added text input after media
    setCursorIndex((prevIndex) => prevIndex + 2);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true, // ✅ Enable multiple selections
      quality: 1,
    });

    if (!result.canceled) {
      // ✅ Handle multiple images
      result.assets.forEach((asset) => {
        insertMediaAtCursor({
          id: Date.now() + Math.random(), // Ensure unique ID
          type: "image",
          uri: asset.uri,
        });
      });
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      allowsMultipleSelection: true, // ✅ Enable multiple video selection
      quality: 1,
    });

    if (!result.canceled) {
      result.assets.forEach((asset) => {
        insertMediaAtCursor({
          id: Date.now() + Math.random(),
          type: "video",
          uri: asset.uri,
        });
      });
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({ multiple: false }); // Single file selection

      console.log("Document Picker Result:", result); // Log the entire result to check its structure

      if (result.assets && result.assets.length > 0) {
        const document = result.assets[0]; // Access the first document in the assets array

        // Log the document details to ensure data is correct
        console.log("Selected document:", document);

        insertMediaAtCursor({
          id: Date.now() + Math.random(),
          type: "document",
          uri: document.uri,
          name: document.name,
        });
      } else {
        console.log("No document selected or the picker was canceled.");
      }
    } catch (error) {
      console.error("Error picking document", error);
    }
  };

  // Function to generate timestamp
  const getFormattedTimestamp = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { formattedDate, formattedTime };
  };

  // Set timestamp on component mount
  useEffect(() => {
    const { formattedDate, formattedTime } = getFormattedTimestamp();
    setTimestamp({ formattedDate, formattedTime });
  }, []);

  // Handle viewing existing file - only run once when component mounts or route changes
  useEffect(() => {
    const { fileId, isViewingFile: routeIsViewingFile, fileName, fileType } = route.params || {};
    
    console.log('Route params received:', { fileId, routeIsViewingFile, fileName, fileType });
    console.log('Current state before update:', { isViewingFile, currentFileId });
    
    if (routeIsViewingFile && fileId) {
      console.log('Setting up file viewing with fileId:', fileId, 'type:', typeof fileId);
      setIsViewingFile(true);
      setCurrentFileId(parseInt(fileId));
      
      // Load the file content from the backend
      const loadFileContent = async () => {
        try {
          const response = await axiosInstance.get(`/files/${parseInt(fileId)}`);
          
          if (response.data.success) {
            const file = response.data.file;
            console.log('Successfully loaded file:', file);
            
            // Set the title and content
            setTitle(file.name || fileName || 'Untitled Note');
            setFileName(file.name || fileName || 'Untitled Note');
            
            if (file.content) {
              setContent(file.content);
            }
          }
        } catch (err) {
          console.error('Failed to load file content for viewing:', err);
          
          // Don't reset viewing state on authentication errors - let token refresh handle it
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.log('Authentication error while loading file, keeping viewing state for retry');
            // Keep the viewing state and let the token refresh mechanism handle it
            // Don't show alert here as the interceptor will handle the refresh
          } else {
            Alert.alert('Error', 'Failed to load file content');
          }
        }
      };
      
      loadFileContent();
    }
  }, [route.params?.fileId, route.params?.isViewingFile]); // Only depend on the specific values we care about

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup: reset state when component unmounts
      console.log('Component unmounting, resetting file viewing state');
      setIsViewingFile(false);
      setCurrentFileId(null);
    };
  }, []); // Only run on unmount, not when isViewingFile changes

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log('State changed - isViewingFile:', isViewingFile, 'currentFileId:', currentFileId);
  }, [isViewingFile, currentFileId]);



  const editNote = () => {
    alert("Edit functionality can be implemented here.");
  };

  const handleDeleteFile = async () => {
    if (!currentFileId) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axiosInstance.delete(`/files/${currentFileId}`);
              if (response.data.success) {
                Alert.alert('Success', 'Note deleted successfully');
                await refreshFolders();
                navigation.navigate('Home');
              } else {
                throw new Error(response.data.error || 'Failed to delete file');
              }
            } catch (error) {
              console.error('Delete failed:', error);
              Alert.alert('Delete Failed', 'Could not delete the note. Please try again.');
            }
          },
        },
      ]
    );
  };


  const clearNote = () => {
    setContent([{ type: "text", value: "" }]); // Reset to an empty note
    setMediaFiles([]); // Clear all media
    setCursorIndex(0); // Reset cursor position
    setTextHeights(0); // Reset text input heights to default
  };

  // Toggle Uppercase & Lowercase for Title (Format Letter Case Icon)
  const toggleTitleCase = () => {
    setTitle((prevTitle) =>
      prevTitle === prevTitle.toUpperCase()
        ? prevTitle.toLowerCase()
        : prevTitle.toUpperCase()
    );
  };

  const getCurrentLineIndex = (text, cursorPos) => {
    const textBeforeCursor = text.substring(0, cursorPos);
    return textBeforeCursor.split('\n').length - 1;
  };

  // Helper function to get cursor position within current line
  const getCursorPositionInLine = (text, cursorPos) => {
    const textBeforeCursor = text.substring(0, cursorPos);
    const lines = textBeforeCursor.split('\n');
    return lines[lines.length - 1].length;
  };

  // Updated toggle functions
  const toggleBulletList = () => {
    setIsBulletMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        setIsNumberMode(false);

        setContent(prevContent => {
          const updated = [...prevContent];
          if (updated[cursorIndex].type === 'text') {
            const currentValue = updated[cursorIndex].value;
            const lines = currentValue.split('\n');
            const cursorLineIndex = getCurrentLineIndex(currentValue, cursorPosition);

            // Toggle bullet only for the current line
            if (lines[cursorLineIndex].startsWith('• ')) {
              lines[cursorLineIndex] = lines[cursorLineIndex].substring(2);
              // Adjust cursor position if we removed bullet
              setTimeout(() => {
                setCursorPosition(Math.max(0, cursorPosition - 2));
              }, 0);
            } else {
              lines[cursorLineIndex] = `• ${lines[cursorLineIndex]}`;
              // Adjust cursor position if we added bullet
              setTimeout(() => {
                setCursorPosition(cursorPosition + 2);
              }, 0);
            }

            updated[cursorIndex].value = lines.join('\n');
          }
          return updated;
        });
      }
      return newMode;
    });
  };

  const toggleNumberedList = () => {
    setIsNumberMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        setIsBulletMode(false);
        setNumberCount(1); // Reset counter when toggling on

        setContent(prevContent => {
          const updated = [...prevContent];
          if (updated[cursorIndex].type === 'text') {
            const currentValue = updated[cursorIndex].value;
            const lines = currentValue.split('\n');
            const cursorLineIndex = getCurrentLineIndex(currentValue, cursorPosition);

            // Check if line already has numbering
            const numberMatch = lines[cursorLineIndex].match(/^(\d+)\.\s*/);

            if (numberMatch) {
              // Remove numbering
              const numberLength = numberMatch[0].length;
              lines[cursorLineIndex] = lines[cursorLineIndex].substring(numberLength);
              // Adjust cursor position
              setTimeout(() => {
                setCursorPosition(Math.max(0, cursorPosition - numberLength));
              }, 0);
            } else {
              // Add numbering
              const newNumber = `${numberCount}. `;
              lines[cursorLineIndex] = newNumber + lines[cursorLineIndex];
              // Adjust cursor position
              setTimeout(() => {
                setCursorPosition(cursorPosition + newNumber.length);
                setNumberCount(numberCount + 1);
              }, 0);
            }

            updated[cursorIndex].value = lines.join('\n');
          }
          return updated;
        });
      } else {
        setNumberCount(1); // Reset counter when toggling off
      }
      return newMode;
    });
  };

  const countNumberedItems = (text) => {
    const lines = text.split('\n');
    let count = 0;
    lines.forEach(line => {
      if (line.match(/^\d+\. /)) {
        count++;
      }
    });
    return count || 1;
  };

  // Updated handleNoteChange for better new line handling
  const handleNoteChange = (text, index) => {
    // If not in bullet or number mode, return text as is
    if (!isBulletMode && !isNumberMode) {
      return text;
    }

    // Check if Enter was pressed (new line added)
    if (text.endsWith('\n')) {
      const lines = text.split('\n');
      const lastLineIndex = lines.length - 2; // The line before the new empty line

      // Remove the empty line created by pressing Enter
      const newText = text.substring(0, text.length - 1);

      if (isBulletMode) {
        // Add bullet to the new line we're creating
        const bulletText = newText + '\n• ';
        // Move cursor to after the bullet
        setTimeout(() => {
          setCursorPosition(bulletText.length);
        }, 0);
        return bulletText;
      }
      else if (isNumberMode) {
        // Add number to the new line we're creating
        const newNumber = `${numberCount}. `;
        const numberedText = newText + '\n' + newNumber;
        // Move cursor to after the number
        setTimeout(() => {
          setCursorPosition(numberedText.length);
          setNumberCount(numberCount + 1);
        }, 0);
        return numberedText;
      }
    }

    // Handle backspace to remove empty bullet/number items
    if (text.length < content[index].value.length) {
      const lines = text.split('\n');
      const currentLine = lines[lines.length - 1];

      if (isBulletMode && currentLine === '• ') {
        // Remove the empty bullet point
        return text.substring(0, text.length - 2);
      }
      if (isNumberMode && currentLine.match(/^\d+\. $/)) {
        // Remove the empty number point
        return text.substring(0, text.length - currentLine.length);
      }
    }

    return text;
  };
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Loading Overlay */}
      {isSaving && (
        <View style={styles.fullScreenLoading}>
          <View style={styles.loadingModal}>
            <View style={styles.spinnerContainer}>
              <Animated.View 
                style={[
                  styles.roundSpinner,
                  { transform: [{ rotate: spin }] }
                ]} 
              />
            </View>
            <Text style={styles.loadingModalText}>Saving...</Text>
          </View>
        </View>
      )}
      
      {/* Top Rectangle with Back Arrow and Icons */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
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
          {!isViewingFile && (
            <TouchableOpacity style={styles.iconButton} onPress={clearNote}>
              <Icon
                name="trash-can-outline"
                size={scaleFont(24)}
                color="#6F767E"
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.rightContainer}>
          {!isViewingFile ? (
            <>
              <TouchableOpacity style={styles.iconButton} onPress={toggleTitleCase}>
                <Icon
                  name="format-letter-case"
                  size={scaleFont(24)}
                  color="#6F767E"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, isBulletMode && styles.activeIcon]}
                onPress={toggleBulletList}
              >
                <Icon
                  name="format-list-bulleted"
                  size={scaleFont(22)}
                  color={isBulletMode ? "orange" : "#6F767E"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, isNumberMode && styles.activeIcon]}
                onPress={toggleNumberedList}
              >
                <Icon
                  name="grid"
                  size={scaleFont(22)}
                  color={isNumberMode ? "orange" : "#6F767E"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleMediaSelection}>
                <Icon
                  name="attachment"
                  size={scaleFont(24)}
                  color={isDarkMode ? "white" : "#6F767E"}
                  style={styles.rotatedIcon}
                />
              </TouchableOpacity>
              {currentFileId && (
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={handleDeleteFile}
                >
                  <Icon
                    name="delete"
                    size={scaleFont(24)}
                    color="#FF4444"
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.viewingModeIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => {
                console.log('Edit button clicked - switching to edit mode');
                setIsViewingFile(false); // This allows editing
                // Keep the currentFileId so we know which file to update
                // Don't reset currentFileId - we need it for updating the file
                console.log('Edit mode activated for file ID:', currentFileId);
              }}>
                <Icon
                  name="pencil"
                  size={scaleFont(24)}
                  color="#6F767E"
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleDeleteFile}
              >
                <Icon
                  name="delete"
                  size={scaleFont(24)}
                  color="#FF4444"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={[styles.notesContainer, dynamicStyles.notesContainer]}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: scaleHeight(80) }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          extraScrollHeight={scaleHeight(100)}
        >
          {timestamp && (
            <Text style={[styles.timestamp, dynamicStyles.timestamp]}>
              Created on{" "}
              <Text style={[styles.boldText, dynamicStyles.boldText]}>
                {timestamp.formattedDate}
              </Text>{" "}
              at{" "}
              <Text style={[styles.boldText, dynamicStyles.boldText]}>
                {timestamp.formattedTime}
              </Text>
            </Text>
          )}

          <TextInput
            style={[styles.titleInput, dynamicStyles.titleInput]}
            placeholder="Enter title..."
            placeholderTextColor="#6F767E"
            value={title}
            onChangeText={(text) => setTitle(text)}
            editable={!isViewingFile}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Enter') {
                // When Enter is pressed, move to next line without auto-formatting
                if (isBulletMode || isNumberMode) {
                  setCursorPosition(0); // Reset cursor to start of new line
                }
              }
            }}
          />

          <View style={[styles.divider, dynamicStyles.divider]} />

          {content.map((item, index) => {
            if (item.type === "text") {
              return (
                <TextInput
                  key={index}
                  style={[
                    styles.input,
                    dynamicStyles.input,
                    {
                      height: textHeights[index] || scaleHeight(40),
                      minHeight: scaleHeight(40),
                    },
                  ]}
                  placeholder="Write your notes here..."
                  placeholderTextColor="#6F767E"
                  multiline
                  value={item.value}
                  onChangeText={(text) => handleTextChange(text, index)}
                  editable={!isViewingFile}
                  onSelectionChange={(event) => {
                    setCursorIndex(index);
                    setCursorPosition(event.nativeEvent.selection.start);
                  }}
                  selection={{
                    start: cursorIndex === index ? cursorPosition : 0,
                    end: cursorIndex === index ? cursorPosition : 0,
                  }}
                  onFocus={() => {
                    setCursorIndex(index);
                    // Update number count when focusing on a numbered list
                    if (isNumberMode) {
                      setNumberCount(countNumberedItems(item.value) + 1);
                    }
                  }}
                  onContentSizeChange={(event) => {
                    const newHeight = event.nativeEvent.contentSize.height;
                    setTextHeights((prev) => ({
                      ...prev,
                      [index]: newHeight,
                    }));
                  }}
                />
              );
            } else {
              return (
                <View key={item.id} style={styles.mediaContainer}>
                  <NoteMedia 
                    media={item} 
                    onRemove={isViewingFile ? undefined : () => removeMedia(item.id)} 
                  />
                </View>
              );
            }
          })}
        </KeyboardAwareScrollView>
      </View>

      {/* Action Buttons for File Operations */}
      {isViewingFile && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButtonBox} 
            onPress={() => {
              console.log('Download button pressed');
              // TODO: Implement download functionality
            }}
            activeOpacity={0.7}
          >
            <Icon name="download" size={scaleFont(20)} color="#6F767E" />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButtonBox} 
            onPress={() => {
              console.log('Comment button pressed');
              // TODO: Implement comment functionality
            }}
            activeOpacity={0.7}
          >
            <Icon name="comment-outline" size={scaleFont(20)} color="#6F767E" />
            <Text style={styles.actionButtonText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButtonBox} 
            onPress={() => {
              console.log('Delete button pressed');
              Alert.alert(
                'Delete File',
                'Are you sure you want to delete this file?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                      console.log('Deleting file:', currentFileId);
                      // TODO: Implement delete functionality
                    }
                  }
                ]
              );
            }}
            activeOpacity={0.7}
          >
            <Icon name="delete-outline" size={scaleFont(20)} color="#6F767E" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={styles.bottomContainer}
          onPress={() => navigation.navigate("NotiveAI_Speaking")}
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
                style={styles.starImage}
                resizeMode="contain"
              />
              <Text style={styles.notiveAiText}>NotiveAI</Text>
            </View>
            <View style={styles.actionButton}>
              <Image
                source={require("../../../assets/recording.png")}
                style={styles.recordingImage}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
        onPress={handleSaveNote}
        disabled={isSaving}
      >
        {isSaving ? (
          <View style={styles.loadingContainer}>
            <View style={styles.buttonSpinner} />
            <Text style={styles.loadingText}>Saving...</Text>
          </View>
        ) : (
                          <Text style={styles.saveButtonText}>
                  {currentFileId ? 'Update File' : 'Save to Folder'}
                </Text>
        )}
      </TouchableOpacity>
      

    </View>
  );
};

export default Make_Notes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    paddingTop: scaleHeight(40),
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    paddingVertical: scaleHeight(25),
    paddingHorizontal: scaleWidth(15),
    borderWidth: scaleWidth(1),
    borderColor: "#EFEFEF",
    borderRadius: scaleWidth(16),
    backgroundColor: "#FCFCFC",
    alignSelf: "center",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewingModeIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: scaleWidth(10),
  },
  iconButton: {
    marginHorizontal: scaleWidth(8),
  },
  activeIcon: {
    backgroundColor: "#FFFFFF1A",
    borderRadius: scaleWidth(8),
    padding: scaleWidth(4),
  },
  notesContainer: {
    marginTop: scaleHeight(15),
    width: "90%",
    borderWidth: scaleWidth(1),
    borderColor: "#EFEFEF",
    borderRadius: scaleWidth(16),
    backgroundColor: "#FFFFFF",
    padding: scaleWidth(15),
    flex: 1,
    maxHeight: "85%",
    alignSelf: "center",
  },
  rotatedIcon: {
    transform: [{ rotate: "-45deg" }],
  },
  timestamp: {
    fontSize: scaleFont(14),
    color: "#6F767E8C",
    marginTop: scaleHeight(10),
    marginBottom: scaleHeight(15),
    textAlign: "center",
    fontWeight: "600",
  },
  boldText: {
    color: "#6F767E",
  },
  titleInput: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#141718",
    paddingVertical: scaleHeight(5),
    fontFamily: "inter",
  },
  divider: {
    height: scaleHeight(1),
    backgroundColor: "#1212121A",
    marginVertical: scaleHeight(15),
  },
  input: {
    fontSize: scaleFont(16),
    color: "#09090B",
    textAlignVertical: "top",
    fontFamily: "inter",
    fontWeight: "400",
    paddingVertical: scaleHeight(10),
    paddingHorizontal: scaleWidth(15),
    backgroundColor: "white",
    minHeight: scaleHeight(200),
    marginBottom: scaleHeight(15),
  },
  mediaContainer: {
    width: "100%",
    marginVertical: scaleHeight(5),
    alignItems: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: scaleHeight(40),
    alignSelf: "center",
  },
  gradientButton: {
    width: scaleWidth(300),
    height: scaleHeight(60),
    borderRadius: scaleWidth(80),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scaleWidth(20),
  },
  innerRectangle: {
    width: scaleWidth(200),
    height: scaleHeight(50),
    backgroundColor: "black",
    borderRadius: scaleWidth(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaleWidth(15),
    right: scaleWidth(15),
  },
  starImage: {
    width: scaleWidth(20),
    height: scaleWidth(20),
    marginRight: scaleWidth(6),
  },
  notiveAiText: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    color: "white",
    fontFamily: "inter",
  },

  actionButton: {
    // Additional styling if needed
  },
  recordingImage: {
    width: scaleWidth(25),
    height: scaleWidth(25),
    tintColor: "black",
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8246FB',
    padding: 15,
    borderRadius: 50,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    marginRight: 8,
  },
  loadingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#f3f3f3',
    borderTopColor: '#8246FB',
    marginBottom: 15,
  },
  roundSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#f3f3f3',
    borderTopColor: '#8246FB',
  },
  loadingModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    paddingHorizontal: scaleWidth(10),
    marginTop: scaleHeight(15),
    marginBottom: scaleHeight(25),
    alignSelf: 'center',
  },
  actionButtonBox: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: scaleWidth(12),
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleWidth(8),
    marginHorizontal: scaleWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scaleHeight(80),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: scaleFont(12),
    fontWeight: '500',
    color: '#6F767E',
    marginTop: scaleHeight(8),
    textAlign: 'center',
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
  notesContainer: {
    borderColor: "#1A1D1F",
    backgroundColor: "#1A1D1F",
  },
  timestamp: {
    color: "#6F767E8C",
  },
  boldText: {
    color: "#6F767E",
  },
  titleInput: {
    color: "white",
  },
  divider: {
    backgroundColor: "#FFFFFF1A",
  },
  input: {
    color: "#FFFFFF",
    backgroundColor: "#1A1D1F",
  },
  actionButtonsContainer: {
    backgroundColor: 'transparent',
  },
  actionButtonBox: {
    backgroundColor: "#2A2D2F",
    borderColor: "#3A3D3F",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: "#9CA3AF",
  },
});