import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button as PaperButton, TextInput as PaperTextInput } from 'react-native-paper';
import Logo from '../components/Logo'; // Assurez-vous d'avoir le bon chemin pour l'import
import PhoneInput from 'react-native-phone-number-input';
import { Navigation } from '../types';
import { useTranslation } from 'react-i18next';
import { emailValidator, nameValidator, passwordValidator, retapePasswordValidator } from '../core/utils';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Header from '../components/Header';
import { theme } from '../core/theme';

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
  const {i18n, t} = useTranslation();
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
                  profilId: '2',
                  vendor: false,
                  actif: true,
                };
                const usersRef = firestore().collection('users');
                usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo centré */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Titre */}
        <Header>{t('RegisterScreen.title')}</Header>
        <Text style={styles.paragraph}>{t('RegisterScreen.paragraph')}</Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          {/* Champ Nom */}
          <PaperTextInput
            label={t('RegisterScreen.Name')}
            returnKeyType="next"
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleName(text)}
           style={nameError ? [styles.input, styles.inputError] : styles.input }
          />
          {nameError && <Text style={defaultStyles.error}>{nameError}</Text>}
          {/* Champ Email */}
          <PaperTextInput
            label={t('RegisterScreen.Email')}
            returnKeyType="done"
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleEmail(text)}
           style={emailError ? [styles.input, styles.inputError] : styles.input }
          />
          {emailError && <Text style={defaultStyles.error}>{emailError}</Text>}
          {/* Champ Phone */}
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

          {/* Champ Mot de Passe */}
          <PaperTextInput
            label={t('RegisterScreen.Password')}
            secureTextEntry
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handlePassword(text)}
            returnKeyType="done"
            style={passwordError ? [styles.input, styles.inputError] : styles.input }
          />
          {passwordError && <Text style={defaultStyles.error}>{passwordError}</Text>}
          {/* Champ Retaper Mot de Passe */}
          <PaperTextInput
            label={t('RegisterScreen.RetapePassword')}
            returnKeyType="done"
            secureTextEntry
            // Assurez-vous d'ajouter votre gestion d'état ici
            onChangeText={text => handleRetapePassword(text)}
            style={retapePasswordError ? [styles.input, styles.inputError] : styles.input }
          />
          {retapePasswordError && <Text style={defaultStyles.error}>{retapePasswordError}</Text>}
        </View>

        {/* Bouton d'inscription */}
        <PaperButton mode="contained" onPress={() => _onSignUpPressed()} style={styles.button}>
          {t('RegisterScreen.SignUp')}
        </PaperButton>

        {/* Texte déjà un compte */}
        <View style={styles.row}>
          <Text style={styles.label}>
            {t('RegisterScreen.AlreadyHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>{t('RegisterScreen.Login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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

export default RegisterScreen;
