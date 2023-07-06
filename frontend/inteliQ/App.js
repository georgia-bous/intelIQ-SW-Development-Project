import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SearchQuestionnaire from './screens/SearchQuestionnaire';
import SeeResults from './screens/SeeResults';
import UserOrAdmin from './screens/UserOrAdmin';
import AnswerQuestionnaire from './screens/AnswerQuestionnaire';

const Stack = createNativeStackNavigator();

export default function App() {

  const MyStack = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            name="Answer"
            component={AnswerQuestionnaire}
          />
          <Stack.Screen
            name="UoA"
            component={UserOrAdmin}
          />



          <Stack.Screen
            name="SR"
            component={SeeResults}
            options={{ title: 'Results' }} />
          <Stack.Screen
            name="Questionnaires"
            component={SearchQuestionnaire}
          // backgoundColor={"red"}
          />




          {/* <Stack.Screen
            name="Upload"
            component={Upload} /> */}



        </Stack.Navigator>
      </NavigationContainer>
    );
  };




  return (
    <MyStack
    />
  );
};