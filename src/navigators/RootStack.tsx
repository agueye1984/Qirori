import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, Text, View} from 'react-native';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {Events} from '../screens/Events';
import {Invitations} from '../screens/Invitations';
import {Contributions} from '../screens/Contributions';
import {Settings} from '../screens/Settings';
import TermsScreen from '../screens/TermsScreen';
import {Ventes} from '../screens/Ventes';
import {Achats} from '../screens/Achats';
import {AddEvent} from '../screens/AddEvent';
import {EventDetails} from '../screens/EventDetails';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import {InvitationsContacts} from '../screens/InvitationsContacts';
import {ContactsList} from '../screens/ContactsList';
import {InvitationDetails} from '../screens/InvitationDetails';
import {ContributionsDetails} from '../screens/ContributionsDetails';
import {AddProduct} from '../screens/AddProduct';
import {Products} from '../screens/Products';
import {AddService} from '../screens/AddService';
import {Services} from '../screens/Services';
import {ProductDetails} from '../screens/ProductDetails';
import {Cart} from '../screens/Cart';
import {theme} from '../core/theme';
import {Checkout} from '../screens/Checkout';
import {Setting} from '../screens/Setting';
import {LanguageSetting} from '../screens/LanguageSetting';
import {ContactUs} from '../screens/ContactUs';
import {ContributionsList} from '../screens/ContributionsList';
import {InvitationsList} from '../screens/InvitationsList';
import ResetPassword from '../screens/ResetPassword';
import {ProductOrderings} from '../screens/ProductOrderings';
import {ProductDelivering} from '../screens/ProductDelivering';
import {ServicesOffertsList} from '../screens/ServicesOffertsList';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import {DeviseSetting} from '../screens/DeviseSetting';
import {CountrySetting} from '../screens/CountrySetting';
import {CommandesEffectuees} from '../screens/CommandesEffectuees';
import {ServiceDetails} from '../screens/ServiceDetails';
import {EditPanier} from '../screens/EditPanier';
import {TypeEvents} from '../screens/TypeEvents';
import {AddTypeEvent} from '../screens/AddTypeEvent';
import OTPAuthScreen from '../screens/OTPAuthScreen';
import OTPForgotPwdScreen from '../screens/OTPForgotPwdScreen';
import Dashboard from '../screens/Dashboard';
import Dashboards from '../screens/Dashboards';
import ManageProducts from '../screens/ManageProducts';
import Users from '../screens/Users';
import Administrators from '../screens/Administrators';
import AddAdmin from '../screens/AddAdmin';
import TermsVendor from '../screens/TermsVendor';
import RatingScreen from '../screens/RatingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ManageCategories from '../screens/ManageCategories';
import {AddCategory} from '../screens/AddCategory';
import ManageTypeOffres from '../screens/ManageTypeOffres';
import {AddTypeOffre} from '../screens/AddTypeOffre';
import ManageTypePrix from '../screens/ManageTypePrix';
import {AddTypePrix} from '../screens/AddTypePrix';
import {AddProdServEvent} from '../screens/AddProdServEvent';
import {ProdServEvents} from '../screens/ProdServEvents';
import {EventsList} from '../screens/EventsList';
import {ValidationVendeur} from '../screens/ValidationVendeur';
import ManageVendeur from '../screens/ManageVendeur';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const RootStack = () => {
  const Stack = createStackNavigator();

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
        name="Invitations"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Invitations}
      />
      <Stack.Screen
        name="Contributions"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Contributions}
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
      <Stack.Screen
        name="ProductOrderings"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ProductOrderings}
      />
      <Stack.Screen
        name="ProductDelivering"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ProductDelivering}
      />
      <Stack.Screen
        name="ServicesOffertsList"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ServicesOffertsList}
      />
      <Stack.Screen
        name="DeviseSetting"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={DeviseSetting}
      />
      <Stack.Screen
        name="CountrySetting"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={CountrySetting}
      />
      <Stack.Screen
        name="CommandesEffectuees"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={CommandesEffectuees}
      />
      <Stack.Screen
        name="ServiceDetails"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ServiceDetails}
      />
      <Stack.Screen
        name="EditPanier"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={EditPanier}
      />
      <Stack.Screen
        name="TypeEvents"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={TypeEvents}
      />
      <Stack.Screen
        name="AddTypeEvent"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddTypeEvent}
      />
      <Stack.Screen
        name="OTPAuthScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={OTPAuthScreen}
      />
      <Stack.Screen
        name="OTPForgotPwdScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={OTPForgotPwdScreen}
      />
      <Stack.Screen
        name="Dashboard"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Dashboard}
      />
      <Stack.Screen
        name="Dashboards"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Dashboards}
      />
      <Stack.Screen
        name="Administrators"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Administrators}
      />
      <Stack.Screen
        name="Users"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={Users}
      />
      <Stack.Screen
        name="ManageProducts"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ManageProducts}
      />
      <Stack.Screen
        name="AddAdmin"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddAdmin}
      />
      <Stack.Screen
        name="TermsVendor"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={TermsVendor}
      />
      <Stack.Screen
        name="PaymentScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={PaymentScreen}
      />

      <Stack.Screen
        name="RatingScreen"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={RatingScreen}
      />
      <Stack.Screen
        name="ManageCategories"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ManageCategories}
      />
      <Stack.Screen
        name="AddCategory"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddCategory}
      />
      <Stack.Screen
        name="ManageTypeOffres"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ManageTypeOffres}
      />
      <Stack.Screen
        name="AddTypeOffre"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddTypeOffre}
      />
      <Stack.Screen
        name="ManageTypePrix"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ManageTypePrix}
      />
      <Stack.Screen
        name="AddTypePrix"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddTypePrix}
      />
      <Stack.Screen
        name="AddProdServEvent"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={AddProdServEvent}
      />
      <Stack.Screen
        name="ProdServEvents"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ProdServEvents}
      />
      <Stack.Screen
        name="EventsList"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={EventsList}
      />
      <Stack.Screen
        name="ValidationVendeur"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ValidationVendeur}
      />
      <Stack.Screen
        name="ManageVendeur"
        options={{
          headerShown: false,
          gestureEnabled: false,
          headerLeft: () => false,
        }}
        component={ManageVendeur}
      />
    </Stack.Navigator>
  );
};

const BottomNav = () => {
  const Tab = createBottomTabNavigator();
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const styles = DefaultComponentsThemes();
  // State pour le nombre de produits dans le panier
  const [cartCount, setCartCount] = useState(0);
  const currentUser = auth().currentUser;

  useEffect(() => {
    // Fonction pour écouter les modifications des produits du panier
    const unsubscribe = firestore()
      .collection('carts')
      .where('userId', '==', currentUser?.uid)
      .where('paid', '==', false) // Seuls les produits non payés
      .onSnapshot(snapshot => {
        const count = snapshot.docs.reduce(
          (sum, doc) => sum + Number(doc.data().qty),
          0,
        );
       // console.log(count)
        setCartCount(count); // Mettre à jour le nombre total de produits
      });

    return () => unsubscribe(); // Nettoyer l'écouteur
  }, [currentUser?.uid]);

 // console.log(cartCount)

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
                size={25}
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
                size={25}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Carts'}
        component={Cart}
        options={{
          title: t('Global.Cart') || '',
          tabBarIcon: ({focused}) => (
            <View
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/*  <Icon3
          name={'shoppingcart'}
          color={focused ? theme.colors.primary : ColorPallet.lightGray}
          size={25}
        /> */}
              <Image
                source={require('../assets/shopping-cart-3.png')}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused
                    ? theme.colors.primary
                    : ColorPallet.lightGray,
                }}
              />


              {cartCount > 0 && (
                <Text
                  style={{
                    position: 'absolute',
                    top: '50%', // Centre verticalement
                    left: '50%', // Centre horizontalement
                    transform: [{translateX: cartCount > 9 ? -5 : -2}, {translateY: -12}], // Ajustement fin
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'black', // Même couleur que l'icône
                    textAlign: 'center',
                  }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              )}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={'Achats'}
        component={Achats}
        options={{
          title: t('Screens.Achats') || '',
          tabBarIcon: ({focused}) => (
            <View style={{width: '100%', height: '100%'}}>
              {focused && <View style={styles.tabBarActive} />}
              <Icon2
                style={styles.tabBarIcone}
                name={'shopping-outline'}
                color={focused ? theme.colors.primary : ColorPallet.lightGray}
                size={25}
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
                size={25}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RootStack;
