import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import Header from '../components/Header'
import defaultComponentsThemes from '../defaultComponentsThemes'
import {useStore} from '../contexts/store'
import {useNavigation} from '@react-navigation/native'
import {DispatchAction} from '../contexts/reducers/store'
import Icon from 'react-native-vector-icons/Fontisto'
import {theme} from '../core/theme'
import {LargeButton} from '../components/LargeButton'
import countries from 'i18n-iso-countries'
import frLocale from 'i18n-iso-countries/langs/fr.json'
import enLocale from 'i18n-iso-countries/langs/en.json'

export const CountrySetting = () => {
  const {t, i18n} = useTranslation()
  const defaultStyles = defaultComponentsThemes()
  const [state, dispatch] = useStore()
  const navigation = useNavigation()
  const [countryCode, setCountryCode] = useState(state.country.toString())
  const [updatedSetting, setUpdatedSetting] = useState(false)
  const [pays, setPays] = useState<any[]>([])

  const selectedLanguageCode = i18n.language

  useEffect(() => {
    countries.registerLocale(frLocale)
    if (selectedLanguageCode == 'en') {
      countries.registerLocale(enLocale)
    }
    const countryObj = countries.getNames(selectedLanguageCode)
    setPays(
      Object.entries(countryObj).map(([key, value]) => ({
        key: key,
        value: value,
      }))
    )
  }, [selectedLanguageCode])

  const setSelectedCountry = (code: string) => {
    setUpdatedSetting(true)
    setCountryCode(code)
  }

  const setCountry = (code: string) => {
    dispatch({
      type: DispatchAction.UPDATE_COUNTRY,
      payload: code,
    })
    navigation.goBack()
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header>{t('Setting.CountrySetting')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        {pays.map((country, index: number) => {
          const selectedCurrency = country.key === countryCode
          return (
            <View key={index}>
              <TouchableOpacity style={defaultStyles.itemContainer} onPress={() => setSelectedCountry(country.key)}>
                <View style={defaultStyles.touchableStyle}>
                  {selectedCurrency ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name={'radio-btn-active'} size={20} color={theme.colors.primary} />
                      <Text style={[defaultStyles.text, {paddingLeft: 5, fontWeight: 'bold'}]}>{country.value}</Text>
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name={'radio-btn-passive'} size={20} color={theme.colors.primary} />
                      <Text style={[defaultStyles.text, {paddingLeft: 5}]}>{country.value}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )
        })}
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        {updatedSetting ? (
          <View style={defaultStyles.buttonsContainer}>
            <LargeButton title={t('Global.Save')} action={() => setCountry(countryCode)} isPrimary={true} />
          </View>
        ) : null}
        <View style={defaultStyles.buttonsContainer}>
          <LargeButton title={t('Global.Cancel')} action={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  )
}
