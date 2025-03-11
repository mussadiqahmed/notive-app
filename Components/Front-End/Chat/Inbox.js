import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TextInput,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const gradientColors = ["#6340FF", "#FF40C6", "#FF8040"];

const Inbox = () => {
  const [activeTab, setActiveTab] = useState(null); // Tracks active section
  const [showNotes, setShowNotes] = useState(false);
  const [expandedNote, setExpandedNote] = useState(null);

  const notesData = [
    {
      id: "note1",
      title: "Shopping List",
      content: "Buy groceries, milk, and eggs.",
    },
    {
      id: "note2",
      title: "Project Plan",
      content: "Complete UI design and API integration.",
    },
    {
      id: "note3",
      title: "Weather Project",
      content: "Complete Weather UI design and API integration.",
    },
  ];

  const conversationTitles = [
    "Growth Through Structured Exploration",
    "3D Solutions and Entrepreneurship",
    "Getting Involved in CBT",
    "AI a vállalkozásoknak",
    "Conversion Funnel Optimization Tips",
    "Website Conversion Strategies",
    "AI alkalmazás előnyei",
    "No-code Tools Revolution",
    "Books for Child Healing",
    "How to Stop Nosebleed",
    "Productive Weekend Time Ideas",
    "Time Calculation Inquiry",
    "Виды поста в Библии",
    "Результаты поста в Библии",
    "Виды поста и духовность",
    "Виды поста и его значимость",
    "Типы поста и цели",
    "Preaching Topics for Youth",
    "Video Summary Request",
    "Evolutionary Pleasure of Senses",
    "Visa date calculation",
    "Betamethasone and Viral Pneumonia",
    "Framer Masterclass Overview",
    "Payment Reminder Message",
    "Medication Information Bentelan",
    "Web Design Masterclass Promotion"
  ];
  
  

  const toggleNote = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };
  return (
    <View style={styles.container}>
      {/* Top Rectangle with Back Arrow, Inbox Text, and Clipboard Image */}
      <View style={styles.rectangle}>
        <View style={styles.leftContainer}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={width * 0.07} color="black" />
          </TouchableOpacity>
          <Text style={styles.text}>Inbox</Text>
        </View>

        <TouchableOpacity style={styles.clipboardButton}>
          <Image
            source={require("../../../assets/Clipboard.png")} // Ensure correct path
            style={styles.clipboardImage}
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar Rectangle */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon
            name="magnify"
            size={width * 0.07}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Quick Search"
            placeholderTextColor="#888"
          />
        </View>

        {/* Divider Inside the Search Box Container (Below Search Bar) */}
        <View style={styles.divider} />

        {/* Notes and Conversations Buttons */}
        <View style={styles.notesConvoContainer}>
          <TouchableOpacity
            style={[
              styles.notesButton,
              activeTab === "Notes" && styles.activeTab,
            ]}
            onPress={() => setActiveTab(activeTab === "Notes" ? null : "Notes")}
          >
            <Text
              style={[
                styles.notesButtonText,
                activeTab === "Notes" && { color: "black" },
              ]}
            >
              Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.conversationsButton,
              activeTab === "Conversations" && styles.activeTab,
            ]}
            onPress={() =>
              setActiveTab(
                activeTab === "Conversations" ? null : "Conversations"
              )
            }
          >
            <Text
              style={[
                styles.conversationsText,
                activeTab === "Conversations" && { color: "black" },
              ]}
            >
              Conversations
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Notes" && (
          <View>
            {/* Pinned Notes Section */}
              <View>
                <View style={styles.pinnedContainer}>
                  <Icon
                    name="pin"
                    size={width * 0.06}
                    color="#888"
                    marginTop="8"
                  />
                  <Text style={styles.pinnedText}>Pinned</Text>
                </View>

                <TouchableOpacity
                  style={styles.notesContainer}
                  onPress={() => toggleNote("notes")}
                >
                  <View
                    style={[
                      styles.notesContent,
                      expandedNote === "notes" && styles.notesBox,
                    ]}
                  >
                    <Text style={styles.notesHeader}>Notes</Text>
                    <Text
                      style={styles.notesText}
                      numberOfLines={expandedNote === "notes" ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      I hate you and I will kill you. Watch it! Do you want to
                      die by my hand.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.notesContainer}
                  onPress={() => toggleNote("ielts")}
                >
                  <View
                    style={[
                      styles.notesContent,
                      expandedNote === "ielts" && styles.notesBox,
                    ]}
                  >
                    <Text style={styles.notesHeader}>IELTS</Text>
                    <Text
                      style={styles.notesText}
                      numberOfLines={expandedNote === "ielts" ? undefined : 2}
                      ellipsizeMode="tail"
                    >
                      I am preparing for IELTS to go abroad for higher education
                      and to find more opportunities.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

             
             <View>
                <Text style={styles.allNotesHeader}>All Notes</Text>
                {notesData.slice(0, 3).map((note, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.notesContainer}
                    onPress={() => toggleNote(note.id)}
                  >
                    <View
                      style={[
                        styles.notesContent,
                        expandedNote === note.id && styles.notesBox,
                      ]}
                    >
                      <Text style={styles.notesHeader}>{note.title}</Text>
                      <Text
                        style={styles.notesText}
                        numberOfLines={expandedNote === note.id ? undefined : 2}
                        ellipsizeMode="tail"
                      >
                        {note.content}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
           
          </View>
        )}

<View style={{ flex: 1 }}> 
  {activeTab === "Conversations" && (
    <View style={styles.contentBox}>
      <Text style={styles.allNotesHeader}>Previous 30 days</Text>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={true} 
        contentContainerStyle={{ paddingBottom: 140 }} // Prevent overlap with bottomContainer
      >
        {conversationTitles.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={styles.notesContainer}
            onPress={() => toggleNote(index)} // Using index as ID
          >
            <View
              style={[
                styles.notesContent,
                expandedNote === index && styles.notesBox, // Apply expanded style
              ]}
            >
              <Text style={styles.convoHeader}>{title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )}

  {/* Bottom Container Stays at the Bottom */}
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
</View>

</View>
</View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    marginTop: height * 0.05,
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
  backButton: {
    marginRight: width * 0.02,
  },
  text: {
    fontSize: width * 0.06,
    fontWeight: "700",
    color: "black",
    fontFamily: "Inter",
  },
  clipboardButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  clipboardImage: {
    width: width * 0.07,
    height: width * 0.07,
    resizeMode: "contain",
  },
  searchContainer: {
    flex:1,
    width: width * 0.9,
    marginTop: height * 0.01,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingBottom: height * 0.015,
    maxHeight: height*0.88,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
  },
  searchIcon: {
    marginRight: width * 0.02,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.045,
    color: "#333",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#D9D9D9",
  },
  notesConvoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: height * 0.01,
    alignSelf: "center", // Centers it horizontally
    paddingVertical: height * 0.003,
    paddingHorizontal: width * 0.02,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 16,
    backgroundColor: "#F4F4F4",
  },
  notesButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: height * 0.015,
  },
  conversationsButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: height * 0.015,
  },

  conversationsText: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#6F767E",
    fontFamily: "inter",
  },
  notesButtonText: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: "#6F767E",
    fontFamily: "inter",
  },
  activeTab: {
    backgroundColor: "#FCFCFC", // Highlights the selected tab
    borderRadius: 10,
  },
  contentBox: {
    width: width * 0.9,
    backgroundColor: "#FFFFFF", //Conservation
    alignSelf: "center",
  },
  pinnedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
  },
  pinnedText: {
    fontSize: width * 0.045,
    color: "#33383F",
    marginLeft: width * 0.02,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  notesContainer: {
    width: "90%",
    alignSelf: "center",
  },
  notesContent: {
    paddingHorizontal: width * 0.02, // Reduce padding
    paddingVertical: height * 0.01,
  },
  notesBox: {
    backgroundColor: "#FCFCFC", // Only applies when clicked
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  notesHeader: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#333",
  },
  notesText: {
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#444",
    fontFamily: "inter",
    paddingVertical: 8,
    lineHeight: height * 0.03,
    width: "100%",
    flexWrap: "nowrap", // Prevents breaking text
  },

  allNotesHeader: {
    fontSize: width * 0.045,
    color: "#33383F",
    marginLeft: width * 0.02,
    fontWeight: "700",
    fontFamily: "Inter",
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
  bottomContainer: {
    position: "absolute",
    bottom: height * 0.00,
    alignSelf: "center",
    marginTop: height*0.05
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

  convoHeader: {
    fontSize: width * 0.04,
    color: "#1A1D1F",
    fontFamily: 'inter'
  },
});
