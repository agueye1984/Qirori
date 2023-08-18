import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'


type Props = {
  eventLocalisation: string
  setEventLocalisation: (value: string) => void
  containerStyles?: ViewStyle
}

export const EmplacementSection = ({ eventLocalisation, setEventLocalisation, containerStyles }: Props) => {
  const { t } = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  })

  return (
    <View>
      <Text style={styles.detailsTitle}>{t('AddEvent.Emplacement')}</Text>
      <CustomInputText
        value={eventLocalisation}
        setValue={setEventLocalisation}
        placeholder={t('AddEvent.Search')}
        containerStyle={containerStyles}
      />
      {/*<GooglePlacesAutocomplete
                  placeholder={t('AddEvent.Search')}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                  }}
                  query={{
                    key: 'AIzaSyDbMQzImF-zzj_-MDixW0nT4Sp243Mrs58e',
                    language: 'en',
                    components: 'country:ca',
                  }}
                  
                />*/}
    </View>
  )
}
