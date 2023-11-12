import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TextInput from './TextInput';
import {Location, PredictionType} from '../contexts/types';
import axios from 'axios';
import Config from 'react-native-config';

type Props = {
  eventLocalisation: Location;
  setEventLocalisation: (value: Location) => void;
  error: string;
};

export const EmplacementSection = ({
  eventLocalisation,
  setEventLocalisation,
  error,
}: Props) => {
  const {t} = useTranslation();
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const handleChange = async (text: string) => {
    let locations: Location = {placeId:'', description:text};
    setEventLocalisation(locations);
    if (text.trim() === '') {
      return;
    }
    const apiUrl = `${Config.GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${Config.GOOGLE_API_KEY}&input=${text}&components=country:ca`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {predictions},
        } = result;
        setPredictions(predictions);
        setShowPredictions(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${Config.GOOGLE_PACES_API_BASE_URL}/details/json?key=${Config.GOOGLE_API_KEY}&place_id=${placeId}&components=country:ca`;
    
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {
            result: {
              geometry: {location},
            },
          },
        } = result;
        setShowPredictions(false);
       const locations: Location = {placeId:placeId, description:description}
        setEventLocalisation(locations);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
    },
    inputStyle: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'white',
      borderRadius: 20,
      color: 'black',
      fontSize: 16,
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
    },
  });

  const _renderPredictions = (predictions: PredictionType[]) => {
    const {predictionRow} = styles;
    return (
      <FlatList
        data={predictions}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              key={index}
              style={predictionRow}
              onPress={() =>
                onPredictionTapped(item.place_id, item.description)
              }>
              <Text numberOfLines={1}>{item.description}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEnabled={false}
      />
    );
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          label={t('AddEvent.Emplacement')}
          returnKeyType="search"
          value={eventLocalisation.description}
          onChangeText={text => handleChange(text)}
          autoCapitalize="none"
          error={!!error}
          errorText={error}
        />
      </View>

      <View>{showPredictions && _renderPredictions(predictions)}</View>
    </SafeAreaView>
  );
};
