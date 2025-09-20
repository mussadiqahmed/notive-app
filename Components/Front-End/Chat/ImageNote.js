import React, { useState } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDarkMode } from "../Settings/DarkModeContext";

const { width, height} = Dimensions.get("window");

const ImageNote = ({ imageUri, onRemove }) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isCommenting, setIsCommenting] = useState(false);
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const handleDownload = () => {
    // Download functionality can be implemented here
    console.log('Download image:', imageUri);
  };

  const handleCommentPress = () => {
    setIsCommenting(!isCommenting);
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: imageUri }}
        style={{
          width: width - 20,
          height: (width - 20) / aspectRatio,
          resizeMode: "contain",
          borderRadius: width * 0.05, // Rounded corners
        }}
        onLoad={(event) => {
          const { width: imgWidth, height: imgHeight } = event.nativeEvent.source;
          setAspectRatio(imgWidth / imgHeight);
        }}
      />



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
export default ImageNote;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#333",
  },
  buttonDelText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#F44336",
  },
});

const darkModeStyles = StyleSheet.create({
  button: {
    backgroundColor: "#2A2D2F",
  },
  buttonText: {
    color: "#fff",
  },
});


