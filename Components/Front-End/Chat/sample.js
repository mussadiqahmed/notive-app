import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import NoteMedia from "./NoteMedia";
import { useActionSheet } from "@expo/react-native-action-sheet";

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Make_Notes = () => {
  const [title, setTitle] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [isBulletMode, setIsBulletMode] = useState(false);
  const [isNumberMode, setIsNumberMode] = useState(false);
  const [numberCount, setNumberCount] = useState(1);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [content, setContent] = useState([{ type: "text", value: "" }]); // Holds both text and media
  const [cursorIndex, setCursorIndex] = useState(0); // Track cursor position
  const [cursorPosition, setCursorPosition] = useState(0);
  const [textHeights, setTextHeights] = useState({});
  const [inputHeight, setInputHeight] = useState(height * 0.3); // Default height

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
    setContent((prevContent) => {
      const updatedContent = [...prevContent];

      // Apply bullet/number formatting
      const formattedText = handleNoteChange(text);

      updatedContent[index] = {
        ...updatedContent[index],
        value: formattedText,
      };

      return updatedContent;
    });

    setCursorIndex(index); // Track which text block the cursor is in
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
        if (mediaIndex < updatedContent.length && updatedContent[mediaIndex]?.type === "text") {
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
      let result = await DocumentPicker.getDocumentAsync({ multiple: false });  // Single file selection
  
      console.log("Document Picker Result:", result);  // Log the entire result to check its structure
  
      if (result.assets && result.assets.length > 0) {
        const document = result.assets[0];  // Access the first document in the assets array
  
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

  const editNote = () => {
    alert("Edit functionality can be implemented here.");
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

  // Toggle Bullet List Mode
  const toggleBulletList = () => {
    setIsBulletMode((prev) => !prev);
    setIsNumberMode(false); // Disable number mode if bullets are enabled
  };

  // Toggle Numbered List Mode
  const toggleNumberedList = () => {
    setIsNumberMode((prev) => !prev);
    setIsBulletMode(false); // Disable bullet mode if numbers are enabled
    setNumberCount(1); // Reset number count when toggling
  };
  const handleNoteChange = (text) => {
    const lines = text.split("\n");
    let newLines = [];
    let currentNumber = numberCount;

    lines.forEach((line, index) => {
      let trimmedLine = line.trim();

      // Preserve existing bullets/numbers
      if (trimmedLine.startsWith("•") || /^\d+\./.test(trimmedLine)) {
        newLines.push(trimmedLine);
      } else if (index === lines.length - 1) {
        // Apply formatting **only to the latest line being written**
        if (isBulletMode) {
          newLines.push(`• ${trimmedLine}`);
        } else if (isNumberMode) {
          newLines.push(`${currentNumber}. ${trimmedLine}`);
          currentNumber++;
        } else {
          newLines.push(trimmedLine);
        }
      } else {
        newLines.push(trimmedLine); // Keep previous lines unchanged
      }
    });

    setNumberCount(currentNumber);
    return newLines.join("\n"); // Return formatted text
  };

  return (
    <View style={styles.container}>
      {/* Top Rectangle with Back Arrow and Icons */}
      <View style={styles.rectangle}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={width * 0.07} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={clearNote}>
            <Icon
              name="trash-can-outline"
              size={width * 0.07}
              color="#6F767E"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTitleCase}>
            <Icon
              name="format-letter-case"
              size={width * 0.08}
              color="#6F767E"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, isBulletMode && styles.activeIcon]}
            onPress={toggleBulletList}
          >
            <Icon
              name="format-list-bulleted"
              size={width * 0.07}
              color={isBulletMode ? "blue" : "#6F767E"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, isNumberMode && styles.activeIcon]}
            onPress={toggleNumberedList}
          >
            <Icon
              name="grid"
              size={width * 0.07}
              color={isNumberMode ? "blue" : "#6F767E"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={editNote}>
            <Icon
              name="square-edit-outline"
              size={width * 0.07}
              color="#6F767E"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMediaSelection}>
            <Icon name="attachment" size={30} color="#6F767E" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.notesContainer}>
        {/* Timestamp Display */}
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: height * 0.12 }} // Adds space for bottomContainer
        >
          {timestamp && (
            <Text style={styles.timestamp}>
              Created on{" "}
              <Text style={styles.boldText}>{timestamp.formattedDate}</Text> at{" "}
              <Text style={styles.boldText}>{timestamp.formattedTime}</Text>
            </Text>
          )}

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            placeholder="Enter title..."
            placeholderTextColor="#6F767E"
            value={title}
            onChangeText={(text) => setTitle(text)}
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Notes Input */}
          <ScrollView  style={{ flex: 1 }}>
            {content.map((item, index) => {
              if (item.type === "text") {
                return (
                  <TextInput
                  key={index}
                  style={[
                    styles.input, 
                    { 
                      height: textHeights[index] || 40,  // Use dynamic height for text content, but set default height of 40
                      minHeight: 40  // Ensure a minimum height is set for the input field
                    }
                  ]}
                  placeholder="Write your notes here..."
                  placeholderTextColor="#6F767E"
                  multiline
                  value={item.value}
                  onChangeText={(text) => handleTextChange(text, index)}
                  onSelectionChange={(event) => {
                    setCursorIndex(index);
                    setCursorPosition(event.nativeEvent.selection.start);
                  }}
                  onFocus={() => setCursorIndex(index)}
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
                // ✅ Render media as a separate row
                return (
                  <View key={item.id} style={styles.mediaContainer}>
                    <NoteMedia
                      media={item}
                      onRemove={() => removeMedia(item.id)}
                    />
                  </View>
                );
              }
            })}
          </ScrollView>
        </ScrollView>
      </View>
      {!isKeyboardVisible && (
        <View style={styles.bottomContainer}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <View style={styles.innerRectangle}>
              <Image
                source={require("../../../assets/stars.png")} // Adjust path as needed
                style={{
                  width: width * 0.06,
                  height: width * 0.06,
                  marginRight: 6,
                }}
                resizeMode="contain"
              />
              <Text style={styles.notiveAiText}>NotiveAI</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Image
                source={require("../../../assets/recording.png")} // Adjust path as needed
                style={{
                  width: width * 0.08,
                  height: width * 0.08,
                  tintColor: "black",
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default Make_Notes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  rectangle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.9,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: width * 0.02,
  },
  iconButton: {
    marginHorizontal: width * 0.025,
  },

  notesContainer: {
    flex: 1,
    marginTop: height * 0.02,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    padding: width * 0.04,
    minHeight: height * 0.5, // Adjusts height dynamically
    maxHeight: height * 0.88, // Prevents overflow on large screens
  },
  timestamp: {
    fontSize: width * 0.035,
    color: "#6F767E8C",
    marginTop: height * 0.015,
    marginBottom: height * 0.02,
    textAlign: "center",
    fontWeight: "600",
  },
  boldText: {
    color: "#6F767E",
  },
  titleInput: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#141718",
    paddingVertical: height * 0.005,
    fontFamily: "inter",
  },
  divider: {
    height: 1,
    backgroundColor: "#1212121A",
    marginVertical: height * 0.02,
  },
  input: {
    fontSize: width * 0.04,
    color: "#09090B",
    textAlignVertical: "top",
    fontFamily: "inter",
    fontWeight: "400",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f0f0f0",
    minHeight: height * 0.3,
  },

  mediaContainer: {
    width: "100%",
    marginVertical: 8, // Add spacing to separate from text
    alignItems: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: height * 0.05,
    alignSelf: "center",
  },

  gradientButton: {
    width: width * 0.8,
    height: height * 0.08,
    borderRadius: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
  },

  innerRectangle: {
    width: width * 0.6,
    height: height * 0.07,
    backgroundColor: "black",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15, // Adds spacing inside the rectangle
    right: 16,
  },

  notiveAiText: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "white",
    fontFamily: "inter",
  },
});
