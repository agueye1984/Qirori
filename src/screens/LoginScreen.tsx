import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import { Button as PaperButton, TextInput as PaperTextInput } from 'react-native-paper';
import { theme } from '../core/theme';
import Logo from '../components/Logo';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ManageEventsParamList, User } from '../contexts/types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { emailValidator, passwordValidator } from '../core/utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultComponentsThemes from '../defaultComponentsThemes';


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
  const defaultStyles = DefaultComponentsThemes();

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
    setEmailError('');
  };

  const handlePassword = (text: string) => {
    setPassword(text);
    setPasswordError('');
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Logo />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.header}>{t('LoginScreen.title')}</Text>
          <Text style={styles.paragraph}>{t('LoginScreen.paragraph')}</Text>
          <Text style={styles.errorText}>{loginError}</Text>

          <PaperTextInput
            label={t('LoginScreen.Email')}
            value={email}
            onChangeText={text => handleEmail(text)}
            keyboardType="email-address"
            style={emailError ? [styles.input, styles.inputError] : styles.input }
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="done"
          />
          {emailError && <Text style={defaultStyles.error}>{emailError}</Text>}
          <PaperTextInput
            label={t('LoginScreen.Password')}
            value={password}
            onChangeText={text => handlePassword(text)}
            secureTextEntry
            style={passwordError ? [styles.input, styles.inputError] : styles.input }
            returnKeyType="done"
          />
          {passwordError && <Text style={defaultStyles.error}>{passwordError}</Text>}
          <View style={styles.forgotPassword}>
            <TouchableOpacity onPress={() => navigate('ForgotPasswordScreen' as never)}>
              <Text style={styles.label}>{t('LoginScreen.Forgotpassword')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <PaperButton mode="contained" onPress={_onLoginPressed} style={styles.button}>
              {t('LoginScreen.Login')}
            </PaperButton>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('LoginScreen.DontHaveAccount')}</Text>
            <TouchableOpacity onPress={() => navigate('RegisterScreen' as never)}>
              <Text style={styles.link}>{t('LoginScreen.SignUp')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 20,
  },
  input: {
    width: '100%', // Prend toute la largeur du conteneur
    marginBottom: 15,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,  // Assurez-vous que le bouton n'est pas collé aux bords
    marginTop: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default LoginScreen;
