import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDarkMode } from "../Settings/DarkModeContext"; // Import the custom hook

const { width, height } = Dimensions.get("window");

const DocumentNote = ({ document, onRemove }) => {
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  // Fallback to empty object if document is undefined
  const { name = "No Name", uri = "", mimeType = "application/octet-stream", size = 0 } = document || {}; 

  // Function to handle download
  const handleDownload = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission Denied", "Please grant media library access.");
        return;
      }

      if (uri) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync("Notive");

        if (album === null) {
          await MediaLibrary.createAlbumAsync("Notive", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        }

        Alert.alert("Success", "Document saved to DCIM/Notive album.");
      } else {
        throw new Error("Invalid document URI.");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download Failed", "Something went wrong while downloading.");
    }
  };

  const handleCommentPress = () => {
    setIsCommenting(!isCommenting); // Toggle the comment input visibility
  };

  const handleSaveComment = () => {
    setIsCommenting(false); // Hide the comment input after saving
  };

  // This function is called after selecting a document.
  const handleDocumentSelection = async (result) => {
    try {
      if (result.type === 'success') {
        const { uri, name } = result;

        if (typeof uri !== 'string') {
          console.error("Invalid URI:", uri);
          Alert.alert("Error", "The document URI is not valid.");
          return;
        }

        // Define a permanent location for the file in the document directory
        const documentPath = FileSystem.documentDirectory + name;

        // Check if the file exists in the cache (the URI provided by DocumentPicker)
        const fileExists = await FileSystem.getInfoAsync(uri);
        if (fileExists.exists) {
          // Copy the file from the cache location to the permanent location
          await FileSystem.copyAsync({
            from: uri,
            to: documentPath,
          });

          console.log('File copied to:', documentPath);

          // Now, try to open the copied file using react-native-file-viewer
          openDocument(documentPath);
        } else {
          Alert.alert("Error", "File not found in cache.");
        }
      } else {
        Alert.alert("Error", "Document selection failed.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred while handling the document.");
    }
  };

  // Function to open the document using react-native-file-viewer
  const openDocument = async (documentUri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(documentUri);
    
    if (!fileInfo.exists) {
      Alert.alert("Error", "The document could not be found.");
      return;
    }

    // Use expo-sharing to open the document
    await Sharing.shareAsync(documentUri, {
      mimeType: mimeType, // Use the actual mimeType from your document
      UTI: mimeType // iOS-specific uniform type identifier
    });
  } catch (err) {
    console.error("Error opening document:", err);
    Alert.alert("Error", "Could not open the document.");
  }
};

  // Function to get the document type icon based on MIME type or file extension
  const getDocumentIcon = (mimeType) => {
    if (mimeType.includes("pdf")) {
      return "file-pdf";
    } else if (mimeType.includes("word") || mimeType.includes("msword")) {
      return "file-word";
    } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return "file-excel";
    } else if (mimeType.includes("image")) {
      return "image";
    } else if (mimeType.includes("text")) {
      return "file-document";
    } else {
      return "file";
    }
  };

  return (
    <View style={styles.container}>
      {document ? (
        <TouchableOpacity onPress={handleDocumentSelection} style={styles.documentContainer}>
          <Icon
            name={getDocumentIcon(mimeType)}
            size={40}
            color="#6F767E"
            style={[styles.documentIcon, dynamicStyles.documentIcon]}
          />
          <Text style={[styles.documentName, dynamicStyles.documentName]}>{name}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.documentName, dynamicStyles.documentName]}>No document selected</Text>
      )}

      {isCommenting && (
        <TextInput
          style={[styles.commentInput, dynamicStyles.commentInput]}
          value={comment}
          multiline
          onChangeText={setComment}
          placeholder="Enter comment..."
          placeholderTextColor={isDarkMode ? "#6F767E" : "black"}
        />
      )}

       {/* Buttons Row */}
            <View style={[styles.buttonRow, dynamicStyles.buttonRow]}>
              {/* Download Button */}
              <TouchableOpacity onPress={handleDownload} style={[styles.button, dynamicStyles.button]}>
                <Icon name="arrow-down-circle" size={24} color="#6F767E" />
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>Download</Text>
              </TouchableOpacity>
      
              {/* Comment Button */}
              <TouchableOpacity onPress={handleCommentPress} style={[styles.button, dynamicStyles.button]}>
                <Icon name="forum-outline" size={24} color="#6F767E" />
                <Text style={[styles.buttonText, dynamicStyles.buttonText]}>{isCommenting ? "Save" : "Comment"}</Text>
              </TouchableOpacity>
      
              {/* Delete Button */}
              <TouchableOpacity onPress={onRemove} style={[styles.button, dynamicStyles.button]}>
                <Icon name="trash-can-outline" size={24} color="#F44336" />
                <Text style={styles.buttonDelText}>Delete</Text>
              </TouchableOpacity>
            </View>
    </View>
  );
};
export default DocumentNote;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf:'flex-start',
    marginBottom: width * 0.02,
    paddingHorizontal: width * 0.05,

  },
  documentIcon: {
    marginRight: width * 0.03,
  },
  documentName: {
    fontSize: width * 0.04,
    fontFamily: "inter",
    fontWeight: "700",
    color: "#333",
    marginVertical: width * 0.02,
  },
  commentInput: {
    width: "100%",
    fontSize: width * 0.035,
    borderWidth: 2,
    fontWeight: '700',
    borderColor: "#E5E7EB",
    borderRadius: width * 0.02,
    padding: width * 0.02,
    marginVertical: width * 0.02,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: width * 0.02,
    borderRadius: width * 0.04,
    borderWidth:2,
    alignSelf: "center",
    backgroundColor:'#FCFCFC',
    borderColor:'#FCFCFC',
    paddingHorizontal: width * 0.04, // 4% of screen width
    paddingVertical: height * 0.015, // 1.5% of screen height
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingVertical: width * 0.02,
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.010,
    minWidth: 80,
  },
  buttonText: {
    fontSize: width * 0.03,
    fontFamily: "inter",
    fontWeight: "700",
    color: "#333",
    marginTop: width * 0.01,
  },
  buttonDelText: {
    fontSize: width * 0.03,
    fontFamily: "inter",
    fontWeight: "700",
    color: "red",
    marginTop: width * 0.01,
  },
});

const darkModeStyles = StyleSheet.create({
  buttonRow: {
    backgroundColor:'#101010',
    borderColor: '#FFFFFF1A'
  },
  button: {
    borderColor: "#1F2228",
  },
  buttonText: {
    color: "#6F767E",
  },
  commentInput: {
    borderColor: "#FFFFFF1A",
    color: "#6F767E"
  },
  documentName: {
    color: "white",
  },
  documentIcon:{
    color: 'white'
  }
});
