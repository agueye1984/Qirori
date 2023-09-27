import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { Navigation } from '../types';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  retapePasswordValidator,
  phoneValidator,
} from '../core/utils';
import { useTranslation } from 'react-i18next';
import Paragraph from '../components/Paragraph';
import { User } from '../contexts/types';
import { useStore } from '../contexts/store';
import { DispatchAction } from '../contexts/reducers/store';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView } from 'react-native-safe-area-context';



type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [retapePassword, setRetapePassword] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const { t } = useTranslation();
  const [state, dispatch] = useStore();

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value, t);
    const emailError = emailValidator(email.value, t);
    let passwordError = passwordValidator(password.value, t);
    let retapePasswordError = retapePasswordValidator(retapePassword.value, t);
    const phoneError = phoneValidator(phone.value, t);
    if (password.value != '' && retapePassword.value != '' && password.value != retapePassword.value) {
      retapePasswordError = t('RegisterScreen.PasswordNotConfirm');
    }


    if (emailError || passwordError || nameError || retapePasswordError || phoneError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setRetapePassword({ ...retapePassword, error: retapePasswordError });
      setPhone({ ...phone, error: phoneError });
    } else {
      const findIndex = state.user.findIndex((req) => req.email === email.value);
      if (findIndex) {
        let user: User = {
          id: uuidv4(),
          name: name.value,
          email: email.value,
          password: password.value,
          telephone: phone.value,
        }

        dispatch({
          type: DispatchAction.ADD_USER,
          payload: user,
        })
        navigation.navigate('LoginScreen');
      } else {
        retapePasswordError = t('RegisterScreen.AccountExists');
      }
    }

  };


  return (
    <SafeAreaView style={styles.container}>
      <Logo />
      <Header>{t('RegisterScreen.title')}</Header>
      <Paragraph>{t('RegisterScreen.paragraph')}</Paragraph>
      <TextInput
        label={t('RegisterScreen.Name')}
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label={t('RegisterScreen.Email')}
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
        label={t('RegisterScreen.Phone')}
        returnKeyType="next"
        value={phone.value}
        onChangeText={text => setPhone({ value: text, error: '' })}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        autoComplete="tel"
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
      />
      <TextInput
        label={t('RegisterScreen.Password')}
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label={t('RegisterScreen.RetapePassword')}
        returnKeyType="done"
        value={retapePassword.value}
        onChangeText={text => setRetapePassword({ value: text, error: '' })}
        error={!!retapePassword.error}
        errorText={retapePassword.error}
        secureTextEntry
      />

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        {t('RegisterScreen.SignUp')}
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>{t('RegisterScreen.AlreadyHaveAccount')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>{t('RegisterScreen.Login')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
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

export default RegisterScreen;
