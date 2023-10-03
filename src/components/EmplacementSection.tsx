import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { CustomInputText } from './CustomInputText'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import TextInput from './TextInput'
import { useNavigation } from '@react-navigation/native'
import { i18n } from '../localization'
import Geolocation from '@react-native-community/geolocation';
import { PredictionType } from '../contexts/types';
import axios from 'axios'
import { useDebounce } from '../hooks/useDebounce'
import SearchBarWithAutocomplete from './SearchBarWithAutocomplete'
import { SelectList } from 'react-native-dropdown-select-list';

import Config from "react-native-config";

console.log(Config.GOOGLE_API_KEY); // https://example.com/api


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
  const [search, setSearch] = useState({ term: '', fetchPredictions: false })
  const [showPredictions, setShowPredictions] = useState(false)
  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const GOOGLE_PLACES_API_BASE_URL = Config.GOOGLE_PACES_API_BASE_URL
  const GOOGLE_API_KEY = Config.GOOGLE_API_KEY
  
  const handleChange = async (text: string) => {
    setEventLocalisation(text);
    if (text.trim() === '') return
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json?key=${GOOGLE_API_KEY}&input=${text}&components=country:ca`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl
      })
      if (result) {
        const { data: { predictions } } = result
        setPredictions(predictions)
        setShowPredictions(true)
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/details/json?key=${GOOGLE_API_KEY}&place_id=${placeId}&components=country:ca`
    console.log(placeId)
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl
      })
      if (result) {
        const { data: { result: { geometry: { location } } } } = result
        const { lat, lng } = location
        setShowPredictions(false)
        setSearch({ term: description, fetchPredictions: false })
        setEventLocalisation(description);
      }
    } catch (e) {
      console.log(e)
    }
  }



  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center'
    },
    inputStyle: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'white',
      borderRadius: 20,
      color: 'black',
      fontSize: 16
    },
    predictionsContainer: {
      backgroundColor: 'white',
      padding: 10,
     // borderBottomLeftRadius: 10,
     // borderBottomRightRadius: 10
    },
    predictionRow: {
      paddingBottom: 15,
      marginBottom: 15,
      borderBottomColor: 'black',
      borderBottomWidth: 1,
    }
  })

  const _renderPredictions = (predictions: PredictionType[]) => {
    const {
      predictionsContainer,
      predictionRow
    } = styles
    return (
      <FlatList
        data={predictions}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              key={index}
              style={predictionRow}
              onPress={() => onPredictionTapped(item.place_id, item.description)}
            >
              <Text
                numberOfLines={1}
              >
                {item.description}
              </Text>
            </TouchableOpacity>
          )
        }}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps='handled'
       // nestedScrollEnabled 
       nestedScrollEnabled={true}
       scrollEnabled={false}
      />
      

    )
  }


  return (
    <SafeAreaView>
      <View>
        <TextInput
          label={t('AddEvent.Emplacement')}
          returnKeyType="search"
          value={eventLocalisation}
          onChangeText={text => handleChange(text)}
          autoCapitalize="none"
        />
      </View>

      <View>
      {showPredictions && _renderPredictions(predictions)}
      </View>
    </SafeAreaView>
  )
}
