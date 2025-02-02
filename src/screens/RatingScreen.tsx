import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import {ManageEventsParamList} from '../contexts/types';
import firestore from '@react-native-firebase/firestore';
import {LargeButton} from '../components/LargeButton';
import {useTranslation} from 'react-i18next';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';

const RatingScreen = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ManageEventsParamList, 'RatingScreen'>>();
  const item = route.params.item;
  const {t} = useTranslation();

  const handleSubmit = () => {
    // Logique pour soumettre la notation et la critique
    firestore()
      .collection('commandes')
      .doc(item.id)
      .update({
        rating: rating,
        avis: review,
      })
      .then(() => {
        navigation.navigate('ProductOrderings' as never);
      });
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === 'Enter') {
      Keyboard.dismiss(); // Masquer le clavier
    }
  };

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('ProductOrderings.title')} />
      <Header>{t('RatingScreen.title')}</Header>
      <View style={styles.section}>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={rating}
          selectedStar={(rating: React.SetStateAction<number>) =>
            setRating(rating)
          }
          fullStarColor={'gold'}
          emptyStarColor={'grey'}
          starSize={30}
        />
        <TextInput
          style={styles.textInput}
          placeholder={t('RatingScreen.avis')}
          multiline
          value={review}
          onChangeText={setReview}
          onSubmitEditing={Keyboard.dismiss}
          onKeyPress={handleKeyPress} // Interception de la touche "Entrée"
        />

        <LargeButton
          title={t('Global.Submit')}
          action={handleSubmit}
          isPrimary={true}
        />
        <View style={styles.spacer} />
        <LargeButton
          title={t('Global.Back')}
          action={() => navigation.goBack()}
          isPrimary={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16,
    padding: 8,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  spacer: {
    height: 10, // Ajustez cette valeur pour plus ou moins d'espace
  },
  section: {
    marginHorizontal: 10,
    paddingVertical: 5,
  },
});

export default RatingScreen;
