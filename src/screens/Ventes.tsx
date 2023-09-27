import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTheme } from '../contexts/theme'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { BacktoHome } from '../components/BacktoHome'
import { VentesList } from '../components/VentesList'
import { useNavigation } from '@react-navigation/native'
import { Accueil } from '../contexts/types'
import { VentesItem } from '../components/VentesItem'
import { useStore } from '../contexts/store'


export const Ventes = () => {
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const { t } = useTranslation()
  const vente = VentesList(t)
  const { navigate } = useNavigation()
  const [state] = useStore()

  console.log(state)

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }


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

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Ventes.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
          <View style={{ padding: 10 }}>
            {vente.map((item: Accueil) => {
              return <VentesItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
    </SafeAreaView>
  )
}
