// Importing a few package and components
import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {heightPercentageToDP as heightToDp} from 'react-native-responsive-screen';
import {useStore} from '../contexts/store';
import {Adresse, Location, User} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {v4 as uuidv4} from 'uuid';
import auth from '@react-native-firebase/auth';
import { AdresseLine } from './AdresseLine';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { theme } from '../core/theme';



export default function ShippingAddress({shippingAddress,onChange}: any) {
  const currentUser = auth().currentUser;
  const {t} = useTranslation();
  const [state] = useStore();
  const [addressLine1, setAddressLine1] = useState(shippingAddress.address_line_1);
  const [addressLine2, setAddressLine2] = useState(shippingAddress.address_line_2);
  const [city, setCity] = useState(shippingAddress.city);
  const [province, setProvince] = useState(shippingAddress.province);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const countryCode =state.country.toString();
  const initLocate: Location = {placeId: '', description: shippingAddress.address_line_1};
  const [addressLine, setAddressLine] = useState<Location>(initLocate);


  const handleChange = () => {
    // Creating an object to store the user's input
    let address: Adresse = {
      city: city,
      province: province,
      id: uuidv4(),
      address_line_1: addressLine1,
      address_line_2:addressLine2,
      postalCode: postalCode,
      userId: currentUser?.uid || '',
      countryCode: countryCode,
    };
    // Calling the onChange function and passing the address object as an argument
    onChange(address);
  };

  const handleAdresseChange = (value: Location) => {
   // setEventLocalisation(value);
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
      <PaperTextInput
        label={t('Checkout.AdresseLine2')}
        returnKeyType="done"
        value={addressLine2}
        onChangeText={text => {
          setAddressLine2(text);
          handleChange();
        }}
        autoCapitalize="none"
        style={styles.input}
      />
      <PaperTextInput
        label={t('Checkout.City')}
        returnKeyType="done"
        value={city}
        onChangeText={text => {
          setCity(text);
          handleChange();
        }}
        autoCapitalize="none"
        editable={false}
        style={styles.input}
      />
      <PaperTextInput
        label={t('Checkout.Province')}
        returnKeyType="done"
        value={province}
        onChangeText={text => {
          setProvince(text);
          handleChange();
        }}
        autoCapitalize="none"
        editable={false}
        style={styles.input}
      />
      <PaperTextInput
        label={t('Checkout.PostalCode')}
        returnKeyType="done"
        value={postalCode}
        onChangeText={text => {
          setPostalCode(text);
          handleChange();
        }}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

// Creating a stylesheet to style the view
const styles = StyleSheet.create({
  container: {
    marginTop: heightToDp(1),
  },
  input: {
    width: '100%', // Prend toute la largeur du conteneur
    marginBottom: 15,
    //height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
