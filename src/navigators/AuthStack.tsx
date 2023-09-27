import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { LoginScreen } from '../screens';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
      />
    </Stack.Navigator>
  );
};