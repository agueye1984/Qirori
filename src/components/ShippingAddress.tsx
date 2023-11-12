// Importing a few package and components
import { View, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { widthPercentageToDP as widthToDp, heightPercentageToDP as heightToDp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageKeys } from "../constants";
import { useStore } from "../contexts/store";
import { Adresse, User } from "../contexts/types";
import TextInput from "./TextInput";
import { theme } from "../core/theme";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from 'uuid';

export default function ShippingAddress({ onChange }: any) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('')
  const [state] = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
      .then((result) => {
        if (result != null) {
          setUserId(result);
        }
      })
      .catch(error => console.log(error))
    const users = state.user.find((user) => user.id === userId);
    if (users) {
      setName(users.name);
      setEmail(users.email);
      setPhone(users.telephone);
    }
  }, [userId, name, email, phone])

  const handleChange = () => {
    // Creating an object to store the user's input
    let address: Adresse = {
      city: city,
      province: province,
      id: uuidv4(),
      adresse: addressLine1 + " " + addressLine2,
      postalCode: postalCode,
      userId: userId
    };
    // Calling the onChange function and passing the address object as an argument
    onChange(address);
  };

  return (
    // Creating a view to hold the user's input
    <View style={styles.container}>
      {/* Creating a text input for the user's first name */}

      <TextInput
        label={t('Checkout.Name')}
        returnKeyType="next"
        value={name}
        onChangeText={text => setName(text)}
        autoCapitalize="none"
        editable={false}
      />
      <TextInput
        label={t('Checkout.Email')}
        returnKeyType="next"
        value={email}
        onChangeText={text => setEmail(text)}
        autoCapitalize="none"
        editable={false}
      />
      <TextInput
        label={t('Checkout.AdresseLine1')}
        returnKeyType="next"
        value={addressLine1}
        onChangeText={(text) => {
          setAddressLine1(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.AdresseLine2')}
        returnKeyType="next"
        value={addressLine2}
        onChangeText={(text) => {
          setAddressLine2(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.City')}
        returnKeyType="next"
        value={city}
        onChangeText={(text) => {
          setCity(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.Province')}
        returnKeyType="next"
        value={province}
        onChangeText={(text) => {
          setProvince(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.PostalCode')}
        returnKeyType="next"
        value={postalCode}
        onChangeText={(text) => {
          setPostalCode(text);
          handleChange();
        }}
        autoCapitalize="none"
      />
      <TextInput
        label={t('Checkout.Phone')}
        returnKeyType="next"
        value={phone}
        onChangeText={text => setPhone(text)}
        autoCapitalize="none"
        editable={false}
      />
    </View>
  );
}

// Creating a stylesheet to style the view
const styles = StyleSheet.create({
  container: {
    marginTop: heightToDp(2),
  },
});