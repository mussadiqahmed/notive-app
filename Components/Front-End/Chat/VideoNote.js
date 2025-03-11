import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library"; // For saving to media library
import { Video } from "expo-av"; // For video playback

const { width } = Dimensions.get("window");

const VideoNote = ({ videoUri, onRemove }) => {
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false); // Track if the comment field should be visible

  // Function to handle download
  const handleDownload = async () => {
    try {
      // Request permissions to access the media library (for saving)
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission Denied", "Please grant media library access.");
        return;
      }

      // Ensure the file is a local URI (if it's from the gallery, it will be 'file://')
      const fileUri = videoUri; // Path to store the video in real storage (gallery)

      if (videoUri.startsWith("file://")) {
        // If the video URI is a local URI (picked from the gallery), save to real storage
        const asset = await MediaLibrary.createAssetAsync(fileUri);

        // Create an album (folder) named "Notive" inside DCIM, or add the video to it
        const album = await MediaLibrary.getAlbumAsync("Notive");

        if (album === null) {
          // If the "Notive" album doesn't exist, create it
          await MediaLibrary.createAlbumAsync("Notive", asset, false);
        } else {
          // If the album exists, just add the asset to it
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
        }

        // Show the success alert
        Alert.alert("Success", "Video saved to DCIM/Notive album.");
      } else {
        throw new Error("Invalid video URI.");
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
    // Handle saving the comment here
    setIsCommenting(false); // Hide the comment input after saving
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <Video
        source={{ uri: videoUri }}
        style={{
          width: width - 20,
          height: (width - 20) * 0.56, // Aspect ratio for videos (16:9)
          borderRadius: width * 0.05, // Rounded corners
        }}
        useNativeControls // Show native controls for video playback
        resizeMode="contain"
        isLooping={false} // You can make the video loop if needed
      />

      {/* Comment Input Field, only shown when isCommenting is true */}
      {isCommenting && (
        <TextInput
          style={styles.commentInput}
          value={comment}
          multiline
          onChangeText={setComment}
          placeholder="Enter comment..."
        />
      )}

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        {/* Download Button */}
        <TouchableOpacity onPress={handleDownload} style={styles.button}>
          <Icon name="arrow-down-circle" size={24} color="#6F767E" />
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity onPress={handleCommentPress} style={styles.button}>
          <Icon name="forum-outline" size={24} color="#6F767E" />
          <Text style={styles.buttonText}>{isCommenting ? "Save" : "Comment"}</Text>
        </TouchableOpacity>

        {/* Delete Button */}
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
  commentInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: width * 0.02,
    padding: width * 0.02,
    marginVertical: width * 0.02,
  },
});

export default VideoNote;
