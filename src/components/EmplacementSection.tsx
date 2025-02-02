import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Keyboard,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {Location, PredictionType} from '../contexts/types';
import axios from 'axios';
import Config from 'react-native-config';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { theme } from '../core/theme';
import { TextInput as PaperTextInput } from 'react-native-paper';

type Props = {
  eventLocalisation: Location;
  setEventLocalisation: (value: Location) => void;
  error: string;
  label:string;
};

export const EmplacementSection = ({
  eventLocalisation,
  setEventLocalisation,
  error,
  label
}: Props) => {
  const {t} = useTranslation();
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const [placeIds, setPlaceIds] = useState('');
  const defaultStyles = DefaultComponentsThemes();

  const handleChange = async (text: string) => {
    let locations: Location = {placeId: placeIds, description: text};
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
       // console.log(result);
       // console.log(result.data);
        const {
          data: {
            result: {
              geometry: {location},
              formatted_address,
            },
          },
        } = result;
       // const codePostal = result.data.formatted_address;
        setShowPredictions(false);
        const locations: Location = {
          placeId: placeId,
          description: description,
        };
        setPlaceIds(placeId);
        setEventLocalisation(locations);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
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
    input: {
      width: '100%', // Prend toute la largeur du conteneur
      marginBottom: 15,
      //height: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      paddingHorizontal: 10,
    },
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Enter') {
      Keyboard.dismiss(); // Masquer le clavier
    }
  };

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
    <View>
      <PaperTextInput
        label={label}
        returnKeyType="done"
        value={eventLocalisation.description}
        onChangeText={handleChange}
        multiline
        style={error ? [styles.input, styles.inputError] : styles.input }
        onSubmitEditing={Keyboard.dismiss}
        onKeyPress={handleKeyPress} // Interception de la touche "Entrée"
      />
      {error && <Text style={defaultStyles.error}>{error}</Text>}
      {showPredictions && _renderPredictions(predictions)}
    </View>
  );
  
  
 
  
};
