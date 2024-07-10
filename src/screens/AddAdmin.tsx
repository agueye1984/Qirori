import React, {useRef, useState} from 'react'
import {View, Text, ScrollView} from 'react-native'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import {Navigation} from '../types'
import {emailValidator, passwordValidator, nameValidator, retapePasswordValidator} from '../core/utils'
import {useTranslation} from 'react-i18next'
import {SafeAreaView} from 'react-native-safe-area-context'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import PhoneInput from 'react-native-phone-number-input'
import DefaultComponentsThemes from '../defaultComponentsThemes'

type Props = {
  navigation: Navigation
}

const AddAdmin = ({navigation}: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [retapePassword, setRetapePassword] = useState('')
  const [phone, setPhone] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [retapePasswordError, setRetapePasswordError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const {t, i18n} = useTranslation()
  const phoneInput = useRef<PhoneInput>(null)
  const [isValid, setIsValid] = useState(true)
  const selectedLanguageCode = i18n.language
  const defaultStyles = DefaultComponentsThemes()
  let langue = 'fra'
  if (selectedLanguageCode == 'en') {
    langue = 'eng'
  }

  const handleName = (text: string) => {
    setName(text)
    setNameError('')
  }

  const handleEmail = (text: string) => {
    setEmail(text)
    setEmailError('')
  }

  const handlePassword = (text: string) => {
    setPassword(text)
    setPasswordError('')
  }

  const handleRetapePassword = (text: string) => {
    setRetapePassword(text)
    setRetapePasswordError('')
  }

  const handlePhone = (text: string) => {
    setPhone(text)
    setPhoneError('')
  }

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name, t)
    let emailError = emailValidator(email, t)
    let passwordError = passwordValidator(password, t)
    let retapePasswordError = retapePasswordValidator(retapePassword, t)
    const checkValid = phoneInput.current?.isValidNumber(phone)
    setIsValid(!!checkValid)
    let phoneError = checkValid ? '' : t('Global.PhoneError')
    if (password != '' && retapePassword != '' && password != retapePassword) {
      retapePasswordError = t('Global.PasswordNotConfirm')
    }

    if (emailError || passwordError || nameError || retapePasswordError || phoneError) {
      setNameError(nameError)
      setEmailError(emailError)
      setPasswordError(passwordError)
      setRetapePasswordError(retapePasswordError)
      setPhoneError(phoneError)
    } else {
      firestore()
        .collection('users')
        // Filter results
        .where('phoneNumber', '==', phone)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            auth()
              .createUserWithEmailAndPassword(email, password)
              .then((response: {user: {uid: any}}) => {
                const uid = response.user.uid
                const data = {
                  id: uid,
                  email: email,
                  displayName: name,
                  phoneNumber: phone,
                  password: password,
                  profilId: '1',
                  vendor: false,
                }
                const usersRef = firestore().collection('users')
                usersRef
                  .doc(uid)
                  .set(data)
                  .then(() => {
                    navigation.navigate('Administrators')
                  })
                  .catch((error: any) => {
                    console.log('error1 ' + error)
                  })
              })
              .catch((error: any) => {
                setEmailError(t('Global.AccountExists'))
                console.log('error2 ' + error)
              })
          } else {
            setPhoneError(t('Global.PhoneExisting'))
          }
        })
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header>{t('Administrators.AddButtonText')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <TextInput
            label={t('RegisterScreen.Name')}
            returnKeyType="next"
            value={name}
            onChangeText={(text) => handleName(text)}
            error={!!nameError}
            errorText={nameError}
          />
        </View>
        <View style={defaultStyles.section}>
          <TextInput
            label={t('RegisterScreen.Email')}
            returnKeyType="next"
            value={email}
            onChangeText={(text) => handleEmail(text)}
            error={!!emailError}
            errorText={emailError}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>
        <View style={defaultStyles.section}>
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="CA"
            layout="first"
            onChangeText={(text) => {
              handlePhone(text)
            }}
            onChangeFormattedText={(text) => {
              handlePhone(text)
            }}
            withDarkTheme
            withShadow
            autoFocus
            countryPickerProps={{translation: langue}}
            placeholder={t('RegisterScreen.Phone')}
            containerStyle={defaultStyles.phoneInputContainer}
          />
          {!isValid && <Text style={defaultStyles.error}>{phoneError}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <TextInput
            label={t('RegisterScreen.Password')}
            returnKeyType="next"
            value={password}
            onChangeText={(text) => handlePassword(text)}
            error={!!passwordError}
            errorText={passwordError}
            secureTextEntry
          />
        </View>
        <View style={defaultStyles.section}>
          <TextInput
            label={t('RegisterScreen.RetapePassword')}
            returnKeyType="done"
            value={retapePassword}
            onChangeText={(text) => handleRetapePassword(text)}
            error={!!retapePasswordError}
            errorText={retapePasswordError}
            secureTextEntry
          />
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
          <Button mode="contained" onPress={_onSignUpPressed} style={defaultStyles.button}>
            {t('Global.Save')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AddAdmin
