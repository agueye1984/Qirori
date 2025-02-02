import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {useTranslation} from 'react-i18next'
import React, {useState} from 'react'
import {ScrollView, StyleSheet, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import Button from '../components/Button'
import {SafeAreaView} from 'react-native-safe-area-context'
import firestore from '@react-native-firebase/firestore'
import {NameFrSection} from '../components/NameFrSection'
import {NameEnSection} from '../components/NameEnSection'
import {nameSectionValidator, typeValidator} from '../core/utils'
import { SelectList } from 'react-native-dropdown-select-list'
import { theme } from '../core/theme'
import { ManageEventsParamList } from '../contexts/types'

export const AddTypePrix = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddTypePrix'>>();
  const isEditing = route.params?.isEditing || false;
  const typePrixToEdit = route.params?.item || null;
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [nameFr, setNameFr] = useState<string>(typePrixToEdit?.nameFr || '')
  const [nameEn, setNameEn] = useState<string>(typePrixToEdit?.nameEn || '')
  const [boutonActif, setBoutonActif] = useState(false)
  const [nameFrError, setNameFrError] = useState('')
  const [nameEnError, setNameEnError] = useState('')
  const [type, setType] = useState<string>(typePrixToEdit?.type || '')
  const [typeError, setTypeError] = useState('')

  const types: any[] = [
    {
      key: '1',
      value: t('Type.Product'),
    },
    {
      key: '2',
      value: t('Type.Service'),
    },
  ];

  const handleNameFrChange = (value: string) => {
    setNameFrError('')
    setNameFr(value)
  }
  const handleNameEnChange = (value: string) => {
    setNameEnError('')
    setNameEn(value)
  }

  const handleTypeChange = (value: string) => {
    setType(value)
    setTypeError('')
  }

  const handleSave = async () => {
    setBoutonActif(true)
    try {
      const typeEmpty = typeValidator(type, t)
      const nameFREmpty = nameSectionValidator(nameFr, t)
      const nameENEmpty = nameSectionValidator(nameEn, t)
      if (typeEmpty || nameFREmpty || nameENEmpty) {
        setTypeError(typeEmpty)
        setNameFrError(nameFREmpty)
        setNameEnError(nameENEmpty)
        setBoutonActif(false);
        return;
      } else {
        const updatedTypePrix = {
          nameFr: nameFr,
          nameEn: nameEn,
          type: type,
        };
        if (isEditing && typePrixToEdit?.id) {
          await firestore()
            .collection('type_prix')
            .doc(typePrixToEdit.id)
            .update(updatedTypePrix);
            setBoutonActif(false);
          console.log('Type Prix updated!');
        } else {
          const uid = uuidv4();
          await firestore()
            .collection('type_prix')
            .doc(uid)
            .set({
              id: uid,
              ...updatedTypePrix,
            });
            setBoutonActif(false);
          console.log('Type Prix added!');
        }
        navigation.navigate('ManageTypePrix' as never)
      }
    } catch (e: unknown) {
      setBoutonActif(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
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
    errorBorder: {
      borderColor: 'red', // Bordure rouge en cas d'erreur
      borderWidth: 1,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
    container1: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });


  return (
    <SafeAreaView style={styles.container1}>
      <BacktoHome textRoute={t('TypePrix.title')} />
      <Header>{isEditing ? t('EditTypePrix.title') : t('AddTypePrix.title')}</Header>

      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
      <SelectList
            //boxStyles={styles.container}
            setSelected={handleTypeChange}
            data={types}
            search={true}
            save="key"
            placeholder={t('Dropdown.Type')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={
              typeError
                ? {...styles.input, color: 'red'} // Placeholder en rouge en cas d'erreur
                : styles.input
            }
            defaultOption={types.find(typ => typ.key === type)}
            boxStyles={
              typeError
                ? {...styles.container, ...styles.errorBorder}
                : styles.container
            }
          />
           {typeError && (
            <Text style={defaultStyles.error}>{typeError}</Text>
          )}
        </View>
        <View style={styles.section}>
          <NameFrSection nameFr={nameFr} setNameFr={handleNameFrChange} error={nameFrError}/>
          {nameFrError && <Text style={defaultStyles.error}>{t('Global.NameFrErrorEmpty')}</Text>}
        </View>
        <View style={styles.section}>
        <NameEnSection nameEn={nameEn} setNameEn={handleNameEnChange} error={nameEnError}/>
          {nameEnError && <Text style={defaultStyles.error}>{t('Global.NameEnErrorEmpty')}</Text>}
        </View>
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ManageTypePrix' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSave} style={defaultStyles.button} disabled={boutonActif}>
          {isEditing ? t('Global.Modify') : t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
