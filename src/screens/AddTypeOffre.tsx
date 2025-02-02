import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import {NameFrSection} from '../components/NameFrSection';
import {NameEnSection} from '../components/NameEnSection';
import {categoryValidator, nameSectionValidator} from '../core/utils';
import {CategoryService} from '../components/CategoryService';
import { ManageEventsParamList } from '../contexts/types';

export const AddTypeOffre = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddTypeOffre'>>();
  const isEditing = route.params?.isEditing || false;
  const typeOffreToEdit = route.params?.item || null;
  const {t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [nameFr, setNameFr] = useState<string>(typeOffreToEdit?.nameFr || '');
  const [nameEn, setNameEn] = useState<string>(typeOffreToEdit?.nameEn || '');
  const [boutonActif, setBoutonActif] = useState(false);
  const [nameFrError, setNameFrError] = useState('');
  const [nameEnError, setNameEnError] = useState('');
  const [category, setCategory] = useState<string>(typeOffreToEdit?.category || '');
  const [categoryError, setCategoryError] = useState('');

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setCategories([]);
        } else {
          const newCat: string[] = [];
          querySnapshot.forEach(documentSnapshot => {
            newCat.push(documentSnapshot.id);
          });
          setCategories(newCat);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const handleNameFrChange = (value: string) => {
    setNameFrError('');
    setNameFr(value);
  };
  const handleNameEnChange = (value: string) => {
    setNameEnError('');
    setNameEn(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryError('');
    setCategory(value);
  };

  const handleSaveTypeEvents = async () => {
    setBoutonActif(true);
    try {
      const nameFREmpty = nameSectionValidator(nameFr, t);
      const nameENEmpty = nameSectionValidator(nameEn, t);
      const categoryEmpty = categoryValidator(category, t);
      if (nameFREmpty || nameENEmpty || categoryEmpty) {
        setNameFrError(nameFREmpty);
        setNameEnError(nameENEmpty);
        setCategoryError(categoryEmpty);
        setBoutonActif(false);
        return;
      } else {
        const updatedTypeOffre = {
          nameFr: nameFr,
          nameEn: nameEn,
          category: category,
        };
        if (isEditing && typeOffreToEdit?.id) {
          await firestore()
            .collection('type_offres')
            .doc(typeOffreToEdit.id)
            .update(updatedTypeOffre);
            setBoutonActif(false);
          console.log('Type Offer updated!');
        } else {
          const uid = uuidv4();
          await firestore()
            .collection('type_offres')
            .doc(uid)
            .set({
              id: uid,
              ...updatedTypeOffre,
            });
            setBoutonActif(false);
          console.log('Type Offer added!');
        }
        navigation.navigate('ManageTypeOffres' as never);
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
      <BacktoHome textRoute={t('TypeOffres.title')} />
      <Header> {isEditing ? t('EditTypeOffre.title') : t('AddTypeOffre.title')}</Header>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <CategoryService
            categoryService={category}
            setCategoryService={handleCategoryChange}
            error={categoryError}
            categoryVendeur={categories}
          />
          {categoryError && (
            <Text style={defaultStyles.error}>{categoryError}</Text>
          )}
        </View>
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
            onPress={() => navigation.navigate('ManageTypeOffres' as never)}
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
