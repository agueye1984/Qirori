import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

type Props = {
    route: string
    textRoute: string
  };

export const BacktoHome = ({ route, textRoute }: Props) => {
    const navigation = useNavigation()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const { t } = useTranslation()

    const styles = StyleSheet.create({
        touchableStyle: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
        },
        row: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
    })

    let content = (
        <ScrollView style={{padding: 10}}>
      <TouchableOpacity style={[styles.touchableStyle]} onPress={() => navigation.navigate(route as never)}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', marginTop:5 }}>
            <Image source={require('../assets/back@20x20.png')} />
            </View>
          <View style={{ flexDirection: 'row', marginTop:5}}>
            <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 15, color: ColorPallet.primary }]}>{textRoute}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </ScrollView>
    )

    return content
}
