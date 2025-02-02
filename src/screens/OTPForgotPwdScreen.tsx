import React, { useState } from 'react';
import { View,  SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ManageEventsParamList, User } from '../contexts/types';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { theme } from '../core/theme';
import { useTranslation } from 'react-i18next';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import { TextInput as PaperTextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

type ResetPasswordProp = StackNavigationProp<
  ManageEventsParamList,
  'ResetPassword'
>;

const OTPForgotPwdScreen = () => {
const route = useRoute<RouteProp<ManageEventsParamList, 'OTPForgotPwdScreen'>>();
 const confirmResult1 = route.params.confirmResult;
 const [confirmResult, setConfirmResult] = useState(confirmResult1);
  const [confirmCode, setConfirmCode] = useState('');
  const {t} = useTranslation();
  const [codeError, setCodeError] = useState('');
  const navigation = useNavigation<ResetPasswordProp>();
  const currentUser = auth().currentUser;
  console.log(currentUser);


  const confirmCodeHandler = async () => {
    try {
      await confirmResult.confirm(confirmCode);
      console.log('Phone authentication successful!');
      navigation.navigate('ResetPassword', {user: currentUser});
    } catch (error) {
      console.log('Error:', error);
      setCodeError(t('OTPAuthScreen.CodeError'));
    }
  };

  const signInWithPhoneNumber = async () => {
    try {
      const usersRef = firestore().collection('users');
      usersRef
          .doc(currentUser?.uid)
          .get()
          .then(async document => {
            const userData = document.data() as User;
            const confirmation = await auth().signInWithPhoneNumber(userData.phoneNumber);
            setConfirmResult(confirmation);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const styles = StyleSheet.create({
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    label: {
      color: theme.colors.secondary,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    errorText: {
      color: 'red',
      fontSize: 10,
      fontWeight: 'bold',
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      width:300
    },
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <Header>{t('OTPAuthScreen.title')}</Header>
      <Paragraph>{t('OTPAuthScreen.paragraph')}</Paragraph>
      <Text style={styles.errorText}>{codeError}</Text>
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
      <View>
          <PaperTextInput
          label={t('OTPAuthScreen.confirmCode')}
            placeholder={t('OTPAuthScreen.enterConfirmCode')}
            value={confirmCode}
            onChangeText={setConfirmCode}
            style={styles.input}
          />
         {/*  <Button title="Confirm Code" onPress={confirmCodeHandler} /> */}
        </View>
        <View style={styles.section}>
        <View style={styles.row}>
          <View style={{marginRight:10}}>
            <Button
              mode="contained"
              onPress={signInWithPhoneNumber}>
              {t('Global.Resend')}
            </Button>
          </View>
          <View>
            <Button mode="contained" onPress={confirmCodeHandler}>
              {t('Global.ConfirmCode')}
            </Button>
          </View>
        </View>
      </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

export default OTPForgotPwdScreen;