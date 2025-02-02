import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {User} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import {BacktoHome} from '../components/BacktoHome';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../core/theme';
import VersionNumber from 'react-native-version-number';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const Setting = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
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

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never));
  };
  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 20,
      paddingVertical: 20,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    itemContainerForm: {
      height: 50,
      marginHorizontal: 5,
      borderWidth: 0.4,
      //flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },

    itemContainerForm1: {
      height: 300,
      marginHorizontal: 5,
      borderWidth: 0.4,
      //flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    itemSeparator: {
      //height: 40,
      marginHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.2,
    },
  });

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Settings.title')} />
      <Header>{t('Setting.title')}</Header>
      <View style={styles.section}>
        <Text style={{marginVertical: 15}}>{t('Setting.Name')}</Text>
        <View style={[styles.itemContainerForm]}>
          <Text style={{marginVertical: 15, marginLeft: 15}}>{name}</Text>
        </View>
      </View>
      <View style={[styles.section, {marginVertical: 5}]}>
        <View style={[styles.itemContainerForm1]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LanguageSetting' as never);
            }}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: theme.colors.primary, marginHorizontal: 15}}>
                {t('Setting.LanguageSetting')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DeviseSetting' as never);
            }}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: theme.colors.primary, marginHorizontal: 15}}>
                {t('Setting.DeviseSetting')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CountrySetting' as never);
            }}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: theme.colors.primary, marginHorizontal: 15}}>
                {t('Setting.CountrySetting')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ContactUs' as never);
            }}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: theme.colors.primary, marginHorizontal: 15}}>
                {t('Setting.ContactUs')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <TouchableOpacity onPress={logout}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: theme.colors.primary, marginHorizontal: 15}}>
                {t('Setting.Logout')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <View style={[styles.row]}>
            <View style={[defaultStyles.leftSectRowContainer, {marginTop: 10}]}>
              <Text style={{marginHorizontal: 15}}>{t('Setting.Email')}</Text>
            </View>
            <View
              style={[defaultStyles.rightSectRowContainer, {marginTop: 10}]}>
              <Text
                style={{color: theme.colors.darkGray, marginHorizontal: 15}}>
                {email}
              </Text>
            </View>
          </View>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <View style={[styles.row]}>
            <View style={[defaultStyles.leftSectRowContainer, {marginTop: 10}]}>
              <Text style={{marginHorizontal: 15}}>{t('Setting.Phone')}</Text>
            </View>
            <View
              style={[defaultStyles.rightSectRowContainer, {marginTop: 10}]}>
              <Text
                style={{color: theme.colors.darkGray, marginHorizontal: 15}}>
                {phone}
              </Text>
            </View>
          </View>
          <View style={[styles.itemSeparator, {marginTop: 10}]} />
          <View style={[styles.row]}>
            <View style={[defaultStyles.leftSectRowContainer, {marginTop: 10}]}>
              <Text style={{marginHorizontal: 15}}>{t('Setting.Version')}</Text>
            </View>
            <View
              style={[defaultStyles.rightSectRowContainer, {marginTop: 10}]}>
              <Text
                style={{color: theme.colors.darkGray, marginHorizontal: 15}}>
                {VersionNumber.appVersion +
                  '(' +
                  VersionNumber.buildVersion +
                  ')'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
