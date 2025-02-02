import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {NameFrSection} from '../components/NameFrSection';
import {NameEnSection} from '../components/NameEnSection';
import {nameSectionValidator} from '../core/utils';
import {ManageEventsParamList} from '../contexts/types';

export const AddTypeEvent = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddTypeEvent'>>();
  const isEditing = route.params?.isEditing || false;
  const typeEventToEdit = route.params?.item || null;
  const currentUser = auth().currentUser;
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [nameFr, setNameFr] = useState<string>(typeEventToEdit?.nameFr || '');
  const [nameEn, setNameEn] = useState<string>(typeEventToEdit?.nameEn || '');
  const [boutonActif, setBoutonActif] = useState(false);
  const [nameFrError, setNameFrError] = useState('');
  const [nameEnError, setNameEnError] = useState('');

  const handleNameFrChange = (value: string) => {
    setNameFrError('');
    setNameFr(value);
  };
  const handleNameEnChange = (value: string) => {
    setNameEnError('');
    setNameEn(value);
  };

  const handleSaveTypeEvents = async () => {
    setBoutonActif(true);
    try {
      const nameFREmpty = nameSectionValidator(nameFr, t);
      const nameENEmpty = nameSectionValidator(nameEn, t);
      if (nameFREmpty || nameENEmpty) {
        setNameFrError(nameFREmpty);
        setNameEnError(nameENEmpty);
        setBoutonActif(false);
        return;
      } else {
        const updatedTypeEvent = {
          nameFr: nameFr,
          nameEn: nameEn,
        };
        if (isEditing && typeEventToEdit?.id) {
          await firestore()
            .collection('type_events')
            .doc(typeEventToEdit.id)
            .update(updatedTypeEvent);
            setBoutonActif(false);
          console.log('Type Event updated!');
        } else {
          const uid = uuidv4();
          await firestore()
            .collection('type_events')
            .doc(uid)
            .set({
              id: uid,
              ...updatedTypeEvent,
              userId: currentUser?.uid,
            });
            setBoutonActif(false);
          console.log('Type Event added!');
        }
        
        navigation.navigate('TypeEvents' as never);
      }
    } catch (e: unknown) {
      setBoutonActif(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    section: {
      marginVertical: 10,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('TypeEvents.title')} />
      <Header>
        {isEditing ? t('EditTypeEvent.title') : t('AddTypeEvent.title')}
      </Header>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <NameFrSection
            nameFr={nameFr}
            setNameFr={handleNameFrChange}
            error={nameFrError}
          />
          {nameFrError && (
            <Text style={defaultStyles.error}>
              {t('Global.NameFrErrorEmpty')}
            </Text>
          )}
        </View>
        <View style={styles.section}>
          <NameEnSection
            nameEn={nameEn}
            setNameEn={handleNameEnChange}
            error={nameEnError}
          />
          {nameEnError && (
            <Text style={defaultStyles.error}>
              {t('Global.NameEnErrorEmpty')}
            </Text>
          )}
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('TypeEvents' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveTypeEvents}
            style={defaultStyles.button}
            disabled={boutonActif}>
            {isEditing ? t('Global.Modify') : t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
