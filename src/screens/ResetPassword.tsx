import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {passwordValidator, retapePasswordValidator} from '../core/utils';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import Button from '../components/Button';
import {Navigation} from '../types';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {ManageEventsParamList, User} from '../contexts/types';
import { RouteProp, useRoute } from '@react-navigation/native';

type Props = {
  navigation: Navigation;
};

const ResetPassword = ({navigation}: Props) => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'ResetPassword'>>();
  const [password, setPassword] = useState('');
  const [retapePassword, setRetapePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [retapePasswordError, setRetapePasswordError] = useState('');
  const {t} = useTranslation();
  const user = route.params.user;

  const handlePassword = (text: string) => {
    setPassword(text);
    if (text === '') {
      setPasswordError('');
    }
  };

  const handleRetapePassword = (text: string) => {
    setRetapePassword(text);
    if (text === '') {
      setRetapePasswordError('');
    }
  };

  const _onSendPressed = async () => {
    let passwordError = passwordValidator(password, t);
    let retapePasswordError = retapePasswordValidator(retapePassword, t);
    if (password != '' && retapePassword != '' && password != retapePassword) {
      retapePasswordError = t('Global.PasswordNotConfirm');
    }

    if (passwordError || retapePasswordError) {
      setPasswordError(passwordError);
      setRetapePasswordError(retapePasswordError);
      return;
    } else {
      //const user = auth().currentUser;
      console.log(user)
      if(user!=null){
        user.updatePassword(password).then(
          () => auth().signOut().then(
            () => firestore().collection('users')
                .doc(user.uid)
                .update({
                  password: password,
                })
                .then(() => {
                  navigation.navigate('LoginScreen' as never);
                })
          )
        );
        
        /* user?.updatePassword(password);
      auth().signOut();
      firestore()
        .collection('users')
        .doc(user?.uid)
        .update({
          password: password,
        })
        .then(() => {
          navigation.navigate('LoginScreen' as never);
        }); */
      }
      
      
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton goBack={() => navigation.navigate('LoginScreen')} />

      <Logo />

      <Header>{t('ResetPassword.title')}</Header>

      <TextInput
        label={t('RegisterScreen.Password')}
        returnKeyType="next"
        value={password}
        onChangeText={text => handlePassword(text)}
        error={!!passwordError}
        errorText={passwordError}
        secureTextEntry
      />
      <TextInput
        label={t('RegisterScreen.RetapePassword')}
        returnKeyType="done"
        value={retapePassword}
        onChangeText={text => handleRetapePassword(text)}
        error={!!retapePasswordError}
        errorText={retapePasswordError}
        secureTextEntry
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
      {t('ResetPassword.Reset')}
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate('LoginScreen')}>
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

export default ResetPassword;
