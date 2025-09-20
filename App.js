import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { DarkModeProvider } from './Components/Front-End/Settings/DarkModeContext';
import { AuthProvider, useAuth } from './Components/Front-End/Auth/AuthContext';

// Import your components/screens
import Navbar from './Components/Front-End/Chat/Navbar';
import Inbox from './Components/Front-End/Chat/Inbox';
import Folder from './Components/Front-End/Chat/Add_Folder';
import Speaking from './Components/Front-End/Chat/NotiveAI_Speaking';
import Chatbot from './Components/Front-End/Chat/Chatbot';
import Make_Notes from './Components/Front-End/Chat/Make_Notes';
import Change_Pass from './Components/Front-End/Settings/Change_Password';
import Edit_Profile from './Components/Front-End/Settings/Edit_Profile';
import Appearance from './Components/Front-End/Settings/Appreance';
import AI_Voice from './Components/Front-End/Settings/AI_Voice';
import Billing from './Components/Front-End/Settings/Add_Billing';
import Logout from './Components/Front-End/Settings/Logout';
import Subscription from './Components/Front-End/Settings/Subscription';
import Summary from './Components/Front-End/Settings/Summary';
import Notification from './Components/Front-End/Settings/Notification';
import NotiveAI_Speaking from './Components/Front-End/Chat/NotiveAI_Speaking';
import Add_Folder from './Components/Front-End/Chat/Add_Folder';
import Home from './Components/Front-End/Chat/Home';
import SignIn from './Components/Front-End/SignIn/SignIn';
import SignUp from './Components/Front-End/SignIn/SignUp';
import Trail from './Components/Front-End/SignIn/Trail';
import Checkout from './Components/Front-End/SignIn/Checkout';
import Thanks from './Components/Front-End/SignIn/Thanks';
import { FoldersProvider } from './Components/Front-End/Chat/FoldersContext';

const Stack = createStackNavigator();

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6340FF" />
  </View>
);

// Navigation component that handles authentication state
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated screens
          <>
            <Stack.Screen name="Trail" component={Trail} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Navbar" component={Navbar} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="Folder" component={Folder} />
            <Stack.Screen name="Speaking" component={Speaking} />
            <Stack.Screen name="Chatbot" component={Chatbot} />
            <Stack.Screen name="Make_Notes" component={Make_Notes} />
            <Stack.Screen name="Change_Pass" component={Change_Pass} />
            <Stack.Screen name="Edit_Profile" component={Edit_Profile} />
            <Stack.Screen name="Appearance" component={Appearance} />
            <Stack.Screen name="AI_Voice" component={AI_Voice} />
            <Stack.Screen name="Billing" component={Billing} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="Subscription" component={Subscription} />
            <Stack.Screen name="Summary" component={Summary} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="NotiveAI_Speaking" component={NotiveAI_Speaking} />
            <Stack.Screen name="Add_Folder" component={Add_Folder} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Thanks" component={Thanks} />
          </>
        ) : (
          // Unauthenticated screens
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Trail" component={Trail} />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen name="Thanks" component={Thanks} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <FoldersProvider>
          <AppNavigator />
        </FoldersProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
});

export default App;
