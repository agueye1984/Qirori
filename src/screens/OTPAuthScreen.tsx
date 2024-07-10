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
import TextInput from '../components/TextInput';
import firestore from '@react-native-firebase/firestore';
import SmsApi from '../apis/SmsApi';

const OTPAuthScreen = () => {
const route = useRoute<RouteProp<ManageEventsParamList, 'OTPAuthScreen'>>();
 const codeOtp = route.params.code;
 const [otp, setOtp] = useState(codeOtp);
  const [confirmCode, setConfirmCode] = useState('');
  const {t} = useTranslation();
  const [codeError, setCodeError] = useState('');
  const navigation = useNavigation();
  const currentUser = auth().currentUser;


  const confirmCodeHandler = async () => {
    if(confirmCode===otp){
      console.log('Phone authentication successful!');
      navigation.navigate("HomeScreen" as never);
    } else{
      setCodeError(t('OTPAuthScreen.CodeError'));
    }
    /* try {
      await confirmResult.confirm(confirmCode);
      console.log('Phone authentication successful!');
      navigation.navigate("HomeScreen" as never);
    } catch (error) {
      console.log('Error:', error);
      setCodeError(t('OTPAuthScreen.CodeError'));
    } */
  };

  const reSendCode = async () => {
    try {
      const usersRef = firestore().collection('users');
      usersRef
          .doc(currentUser?.uid)
          .get()
          .then(async document => {
            const userData = document.data() as User;
            const otp = SmsApi.generateOTP();
              SmsApi.sendOTPBySMS(userData.phoneNumber,otp);
            setOtp(otp);
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
          <TextInput
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
              onPress={reSendCode}>
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

export default OTPAuthScreen;