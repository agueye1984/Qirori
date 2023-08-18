import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'
import { useTheme } from '../contexts/theme'
import { ForgotPasswordScreen, HomeScreen, LoginScreen, RegisterScreen, SplashScreen } from '../screens'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { Events } from '../screens/Events'
import { Invitations } from '../screens/Invitations'
import { Contributions } from '../screens/Contributions'
import { Settings } from '../screens/Settings'
import TermsScreen from '../screens/TermsScreen'
import { Ventes } from '../screens/Ventes'
import { Achats } from '../screens/Achats'
import { AddEvent } from '../screens/AddEvent'
import { EventDetails } from '../screens/EventDetails'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/SimpleLineIcons'


const RootStack = () => {
  const { t } = useTranslation()
  const Stack = createStackNavigator()
  const { ColorPallet } = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: ColorPallet.primary,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={BottomNav}
      />
       <Stack.Screen
        name="TermsScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={TermsScreen}
      />
      <Stack.Screen
        name="Achats"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Achats}
      />
      <Stack.Screen
        name="Ventes"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Ventes}
      />
      <Stack.Screen
        name="AddEvent"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddEvent}
      />
      <Stack.Screen
        name="EventDetails"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={EventDetails}
      />
    </Stack.Navigator>

  )
}

const BottomNav = () => {
  const Tab = createBottomTabNavigator()
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const styles = DefaultComponentsThemes()

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        header: () => null,
        tabBarLabelStyle: {
          fontSize: 12,
          position: 'relative',
          textAlignVertical: 'center',
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          title: t('Screens.Home') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon
                style={styles.tabBarIcone}
                name={'home'}
                color={focused ? ColorPallet.primary : ColorPallet.lightGray}
                size={20}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Events'}
        component={Events}
        options={{
          title: t('Screens.Events') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon1
                style={styles.tabBarIcone}
                name={'event'}
                color={focused ? ColorPallet.primary : ColorPallet.lightGray}
                size={20}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Invitations'}
        component={Invitations}
        options={{
          title: t('Screens.Invitations') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon2
                style={styles.tabBarIcone}
                name={'envelope-letter'}
                color={focused ? ColorPallet.primary : ColorPallet.lightGray}
                size={20}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Contributions'}
        component={Contributions}
        options={{
          title: t('Screens.Contributions') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon
                style={styles.tabBarIcone}
                name={'money'}
                color={focused ? ColorPallet.primary : ColorPallet.lightGray}
                size={20}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Settings'}
        component={Settings}
        options={{
          title: t('Screens.Settings') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon
                style={styles.tabBarIcone}
                name={'ellipsis-h'}
                color={focused ? ColorPallet.primary : ColorPallet.lightGray}
                size={20}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default RootStack
