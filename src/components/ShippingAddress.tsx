// Importing a few package and components
import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {useStore} from '../contexts/store';
import {Adresse, Location, User} from '../contexts/types';
import TextInput from './TextInput';
import {useTranslation} from 'react-i18next';
import {v4 as uuidv4} from 'uuid';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { EmplacementSection } from './EmplacementSection';
import { AdresseLine } from './AdresseLine';



export default function ShippingAddress({onChange}: any) {
  const {t} = useTranslation();
  const [userId, setUserId] = useState('');
  const [state] = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const countryCode =state.country.toString();
  const initLocate: Location = {placeId: '', description: ''};
  const [addressLine, setAddressLine] = useState<Location>(initLocate);


  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
            setName(userData.displayName);
      setEmail(userData.email);
      setPhone(userData.phoneNumber);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  const handleChange = () => {
    // Creating an object to store the user's input
    let address: Adresse = {
      city: city,
      province: province,
      id: uuidv4(),
      address_line_1: addressLine1,
      address_line_2:addressLine2,
      postalCode: postalCode,
      userId: userId,
      countryCode: countryCode,
    };
    console.log(address)
    // Calling the onChange function and passing the address object as an argument
    onChange(address);
  };

  const handleAdresseChange = (value: Location) => {
   // setEventLocalisation(value);
    console.log(value)
    const adresse = value.description.split(',');
    setAddressLine1(adresse[0]);
    setCity(adresse[1]);
    setProvince(adresse[2])
    setAddressLine(value)
  };

  return (
    // Creating a view to hold the user's input
    <View style={styles.container}>
      {/* Creating a text input for the user's first name */}
      <AdresseLine
            addressLine={addressLine}
            setAddressLine={handleAdresseChange}
          />
      <TextInput
        label={t('Checkout.AdresseLine2')}
        returnKeyType="next"
        value={addressLine2}
        onChangeText={text => {
          setAddressLine2(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.City')}
        returnKeyType="next"
        value={city}
        onChangeText={text => {
          setCity(text);
          handleChange();
        }}
        autoCapitalize="none"
        editable={false}
      />
      <TextInput
        label={t('Checkout.Province')}
        returnKeyType="next"
        value={province}
        onChangeText={text => {
          setProvince(text);
          handleChange();
        }}
        autoCapitalize="none"
        editable={false}
      />
      <TextInput
        label={t('Checkout.PostalCode')}
        returnKeyType="next"
        value={postalCode}
        onChangeText={text => {
          setPostalCode(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
    </View>
  );
}

// Creating a stylesheet to style the view
const styles = StyleSheet.create({
  container: {
    marginTop: heightToDp(1),
  },
});
