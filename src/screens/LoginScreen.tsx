import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, BackHandler } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import { useTranslation } from 'react-i18next';
import Paragraph from '../components/Paragraph';
import { useStore } from '../contexts/store';
import { LocalStorageKeys } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const { t } = useTranslation();
  const [state] = useStore();
  const [userId, setUserId] = useState('')

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [])
  );

 /* useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
        .then((result) => {
            if (result === null) {
              setEmail('');
              setPassword('');
            }
        })
        .catch(error => console.log(error))
}, [email,password])*/

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email,t);
    const passwordError = passwordValidator(password,t);

    if (emailError || passwordError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      return;
    } else {
      const findUser = state.user.find((item) => {return (item.email ==email && item.password==password)});
      if(findUser != null){
        await AsyncStorage.setItem(LocalStorageKeys.UserId, findUser.id)
        navigation.navigate('HomeScreen');
      } else {
        setLoginError(t('LoginScreen.LoginError'));
      }
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <Header>{t('LoginScreen.title')}</Header>
      <Paragraph>{t('LoginScreen.paragraph')}</Paragraph>
      <Text style={styles.errorText}>{loginError}</Text>
      <TextInput
        label={t('LoginScreen.Email')}
        returnKeyType="next"
        onChangeText={text => setEmail(text)}
        error={!!emailError}
        errorText={emailError}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label={t('LoginScreen.Password')}
        returnKeyType="done"
        onChangeText={text => setPassword(text)}
        error={!!passwordError}
        errorText={passwordError}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.label}>{t('LoginScreen.Forgotpassword')}</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed}>
      {t('LoginScreen.Login')}
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>{t('LoginScreen.DontHaveAccount')} </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>{t('LoginScreen.SignUp')}</Text>
        </TouchableOpacity>
      </View>
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
});

export default LoginScreen;
