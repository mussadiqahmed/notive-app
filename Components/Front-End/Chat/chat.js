

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
      paddingLeft: width * 0.03,
    },
    inputRectangle: {
      width: width * 0.9,
      height: height * 0.75,
      backgroundColor: "#FCFCFC",
      borderWidth: 1,
      borderColor: "#EFEFEF",
      borderRadius: 16,
      paddingVertical: height * 0.03,
      paddingHorizontal: width * 0.05,
      marginTop: height * 0.02,
    },
  
    messageContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: height * 0.04,
    },
    chatbotMessageContainer: {
      flexDirection: "row",
      borderRadius: 10,
      alignItems: "flex-start",
    },
    AvatarImage: {
      width: width * 0.09,
      height: width * 0.09,
      borderRadius: 30,
      backgroundColor: "#BBCEC5",
      marginRight: width * 0.03,
    },
    question: {
      fontSize: width * 0.04,
      color: "#6F767E",
      fontWeight: "500",
      flexShrink: 1,
    },
    gradientInbox: {
      width: width * 0.09,
      height: width * 0.09,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginRight: width * 0.02,
      marginTop: 5,
    },
    StarImage: {
      width: width * 0.05,
      height: width * 0.05,
    },
    response: {
      fontSize: width * 0.035,
      color: "#1A1D1F",
      fontWeight: "500",
      flexShrink: 1,
      alignSelf: "flex-start",
      lineHeight: width * 0.05,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: width * 0.9,
      backgroundColor: "#FCFCFC",
      borderRadius: 16,
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.015,
      marginBottom: height * 0.01, // Moves it up a bit if hidden
      borderWidth: 1,
      borderColor: "#EFEFEF",
    },
    inputImage: {
      width: width * 0.07,
      height: width * 0.07,
      borderRadius: 20,
      backgroundColor: "#BBCEC5",
      marginRight: width * 0.03,
    },
  
    IconImage: {
      width: width * 0.07,
      height: width * 0.07,
      borderRadius: 20,
      marginRight: width * 0.03,
    },
    input: {
      flex: 1,
      fontSize: width * 0.04,
      color: "#1A1D1F",
    },
    sendButton: {
      backgroundColor: "#6340FF",
      padding: width * 0.025,
      borderRadius: 30,
    },
  });
  