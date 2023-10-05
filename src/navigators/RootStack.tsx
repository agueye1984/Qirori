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
import { InvitationsContacts } from '../screens/InvitationsContacts'
import { ContactsList } from '../screens/ContactsList'
import { EditEvent } from '../screens/EditEvent'
import { InvitationDetails } from '../screens/InvitationDetails'
import { ContributionsDetails } from '../screens/ContributionsDetails'
import { AddProduct } from '../screens/AddProduct'
import { Products } from '../screens/Products'
import { AddService } from '../screens/AddService'
import { Services } from '../screens/Services'
import { BuyProduct } from '../screens/BuyProduct'
import { ProductDetails } from '../screens/ProductDetails'
import { Cart } from '../screens/Cart'
import { Search } from '../screens/Search'
import { theme } from '../core/theme'
import { Checkout } from '../screens/Checkout'
import { Setting } from '../screens/Setting'
import { LanguageSetting } from '../screens/LanguageSetting'
import { ContactUs } from '../screens/ContactUs'
import { ContributionsList } from '../screens/ContributionsList'
import { InvitationsList } from '../screens/InvitationsList'
import ResetPassword from '../screens/ResetPassword'


const RootStack = () => {
  const { t } = useTranslation()
  const Stack = createStackNavigator()
  const { ColorPallet } = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
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
      <Stack.Screen
        name="InvitationsContacts"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={InvitationsContacts}
      />
      <Stack.Screen
        name="EditEvent"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={EditEvent}
      />
      <Stack.Screen
        name="InvitationDetails"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={InvitationDetails}
      />
      <Stack.Screen
        name="ContributionsDetails"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ContributionsDetails}
      />
      <Stack.Screen
        name="AddProduct"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddProduct}
      />
      <Stack.Screen
        name="Products"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Products}
      />
      <Stack.Screen
        name="AddService"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddService}
      />
      <Stack.Screen
        name="Services"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Services}
      />
      <Stack.Screen
        name="BuyProduct"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={BuyProduct}
      />
      <Stack.Screen
        name="ProductDetails"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ProductDetails}
      />
      <Stack.Screen
        name="Cart"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Cart}
      />
      <Stack.Screen
        name="Search"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Search}
      />    
      <Stack.Screen
        name="Checkout"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Checkout}
      />      
      <Stack.Screen
        name="ContactsList"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ContactsList}
      />      
      <Stack.Screen
        name="Setting"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Setting}
      />   
      <Stack.Screen
        name="LanguageSetting"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={LanguageSetting}
      />      
      <Stack.Screen
        name="ContactUs"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ContactUs}
      />  
      <Stack.Screen
        name="ContributionsList"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ContributionsList}
      />  
      <Stack.Screen
        name="InvitationsList"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={InvitationsList}
      />  
      <Stack.Screen
        name="ResetPassword"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ResetPassword}
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
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
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
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
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
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
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
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
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
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
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
