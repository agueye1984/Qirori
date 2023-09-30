import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import TextInput from './TextInput'
import { useNavigation } from '@react-navigation/native'
import { i18n } from '../localization'


type Props = {
  eventLocalisation: string
  setEventLocalisation: (value: string) => void
  containerStyles?: ViewStyle
}

export const EmplacementSection = ({ eventLocalisation, setEventLocalisation, containerStyles }: Props) => {
  const { t } = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation();
  const selectedLanguageCode = i18n.language;
  const placesRef = useRef().current;
  const styles = StyleSheet.create({
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
  })


  return (
    <View>
  {/* <TextInput
        label={t('AddEvent.Emplacement')}
        returnKeyType="next"
        value={eventLocalisation}
        onChangeText={text => setEventLocalisation(text)}
        autoCapitalize="none"
        onFocus={()=>{navigation.navigate("GooglePlacesInput" as never) }}
      />  */}
      <GooglePlacesAutocomplete
                  placeholder={t('Global.Search')}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                  }}
                  query={{
                    key: 'AIzaSyBOYlTgxyVJ99nwcgELBaUoZAFYB3H1y1A',
                    language: {selectedLanguageCode},
                    components: 'country:ca',
                  }}
                  fetchDetails={true}
        onFail={error => console.log(error)}
        onNotFound={() => console.log('no results')}
        ref={placesRef}
                />
    </View>
  )
}
