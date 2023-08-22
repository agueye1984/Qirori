import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
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

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [login, setLogin] = useState({ value: '', error: '' });
  const { t } = useTranslation();
  const [state] = useStore();

  console.log(state)

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value,t);
    const passwordError = passwordValidator(password.value,t);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      const findUser = state.user.find((item) => {return (item.email ==email.value && item.password==password.value)});
      if(findUser != null){
        await AsyncStorage.setItem(LocalStorageKeys.UserId, findUser.id)
        navigation.navigate('HomeScreen');
      } else {
        const loginError = t('LoginScreen.LoginError');
        setLogin({ ...login, error: loginError });
      }
    }
  };

  return (
    <Background>
      <Logo />
      <Header>{t('LoginScreen.title')}</Header>
      <Paragraph>{t('LoginScreen.paragraph')}</Paragraph>
      <Text style={styles.errorText}>{login.error}</Text>
      <TextInput
        label={t('LoginScreen.Email')}
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label={t('LoginScreen.Password')}
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
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
    </Background>
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
});

export default LoginScreen;
