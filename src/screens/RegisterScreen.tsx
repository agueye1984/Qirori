import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import {Navigation} from '../types';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  retapePasswordValidator,
  phoneValidator,
} from '../core/utils';
import {useTranslation} from 'react-i18next';
import Paragraph from '../components/Paragraph';
import {User} from '../contexts/types';
import {useStore} from '../contexts/store';
import {DispatchAction} from '../contexts/reducers/store';
import {v4 as uuidv4} from 'uuid';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retapePassword, setRetapePassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [retapePasswordError, setRetapePasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const {t} = useTranslation();
  const [state, dispatch] = useStore();

  const handleName = (text: string) => {
    setName(text);
    if (text === '') {
      setNameError('');
    }
  };

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

  const handleRetapePassword = (text: string) => {
    setRetapePassword(text);
    if (text === '') {
      setRetapePasswordError('');
    }
  };

  const handlePhone = (text: string) => {
    setPhone(text);
    if (text === '') {
      setPhoneError('');
    }
  };

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name, t);
    const emailError = emailValidator(email, t);
    let passwordError = passwordValidator(password, t);
    let retapePasswordError = retapePasswordValidator(retapePassword, t);
    const phoneError = phoneValidator(phone, t);
    if (password != '' && retapePassword != '' && password != retapePassword) {
      retapePasswordError = t('Global.PasswordNotConfirm');
    }

    if (
      emailError ||
      passwordError ||
      nameError ||
      retapePasswordError ||
      phoneError
    ) {
      setNameError(nameError);
      setEmailError(emailError);
      setPasswordError(passwordError);
      setRetapePasswordError(retapePasswordError);
      setPhoneError(phoneError);
    } else {
      console.log('adama');
      console.log(email);
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response: {user: {uid: any}}) => {
          const uid = response.user.uid;
          const data = {
            id: uid,
            email,
            name,
            phone,
            password,
          };
          console.log(data);
          const usersRef = firestore().collection('users');
          console.log(usersRef);
          usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              navigation.navigate('LoginScreen');
            })
            .catch((error: any) => {
              console.log("error1 "+error);
            });
        })
        .catch((error: any) => {
          retapePasswordError = t('Global.AccountExists');
          console.log("error2 "+error);
        });
      /*   const findIndex = state.user.findIndex((req) => req.email === email);
      if (findIndex) {
        let user: User = {
          id: uuidv4(),
          name: name,
          email: email,
          password: password,
          telephone: phone,
        }


        dispatch({
          type: DispatchAction.ADD_USER,
          payload: user,
        })
        navigation.navigate('LoginScreen');
      } else {
        retapePasswordError = t('Global.AccountExists');
      }*/
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
        value={name}
        onChangeText={text => handleName(text)}
        error={!!nameError}
        errorText={nameError}
      />

      <TextInput
        label={t('RegisterScreen.Email')}
        returnKeyType="next"
        value={email}
        onChangeText={text => handleEmail(text)}
        error={!!emailError}
        errorText={emailError}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label={t('RegisterScreen.Phone')}
        returnKeyType="next"
        value={phone}
        onChangeText={text => handlePhone(text)}
        error={!!phoneError}
        errorText={phoneError}
        autoCapitalize="none"
        autoComplete="tel"
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
      />
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

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        {t('RegisterScreen.SignUp')}
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>
          {t('RegisterScreen.AlreadyHaveAccount')}
        </Text>
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
