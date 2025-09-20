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
import { useDarkMode } from '../Settings/DarkModeContext';
import { useFolders } from './FoldersContext';

const { width, height } = Dimensions.get("window");

// Calculate responsive sizes based on screen dimensions
const scale = size => (width / 375) * size;
const verticalScale = size => (height / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

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
  const { isDarkMode } = useDarkMode();
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
            <selectedIcon.library 
              name={selectedIcon.name} 
              size={moderateScale(24)} 
              color={isDarkMode ? "white" : "black"} 
            />
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
            <ScrollView 
              contentContainerStyle={styles.iconGrid}
              showsVerticalScrollIndicator={false}
            >
              {folderIcons.map((icon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.iconItem, dynamicStyles.iconItem]}
                  onPress={() => {
                    onSelect(icon);
                    setModalVisible(false);
                  }}
                >
                  <icon.library 
                    name={icon.name} 
                    size={moderateScale(26)} 
                    color={isDarkMode ? "white" : "black"} 
                  />
                  <Text style={[styles.iconLabel, dynamicStyles.iconLabel]}>{icon.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.closeButton, dynamicStyles.closeButton]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeButtonText, dynamicStyles.closeButtonText]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const Add_Folder = ({ navigation, route }) => {  // Added route to props
  const [folderName, setFolderName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(folderIcons[0]);
  const { isDarkMode } = useDarkMode();
  const dynamicStyles = isDarkMode ? darkModeStyles : styles;
  const { parentId } = route.params || {};
  const { addFolder } = useFolders();

  const handleSave = () => {
    if (!folderName.trim()) {
      Toast.show({
        type: "error",
        text1: "Folder Name Required",
        text2: "Please Enter a Folder Name Before Saving.",
        topOffset: verticalScale(40),
      });
      return;
    }
    
    addFolder({ 
      folderName, 
      selectedIcon: {
        name: selectedIcon.name,
        library: selectedIcon.library
      } 
    }, parentId);
    
    Toast.show({
      type: "success",
      text1: "Folder Created",
      text2: `Folder "${folderName}" Added Successfully!`,
      topOffset: verticalScale(40),
    });
    
    setFolderName("");
    navigation.goBack();
  };

  const handleCancel = () => {
    setFolderName("");
    Toast.show({
      type: "info",
      text1: "Action Cancelled",
      text2: "Folder creation was cancelled.",
      topOffset: verticalScale(40),
    });
  };
  
  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.rectangle, dynamicStyles.rectangle]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate("Navbar")}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={moderateScale(24)} 
              color={isDarkMode ? "white" : "black"} 
            />
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cancelButton, dynamicStyles.cancelButton]} 
            onPress={handleCancel}
          >
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

/** ✅ Responsive Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    paddingTop: verticalScale(40),
  },
  rectangle: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    paddingVertical: verticalScale(25),
    paddingLeft: moderateScale(10),
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FCFCFC",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "black",
    marginLeft: moderateScale(10),
  },
  inputRectangle: {
    width: "90%",
    flex: 1,
    alignSelf: "center",
    backgroundColor: "#FCFCFC",
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    paddingVertical: verticalScale(15),
    paddingHorizontal: moderateScale(15),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(10),
  },
  inputGroup: {
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: verticalScale(5),
  },
  input: {
    width: "100%",
    height: verticalScale(55),
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: moderateScale(12),
    fontSize: moderateScale(15),
    color: "#333",
    backgroundColor: "#FFF",
  },
  iconSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(10),
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  iconText: {
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: verticalScale(20),
  },
  cancelButton: {
    width: "45%",
    borderColor: "#E8ECEF",
    paddingVertical: verticalScale(12),
    borderRadius: 50,
    borderWidth: 2,
    alignItems: "center",
  },
  saveButton: {
    width: "45%",
    backgroundColor: "#8246FB",
    paddingVertical: verticalScale(12),
    borderRadius: 50,
    alignItems: "center",
  },
  CancelbuttonText: {
    color: "black",
    fontSize: moderateScale(15),
    fontWeight: "800",
    fontFamily: 'inter'
  },
  SavebuttonText: {
    color: "#FFF",
    fontSize: moderateScale(15),
    fontWeight: "800",
    fontFamily: 'inter'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#FFF",
    padding: moderateScale(15),
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#333",
    marginBottom: verticalScale(15),
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  iconItem: {
    width: moderateScale(80),
    height: moderateScale(80),
    justifyContent: "center",
    alignItems: "center",
    margin: moderateScale(5),
    borderRadius: 8,
    backgroundColor: "#F4F4F4",
  },
  iconLabel: {
    fontSize: moderateScale(12),
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  closeButton: {
    marginTop: verticalScale(15),
    paddingVertical: verticalScale(10),
    paddingHorizontal: moderateScale(30),
    borderRadius: 8,
    backgroundColor: "#333",
    borderWidth: 2
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: moderateScale(15),
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