import React, { useCallback, useEffect, useState } from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {VentesList} from '../components/VentesList';
import {useNavigation} from '@react-navigation/native';
import {Accueil, User} from '../contexts/types';
import {VentesItem} from '../components/VentesItem';
import { useStore } from '../contexts/store';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import { theme } from '../core/theme';
import { AccordionItem } from '../components/react-native-accordion-list-view';
import CheckBoxRow from '../components/CheckBoxRow';
import { NotificationBox } from '../components/NotificationBox';
import { LargeButton } from '../components/LargeButton';

export const Ventes = () => {
  const {t} = useTranslation();
  const vente = VentesList(t);
  const navigation = useNavigation();
  const [user, setUser] = useState<User>();
  const [checked, setChecked] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const {ColorPallet} = useTheme()
  const defaultStyle = defaultComponentsThemes()
  const style = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primaryBackground,
    },
    bodyText: {
      ...defaultStyle.text,
      flexShrink: 1,
    },
    titleText: {
      ...defaultStyle.text,
      textDecorationLine: 'underline',
    },
    title: {
      ...defaultStyle.subtitle,
    },
    controlsContainer: {
      marginTop: 'auto',
      marginBottom: 20,
    },
    paragraph: {
      flexDirection: 'row',
      marginTop: 20,
    },
    enumeration: {
      ...defaultStyle.text,
      marginRight: 25,
    },
    link: {
      ...defaultStyle.text,
      color: ColorPallet.link,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  })

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUser(userData);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  function handleSelection(item: Accueil) {
    navigation.navigate(item.route as never);
  }

  const onSubmitPressed = useCallback(() => {
    setFormSubmitted(true)

    if (!checked) {
      return
    }

    const currentUser = auth().currentUser

    console.log(currentUser?.uid)

    firestore()
      .collection('users')
      .doc(currentUser?.uid)
      .update({
        vendor: true,
      })
      .then(() => {
        console.log('Type Event added!');
        navigation.navigate('HomeScreen' as never)
      })
  }, [checked, formSubmitted])

  if (user?.vendor) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{padding: 10}}>
          <BacktoHome textRoute={t('HomeScreen.title')} />
  
          <Header>{t('Ventes.title')}</Header>
  
          <View
            style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
            <View style={{padding: 10}}>
              {vente.map((item: Accueil) => {
                return (
                  <VentesItem
                    key={item.id}
                    item={item}
                    action={() => handleSelection(item)}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
          <Header>{t('TermsV2.title')}</Header>
          <Text>{t('TermsV2.Consent.body')}</Text>
          <Text style={[style.title, {marginTop: 20}]}>{t('TermsV2.Consent.title')}</Text>
          <Text style={[style.bodyText, {marginTop: 20}]}>{t('TermsV2.Consent.body')}</Text>
  
          <Text style={[style.title, {marginTop: 20}]}>{t('TermsV2.Consent.PersonalUse.title')}</Text>
          <Text style={[style.bodyText, {marginTop: 20, marginBottom: 20}]}>{t('TermsV2.Consent.PersonalUse.body')}</Text>
          <AccordionItem
            customTitle={() => <Text style={[style.title]}>{t('TermsV2.Consent.PersonalUse.subsection.title')}</Text>}
            customBody={() => (
              <Text style={[style.bodyText, {margin: 20}]}>{t('TermsV2.Consent.PersonalUse.subsection.body')}</Text>
            )}
          />
  
          <Text style={[style.title, {marginTop: 20}]}>{t('TermsV2.Consent.IdentityTheft.title')}</Text>
          <Text style={[style.bodyText, {marginTop: 20, marginBottom: 20}]}>
            {t('TermsV2.Consent.IdentityTheft.body')}
          </Text>
          <AccordionItem
            customTitle={() => <Text style={[style.title]}>{t('TermsV2.Consent.IdentityTheft.subsection.title')}</Text>}
            customBody={() => (
              <Text style={[style.bodyText, {margin: 20}]}>{t('TermsV2.Consent.IdentityTheft.subsection.body')}</Text>
            )}
          />
  
          <Text style={[style.title, {marginTop: 20}]}>{t('TermsV2.Consent.Privacy.title')}</Text>
          <Text style={[style.bodyText, {marginTop: 20, marginBottom: 20, marginVertical: 20}]}>
            {t('TermsV2.Consent.Privacy.body')}
          </Text>
          <AccordionItem
            containerStyle={{marginBottom: 20}}
            customTitle={() => <Text style={[style.title]}>{t('TermsV2.Consent.Privacy.subsection.title')}</Text>}
            customBody={() => (
              <Text style={[style.bodyText, {margin: 20}]}>{t('TermsV2.Consent.Privacy.subsection.body')}</Text>
            )}
          />
  
          <View style={[style.controlsContainer]}>
            {
              /*!(store.onboarding.didAgreeToTerms && store.authentication.didAuthenticate) && */
              <>
                <CheckBoxRow
                  title={t('TermsV2.Credential.Body')}
                  accessibilityLabel={t('TermsV2.IAgree') || ''}
                  checked={checked}
                  onPress={() => setChecked(!checked)}
                />
                {!checked && formSubmitted && <NotificationBox type="warning" body={t('TermsV2.Credential.Error')} />}
                <View style={[{paddingTop: 10}]}>
                  <LargeButton title={t('Global.Continue')} action={onSubmitPressed} isPrimary />
                </View>
                <View style={[{paddingTop: 10}]}>
                  <LargeButton
                    title={t('Global.Cancel')}
                    action={() => navigation.navigate('HomeScreen' as never)}
                    isPrimary
                  />
                </View>
              </>
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }


  
};
