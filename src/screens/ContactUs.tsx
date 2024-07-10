import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {useTranslation} from 'react-i18next'
import Button from '../components/Button'
import {DescriptionContactUs} from '../components/DescriptionContactUs'
import {NameContactUs} from '../components/NameContactUs'

export const ContactUs = () => {
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [contactUsName, setContactUsName] = useState<string>('')
  const [nameDirty, setNameDirty] = useState(false)
  const [contactUsDescription, setContactUsDescription] = useState<string>('')
  const [descriptionDirty, setDescriptionDirty] = useState(false)

  const handleNameChange = (value: string) => {
    setNameDirty(true)
    setContactUsName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionDirty(true)
    setContactUsDescription(value)
  }

  const sendMessage = async () => {
    try {
    } catch (e: unknown) {}
  }

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('Setting.title')} />
      <Header>{t('Setting.ContactUs')}</Header>
      <ScrollView>
        <View style={defaultStyles.section}>
          <NameContactUs contactUsName={contactUsName} setContactUsName={handleNameChange} />
          {contactUsName.length === 0 && nameDirty && (
            <Text style={defaultStyles.error}>{t('Global.NameErrorEmpty')}</Text>
          )}
        </View>
        <View style={defaultStyles.section}>
          <DescriptionContactUs
            maxLength={500}
            contactUsDescription={contactUsDescription}
            setContactUsDescription={handleDescriptionChange}
          />
          {contactUsDescription.length === 0 && descriptionDirty && (
            <Text style={defaultStyles.error}>{t('Global.DescriptionErrorEmpty')}</Text>
          )}
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('Setting' as never)} style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={sendMessage} style={defaultStyles.button}>
            {t('Checkout.Send')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
