import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, View} from 'react-native';
import {emailValidator} from '../core/utils';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import { Button as PaperButton, TextInput as PaperTextInput } from 'react-native-paper';
import {theme} from '../core/theme';
import {useTranslation} from 'react-i18next';
import {useStore} from '../contexts/store';
import {StackNavigationProp} from '@react-navigation/stack';
import {ManageEventsParamList, User} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DefaultComponentsThemes from '../defaultComponentsThemes';

type OTPForgotPwdScreenProp = StackNavigationProp<
  ManageEventsParamList,
  'OTPForgotPwdScreen'
>;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const {t} = useTranslation();
  const navigation = useNavigation<OTPForgotPwdScreenProp>();
  const defaultStyles = DefaultComponentsThemes();

  const _onSendPressed = () => {
    let emailError = emailValidator(email, t);

    if (emailError) {
      setEmailError(emailError);
      return;
    } else {
      firestore().collection('users')
      // Filter results
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setEmailError(t('Global.EmailNotExist') + ' ' + email);
        } else {
           querySnapshot.forEach(async documentSnapshot => {
            const findUser = documentSnapshot.data() as User;
           // console.log(findUser)
             /*const confirmation = await auth().signInWithPhoneNumber(findUser.phoneNumber);
            navigation.navigate('OTPForgotPwdScreen', {confirmResult: confirmation}); */
           // auth().sendPasswordResetEmail(email).then(user=> {console.log(user)})
           auth()
        .signInWithEmailAndPassword(email, findUser.password)
        .then(response => {
          navigation.navigate('ResetPassword', {user: response.user.uid});
        })
           
          });
        }
      });
    }
  };

  const handleEmail = (text: string) => {
    setEmail(text);
    if (text === '') {
      setEmailError('');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <BackButton goBack={() => navigation.goBack()} />
        
        <View style={styles.centeredContent}>
          <Logo />
          <Header>{t('Global.RestorePassword')}</Header>
        </View>

        <PaperTextInput
          label="Adresse e-mail"
          returnKeyType="done"
          value={email}
          onChangeText={handleEmail}
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          style={emailError ? [styles.input, styles.inputError] : styles.input }
        />
        {emailError && <Text style={defaultStyles.error}>{emailError}</Text>}
        <PaperButton mode="contained" onPress={_onSendPressed} style={styles.button}>
          Vérifier l'e-mail
        </PaperButton>

        <TouchableOpacity style={styles.back} onPress={() => navigation.navigate('LoginScreen' as never)}>
          <Text style={styles.label}>← {t('Global.BackTologin')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%', // Prend toute la largeur du conteneur
    marginBottom: 15,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    marginVertical: 20,
  },
  back: {
    marginTop: 10,
    alignItems: 'center',
  },
  label: {
    color: '#007bff',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default ForgotPasswordScreen;
