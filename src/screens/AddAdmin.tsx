import React, {useRef, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import {Navigation} from '../types';
import {
  emailValidator,
  passwordValidator,
  nameValidator,
  retapePasswordValidator,
} from '../core/utils';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PhoneInput from 'react-native-phone-number-input';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';
import {
  TextInput as PaperTextInput,
} from 'react-native-paper';

type Props = {
  navigation: Navigation;
};

const AddAdmin = ({navigation}: Props) => {
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
  const {t, i18n} = useTranslation();
  const phoneInput = useRef<PhoneInput>(null);
  const selectedLanguageCode = i18n.language;
  const defaultStyles = DefaultComponentsThemes();
  let langue = 'fra';
  if (selectedLanguageCode == 'en') {
    langue = 'eng';
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

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name, t);
    let emailError = emailValidator(email, t);
    let passwordError = passwordValidator(password, t);
    let retapePasswordError = retapePasswordValidator(retapePassword, t);
    const checkValid = phoneInput.current?.isValidNumber(phone);
    let phoneError = checkValid ? '' : t('Global.PhoneError');
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
                  profilId: '1',
                  vendor: false,
                };
                const usersRef = firestore().collection('users');
                usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                    navigation.navigate('Administrators');
                  })
                  .catch((error: any) => {
                    console.log('error1 ' + error);
                  });
              })
              .catch((error: any) => {
                setEmailError(t('Global.AccountExists'));
                console.log('error2 ' + error);
              });
          } else {
            setPhoneError(t('Global.PhoneExisting'));
          }
        });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fff',
      paddingTop: 20,
    },
    scrollViewContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 20, // Marge sur les côtés
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    paragraph: {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 16,
    },
    formContainer: {
      width: '100%',
    },
    input: {
      width: '100%', // Prend toute la largeur du conteneur
      marginBottom: 15,
      height: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    phoneInputContainer: {
      marginBottom: 15,
    },
    button: {
      marginVertical: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
    },
    link: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled">
        <Header>{t('Administrators.AddButtonText')}</Header>
        <View style={styles.formContainer}>
          <PaperTextInput
            label={t('RegisterScreen.Name')}
            returnKeyType="next"
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleName(text)}
            style={nameError ? [styles.input, styles.inputError] : styles.input}
          />
          {nameError && <Text style={defaultStyles.error}>{nameError}</Text>}
          <PaperTextInput
            label={t('RegisterScreen.Email')}
            returnKeyType="done"
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleEmail(text)}
            style={
              emailError ? [styles.input, styles.inputError] : styles.input
            }
          />
          {emailError && <Text style={defaultStyles.error}>{emailError}</Text>}
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="CA"
            layout="first"
            onChangeText={text => {
              handlePhone(text);
            }}
            onChangeFormattedText={text => {
              handlePhone(text);
            }}
            withDarkTheme
            withShadow
            autoFocus
            countryPickerProps={{translation: langue}}
            placeholder={t('RegisterScreen.Phone')}
            //containerStyle={styles.input}
            containerStyle={phoneError ? [styles.input, styles.inputError] : styles.input }
            // textContainerStyle={styles.phoneInputTextContainer}
          />
          {phoneError && <Text style={defaultStyles.error}>{phoneError}</Text>}
          
          <PaperTextInput
            label={t('RegisterScreen.Password')}
            secureTextEntry
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handlePassword(text)}
            returnKeyType="done"
            style={
              passwordError ? [styles.input, styles.inputError] : styles.input
            }
          />
          {passwordError && (
            <Text style={defaultStyles.error}>{passwordError}</Text>
          )}
          <PaperTextInput
            label={t('RegisterScreen.RetapePassword')}
            returnKeyType="done"
            secureTextEntry
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleRetapePassword(text)}
            style={
              retapePasswordError
                ? [styles.input, styles.inputError]
                : styles.input
            }
          />
          {retapePasswordError && (
            <Text style={defaultStyles.error}>{retapePasswordError}</Text>
          )}
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Administrators' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={_onSignUpPressed}
            style={defaultStyles.button}>
            {t('Global.Save')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddAdmin;
