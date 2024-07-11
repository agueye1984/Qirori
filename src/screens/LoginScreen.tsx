import React, {useState} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
} from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import {emailValidator, passwordValidator} from '../core/utils';
import {Navigation} from '../types';
import {useTranslation} from 'react-i18next';
import Paragraph from '../components/Paragraph';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { ManageEventsParamList, User } from '../contexts/types';

type OTPAuthScreenProp = StackNavigationProp<
  ManageEventsParamList,
  'OTPAuthScreen'
>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const {t} = useTranslation();
  const {navigate} = useNavigation<OTPAuthScreenProp>();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleEmail = (text: string) => {
    setEmail(text);
    if (text === '') {
      setEmailError('');
    }
  };

  const handlePassword = (text: string) => {
    setPassword(text);
    if (text === '') {
      setPasswordError('');
    }
  };

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email, t);
    const passwordError = passwordValidator(password, t);

    if (emailError || passwordError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      return;
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          const usersRef = firestore().collection('users');
          usersRef
            .doc(response.user.uid)
            .get()
            .then(async firestoreDocument => {
              if (!firestoreDocument.exists) {
                setLoginError(t('LoginScreen.LoginError'));
                return;
              }
              setEmail('');
              setPassword('');
              setEmailError('');
              setPasswordError('');
              setLoginError('');
              const user = firestoreDocument.data() as User;
             // const confirmation = await auth().signInWithPhoneNumber(user.phoneNumber);
             console.log(user)
             if(user.actif===true){
            /*   const otp = SmsApi.generateOTP();
              console.log(otp) */
             // SmsApi.sendOTPBySMS(user.phoneNumber,otp)
             //navigate('OTPAuthScreen', {code: otp});
             if(user.profilId==='1'){
              navigate("Dashboard" as never);
             } else{
              navigate("HomeScreen" as never);
             }
            } else {
              setLoginError(t('LoginScreen.LoginActifError'));
              auth().signOut();
                return;
            }
             
            })
            .catch(error => {
              setLoginError(t('LoginScreen.LoginError'));
              console.log('error1 ' + error);
            });
        })
        .catch(error => {
          setLoginError(t('LoginScreen.LoginError'));
          console.log('error2 ' + error);
        });
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <Header>{t('LoginScreen.title')}</Header>
      <Paragraph>{t('LoginScreen.paragraph')}</Paragraph>
      <Text style={styles.errorText}>{loginError}</Text>
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
      <TextInput
        value={email}
        label={t('LoginScreen.Email')}
        returnKeyType="next"
        onChangeText={text => handleEmail(text)}
        error={!!emailError}
        errorText={emailError}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        label={t('LoginScreen.Password')}
        returnKeyType="done"
        onChangeText={text => handlePassword(text)}
        error={!!passwordError}
        errorText={passwordError}
        secureTextEntry
        style={styles.input}
      />
 
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigate('ForgotPasswordScreen' as never)}>
          <Text style={styles.label}>{t('LoginScreen.Forgotpassword')}</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed}>
        {t('LoginScreen.Login')}
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>{t('LoginScreen.DontHaveAccount')} </Text>
        <TouchableOpacity onPress={() => navigate('RegisterScreen' as never)}>
          <Text style={styles.link}>{t('LoginScreen.SignUp')}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
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
});

export default LoginScreen;
