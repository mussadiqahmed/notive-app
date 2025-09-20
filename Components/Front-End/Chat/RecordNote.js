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
import FileViewer from 'react-native-file-viewer'; // Import react-native-file-viewer

const { width } = Dimensions.get("window");

const DocumentNote = ({ document, onRemove }) => {
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

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
      // Check if the document exists at the given URI
      const fileInfo = await FileSystem.getInfoAsync(documentUri);
      
      if (!fileInfo.exists) {
        Alert.alert("Error", "The document could not be found.");
        return;
      }
  
      // Try to open the document with FileViewer
      FileViewer.open(documentUri)
        .then(() => {
          console.log('Document opened successfully');
        })
        .catch((err) => {
          console.error("Error opening file:", err);
          Alert.alert("Error", "Could not open the document: " + err);
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
            style={styles.documentIcon}
          />
          <Text style={styles.documentName}>{name}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.documentName}>No document selected</Text>
      )}

      {isCommenting && (
        <TextInput
          style={styles.commentInput}
          value={comment}
          multiline
          onChangeText={setComment}
          placeholder="Enter comment..."
        />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleDownload} style={styles.button}>
          <Icon name="arrow-down-circle" size={24} color="#6F767E" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Icon name="forum-outline" size={24} color="#6F767E" />
          <Text style={styles.buttonText}>{isCommenting ? "Save" : "Comment"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onRemove} style={styles.button}>
          <Icon name="trash-can-outline" size={24} color="#F44336" />
          <Text style={styles.buttonDelText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: width * 0.02,
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
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: width * 0.02,
    padding: width * 0.02,
    marginVertical: width * 0.02,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: width * 0.02,
    alignSelf: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: width * 0.02,
    borderRadius: width * 0.02,
    marginHorizontal: width * 0.015,
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

export default DocumentNote;
