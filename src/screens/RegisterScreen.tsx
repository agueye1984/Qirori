import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';

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
  const {i18n, t} = useTranslation()
  const phoneInput = useRef<PhoneInput>(null);
  const [isValid, setIsValid] = useState(true);
  const selectedLanguageCode = i18n.language;
  let langue = 'fra'
  if (selectedLanguageCode=='en'){
    langue = 'eng'
  }

  const handleName = (text: string) => {
    setName(text);
    setNameError('');
  };

  const handleEmail = (text: string) => {
    setEmail(text);
    setEmailError('');
  };

  const handlePassword = (text: string) => {
    setPassword(text);
    setPasswordError('');
  };

  const handleRetapePassword = (text: string) => {
    setRetapePassword(text);
    setRetapePasswordError('');
  };

  const handlePhone = (text: string) => {
    setPhone(text);
    setPhoneError('');
  };

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
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
    //  alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      color: 'red',
    marginTop: 5,
    },
    phoneInputContainer: {
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
    },
    phoneInputTextContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
  });


  const _onSignUpPressed = () => {
    const nameError = nameValidator(name, t);
    let emailError = emailValidator(email, t);
    let passwordError = passwordValidator(password, t);
    let retapePasswordError = retapePasswordValidator(retapePassword, t);
    const checkValid = phoneInput.current?.isValidNumber(phone);
    setIsValid(!!checkValid);
    let phoneError = checkValid ? '' : t('Global.PhoneError'); //phoneValidator(phone, t);
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
      firestore()
      .collection('users')
      // Filter results
      .where('phoneNumber', '==', phone)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response: {user: {uid: any}}) => {
          const uid = response.user.uid;
          const data = {
            id: uid,
            email: email,
            displayName: name,
            phoneNumber: phone,
            password: password,
            profilId:'2',
            vendor: false,
            actif:true,
          };
          const usersRef = firestore().collection('users');
          usersRef
            .doc(uid)
            .set(data)
            .then( () => {
             /*  await auth().currentUser?.sendEmailVerification();
                auth().signOut(); */
              navigation.navigate('LoginScreen');
            })
            .catch((error: any) => {
              console.log('error1 ' + error);
            });
        })
        .catch((error: any) => {
          //retapePasswordError = t('Global.AccountExists');
          setEmailError(t('Global.AccountExists'));
          console.log('error2 ' + error);
        });
        } else {
          setPhoneError(t('Global.PhoneExisting'));
        }
      });
      /* phoneError = checkPhone(phone);
      console.log(emailError);
      console.log('adama')
      if (emailError || phoneError) {
        setEmailError(emailError);
        setPhoneError(phoneError);
      } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response: {user: {uid: any}}) => {
          const uid = response.user.uid;
          const data = {
            id: uid,
            email: email,
            displayName: name,
            phoneNumber: phone,
            password: password,
          };
          const usersRef = firestore().collection('users');
          usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              navigation.navigate('LoginScreen');
            })
            .catch((error: any) => {
              console.log('error1 ' + error);
            });
        })
        .catch((error: any) => {
          //retapePasswordError = t('Global.AccountExists');
          setEmailError(t('Global.AccountExists'));
          console.log('error2 ' + error);
        }); */
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{alignItems:'center'}}>
        <Logo />
        </View>
      <Header>{t('RegisterScreen.title')}</Header>
      <Paragraph>{t('RegisterScreen.paragraph')}</Paragraph>
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
        <View style={styles.section}>
          <TextInput
            label={t('RegisterScreen.Name')}
            returnKeyType="next"
            value={name}
            onChangeText={text => handleName(text)}
            error={!!nameError}
            errorText={nameError}
          />
        </View>
        <View style={styles.section}>
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
        </View>
        <View style={styles.section}>
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="CA"
        layout="first"
        onChangeText={(text) => {
          handlePhone(text);
        }}
        onChangeFormattedText={(text) => {
          handlePhone(text);
        }}
        withDarkTheme
        withShadow
        autoFocus
        countryPickerProps={{ translation: langue }}
        placeholder={t('RegisterScreen.Phone')}
        containerStyle={styles.phoneInputContainer}
        //textContainerStyle={styles.phoneInputTextContainer}
      />
      {!isValid && <Text style={styles.error}>{phoneError}</Text>}
          {/* <TextInput
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
          /> */}
        </View>
        <View style={styles.section}>
          <TextInput
            label={t('RegisterScreen.Password')}
            returnKeyType="next"
            value={password}
            onChangeText={text => handlePassword(text)}
            error={!!passwordError}
            errorText={passwordError}
            secureTextEntry
          />
        </View>
        <View style={styles.section}>
          <TextInput
            label={t('RegisterScreen.RetapePassword')}
            returnKeyType="done"
            value={retapePassword}
            onChangeText={text => handleRetapePassword(text)}
            error={!!retapePasswordError}
            errorText={retapePasswordError}
            secureTextEntry
          />
        </View>
      </ScrollView>
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


export default RegisterScreen;
