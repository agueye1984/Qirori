import React from 'react'
import { Image, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTheme } from '../contexts/theme'

import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { BacktoHome } from '../components/BacktoHome'
import { SettingsList } from '../components/SettingsList'
import { Accueil } from '../contexts/types'
import { SettingsItem } from '../components/SettingsItem'
import { useNavigation } from '@react-navigation/native'


export const Settings = () => {
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const { t } = useTranslation()
  const settings = SettingsList(t)
  const { navigate } = useNavigation()

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }
  return (
    <SafeAreaView>
      <ScrollView style={{ padding: 10 }}>
        <BacktoHome textRoute={t('HomeScreen.title')} />
        <Header>{t('Settings.title')}</Header>
        <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
          <View style={{ padding: 10 }}>
            {settings.map((item: Accueil) => {
              return <SettingsItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
