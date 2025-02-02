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
import {Location, PredictionType} from '../contexts/types';
import axios from 'axios';
import Config from 'react-native-config';
import { TextInput as PaperTextInput } from 'react-native-paper';
import { theme } from '../core/theme';

type Props = {
  addressLine: Location;
  setAddressLine: (value: Location) => void;
};

export const AdresseLine = ({
  addressLine,
  setAddressLine,
}: Props) => {
  const {t} = useTranslation();
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);

  const handleChange = async (text: string) => {
    let locations: Location = {placeId: '', description: text};
    setAddressLine(locations);
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
        const locations: Location = {
          placeId: placeId,
          description: description,
        };
        setAddressLine(locations);
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
    input: {
      width: '100%', // Prend toute la largeur du conteneur
      marginBottom: 15,
      //height: 50,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
      paddingHorizontal: 10,
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
        <PaperTextInput
           label={t('Checkout.AdresseLine1')}
          returnKeyType="done"
          value={addressLine.description}
          onChangeText={text => handleChange(text)}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View>{showPredictions && _renderPredictions(predictions)}</View>
    </SafeAreaView>
  );
};
