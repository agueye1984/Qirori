import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { theme } from '../core/theme'

type Props = {
    textRoute: string
  };

export const BacktoHome = ({ textRoute }: Props) => {
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
      <TouchableOpacity style={[styles.touchableStyle]} onPress={() => navigation.goBack()}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', marginTop:5 }}>
            <Image source={require('../assets/back@20x20.png')} />
            </View>
          <View style={{ flexDirection: 'row', marginTop:5}}>
            <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 15, color: theme.colors.primary }]}>{textRoute}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </ScrollView>
    )

    return content
}
