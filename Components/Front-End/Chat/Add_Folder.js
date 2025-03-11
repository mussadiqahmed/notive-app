import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import { useDarkMode } from '../Settings/DarkModeContext'; // Import the custom hook


const { width, height } = Dimensions.get("window");

// Icon categories with libraries
const folderIcons = [
  { name: "folder", library: MaterialCommunityIcons },
  { name: "folder", library: Feather },
  { name: "folder-outline", library: MaterialCommunityIcons },
  { name: "file", library: MaterialCommunityIcons },
  { name: "file-text", library: Feather },
  { name: "file-o", library: FontAwesome },
  { name: "star", library: Feather },
  { name: "heart", library: FontAwesome },
  { name: "bookmark", library: FontAwesome },
  { name: "camera", library: Feather },
  { name: "video", library: Feather },
  { name: "music", library: Feather },
  { name: "note", library: MaterialCommunityIcons },
  { name: "laptop", library: MaterialCommunityIcons },
  { name: "movie", library: MaterialCommunityIcons },
];

/** Icon Picker Component */
const IconPicker = ({ selectedIcon, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
 const { isDarkMode } = useDarkMode(); // Access dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, dynamicStyles.label]}>Icon</Text>
        <TouchableOpacity
          style={[styles.iconSelector, dynamicStyles.iconSelector]}
          onPress={() => setModalVisible(true)}
        >
          {selectedIcon.library && (
            <selectedIcon.library name={selectedIcon.name} size={width * 0.07} color={isDarkMode ? "white" : "black"} />
          )}
          <TextInput
            style={[styles.iconText, dynamicStyles.iconText]}
            value={selectedIcon.name}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      {/* Icon Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, dynamicStyles.modalOverlay]}>
          <View style={[styles.modalContent, dynamicStyles.modalContent]}>
            <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>Select Folder Icon</Text>
            <ScrollView contentContainerStyle={styles.iconGrid}>
              {folderIcons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.iconItem, dynamicStyles.iconItem]}
                  onPress={() => {
                    onSelect(icon);
                    setModalVisible(false);
                  }}
                >
                  <icon.library name={icon.name} size={width * 0.08} color={isDarkMode ? "white" : "black"} />
                  <Text style={[styles.iconLabel, dynamicStyles.iconLabel]}>{icon.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={[styles.closeButton, dynamicStyles.closeButton]} onPress={() => setModalVisible(false)}>
              <Text style={[styles.closeButtonText, dynamicStyles.closeButtonText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const Add_Folder = ({navigation}) => {
  const [folderName, setFolderName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(folderIcons[0]);
  const { isDarkMode } = useDarkMode(); // Access dark mode state
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;

  const handleSave = () => {
    if (!folderName.trim()) {
      Toast.show({
        type: "error",
        text1: "Folder Name Required",
        text2: "Please Enter a Folder Name Before Saving.",
        topOffset: height * 0.065,
      });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Folder Created",
      text2: `Folder "${folderName}" Added Successfully!`,
      topOffset: height * 0.065,
    });
    setFolderName("");
  };

  const handleCancel = () => {
    setFolderName("");
    Toast.show({
      type: "info",
      text1: "Action Cancelled",
      text2: "Folder creation was cancelled.",
      topOffset: height * 0.065,
    });
  };
  

  return (
    
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}
          onPress={() => navigation.navigate("Navbar")}
>
            <MaterialCommunityIcons name="arrow-left" size={width * 0.065} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.text, dynamicStyles.text]}>Add Folder</Text>
        </View>
      </View>

      {/* Folder Details */}
      <View style={[styles.inputRectangle, dynamicStyles.inputRectangle]}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, dynamicStyles.label]}>Name</Text>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            placeholder="Enter Folder Name"
            placeholderTextColor="#999"
            value={folderName}
            onChangeText={setFolderName}
          />
        </View>
        <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />

        <View style={[styles.buttonContainer]}>
        <TouchableOpacity style={[styles.cancelButton, dynamicStyles.cancelButton]} onPress={handleCancel}>
          <Text style={[styles.CancelbuttonText, dynamicStyles.CancelbuttonText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.SavebuttonText}>Save Folder</Text>
        </TouchableOpacity>
      </View>

      </View>

      
      {/* Toast Notification Component */}
      <Toast />
    </View>
  );
};

export default Add_Folder;

/** ✅ Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    paddingTop: height * 0.05,
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
    marginTop: height * 0.015,
  },
 
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  text: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "black",
    paddingLeft: width*0.03,
  },

  inputRectangle: {
    width: width * 0.9,
    height: height * 0.83,
    backgroundColor: "#FCFCFC",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    paddingVertical: height * 0.03,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  input: {
    width: "100%",
    height: height * 0.06,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: "#333",
    backgroundColor: "#FFF",
  },

  buttonContainer: {
    flexDirection: "row",
  justifyContent: "space-around",  // Reduces space between buttons
  width: width * 0.8,  // Reduce the width to bring buttons closer
  marginTop: height * 0.03,
  },

  cancelButton: {
    width: width * 0.3,  
    borderColor: "#E8ECEF",
    paddingVertical: height * 0.02,
    borderRadius: 50,
    borderWidth:2,
    alignItems: "center",
    
  },
  saveButton: {
    width: width * 0.40, 
    backgroundColor: "#8246FB",
    paddingVertical: height * 0.02,
    borderRadius: 50,
    alignItems: "center",
  },
  CancelbuttonText: {
    color: "black",
    fontSize: width * 0.040,
    fontWeight: "800",
    fontFamily:'inter'
  },
  SavebuttonText: {
    color: "#FFF",
    fontSize: width * 0.045,
    fontWeight: "800",
    fontFamily:'inter'
  },

  inputGroup: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginBottom: height * 0.008,
  },
  input: {
    width: "100%",
    height: height * 0.075,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: "#333",
    backgroundColor: "#FFF",
  },
  iconSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: height * 0.010,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  iconText: {
    marginLeft: width * 0.03,
    fontSize: width * 0.045,
    color: "#333",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    height: height * 0.9,  // Make modal cover 80% of screen height

    backgroundColor: "#FFF",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "700",
    color: "#333",
    marginBottom: height * 0.02,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconItem: {
    width: width * 0.22,
    height: width * 0.22,
    justifyContent: "center",
    alignItems: "center",
    margin: width * 0.02,
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
  },
  iconLabel: {
    fontSize: width * 0.03,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  closeButton: {
    marginTop: height * 0.02,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 8,
    backgroundColor: "#333",
    borderWidth:2
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});


const darkModeStyles = {
  container: {
    backgroundColor: "#111315",
  },
  rectangle: {
    borderColor: "#1A1D1F",
    backgroundColor: "#1A1D1F",
  },
  inputRectangle: {
    borderColor: "#1A1D1F",
    backgroundColor: "#1A1D1F",
  },
  text: {
    color: "white",
  },

  label: {
    color: "white",
  },
 
  input: {
    borderColor: "#272B30",
    color: "#5D6267",
    backgroundColor: "#1A1D1F",
  },

  cancelButton: {
    borderColor: "#272B30",
      
  },

  CancelbuttonText: {
    color: "white",
  },


  iconSelector: {
    borderColor: "#272B30",
    backgroundColor: "#1A1D1F",
  },
  iconText: {
    color: "#5D6267",
  },
  modalOverlay: {
    backgroundColor: "#111315",
  },
  modalContent: {
       backgroundColor: "#1A1D1F",
  },
  modalTitle: {
    color: "white",
  },
  iconItem: {
    backgroundColor: "#1A1D1F",
  },
  iconLabel: {
    color: "white",
  },
  closeButton: {
    backgroundColor: "#1A1D1F",
    borderColor: "#272B30"
  },
  closeButtonText: {
    color: "#FFF",
  },
};
