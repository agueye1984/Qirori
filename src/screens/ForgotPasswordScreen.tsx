import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { emailValidator } from '../core/utils';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import Button from '../components/Button';
import { Navigation } from '../types';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { StackNavigationProp } from '@react-navigation/stack';
import { ManageEventsParamList } from '../contexts/types';
import { useNavigation } from '@react-navigation/native';

type resetPasswordProp = StackNavigationProp<ManageEventsParamList, 'ResetPassword'>

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { t } = useTranslation();
  const [state] = useStore();
  const navigation = useNavigation<resetPasswordProp>();

  const _onSendPressed = () => {
    let emailError = emailValidator(email,t);

    if (emailError) {
      setEmailError(emailError);
      return;
    } else {
      const findUser = state.user.find((item) => {return (item.email ==email)});
      if (findUser===undefined){
        setEmailError(t('Global.EmailNotExist')+' '+email);
      } else {
        navigation.navigate('ResetPassword', { userId: findUser.id, })
      }
      
    }
  };

  const handleEmail = (text: string)=>{
    setEmail(text);
    if(text===''){
      setEmailError('');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goBack={() => navigation.goBack()} />

      <Logo />

      <Header>{t('Global.RestorePassword')}</Header>

      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email}
        onChangeText={text => handleEmail(text)}
        error={!!emailError}
        errorText={emailError}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
      {t('Global.VerifyEmail')}
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('LoginScreen' as never)}
      >
        <Text style={styles.label}>← {t('Global.BackTologin')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
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

export default ForgotPasswordScreen;
