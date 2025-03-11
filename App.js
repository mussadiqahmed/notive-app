import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DarkModeProvider } from './Components/Front-End/Settings/DarkModeContext'; // Import the provider

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
import Change_Password from './Components/Front-End/Settings/Change_Password';
import NotiveAI_Speaking from './Components/Front-End/Chat/NotiveAI_Speaking';
import Add_Folder from './Components/Front-End/Chat/Add_Folder';
import SignIn from './Components/Front-End/SignIn/SignIn';
import Thanks from './Components/Front-End/SignIn/Thanks';
import sample from './Components/Front-End/Chat/sample';

const Stack = createStackNavigator();

const App = () => {
  return (
    <DarkModeProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Define all your routes here */}
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Thanks" component={Thanks} />
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
        <Stack.Screen name="Sample" component={sample} />
      </Stack.Navigator>
    </NavigationContainer>
    </DarkModeProvider>
  );
};

export default App;
