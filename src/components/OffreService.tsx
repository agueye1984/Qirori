import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import {Button} from 'react-native-paper'; // Assurez-vous d'importer Button depuis react-native-paper
import {theme} from '../core/theme';
import {addRecord, checkIfDocumentExists} from '../services/FirestoreServices'; // Ajoutez addRecord pour ajouter un enregistrement à Firestore
import firestore from '@react-native-firebase/firestore';
import {TypeOffre} from '../contexts/types';
import {v4 as uuidv4} from 'uuid';
import {TextInput as PaperTextInput} from 'react-native-paper';

type Props = {
  setOffre: (value: string[]) => void;
  category: string;
  defaultSelectedOffres: string[];
};

export const OffreService = ({
  setOffre,
  category,
  defaultSelectedOffres,
}: Props) => {
  const {ColorPallet} = useTheme();
  const {i18n, t} = useTranslation();
  const [typeOffres, setTypeOffres] = useState<{id: string; name: string}[]>(
    [],
  );
  const selectedLanguageCode = i18n.language;
  const [showCustomRegionInput, setShowCustomRegionInput] =
    useState<boolean>(false);
  const [customOffre, setCustomOffre] = useState<string>('');
  const [selectedOffres, setSelectedOffres] = useState<string[]>(
    defaultSelectedOffres,
  );
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);

  useEffect(() => {
    setSelectedOffres(defaultSelectedOffres);
  }, [defaultSelectedOffres]);

  useEffect(() => {
    // Quand la catégorie change, on vide les offres sélectionnées
    setSelectedOffres([]);
    setOffre([]); // Réinitialise également l'état dans le composant parent
  }, [category]); // Exécuter ce useEffect à chaque changement de catégorie

  // console.log(defaultSelectedOffres)

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('type_offres')
      .where('actif', '==', true)
      .where('category', '==', category)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setTypeOffres([]);
        } else {
          const newOffre: any[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const typeOffreData = documentSnapshot.data() as TypeOffre;
            typeOffreData.id = documentSnapshot.id; // ajouter l'id du document

            if (selectedLanguageCode === 'en') {
              const offer = {
                id: typeOffreData.id,
                name: typeOffreData.nameEn,
              };
              newOffre.push(offer);
              newOffre.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              );
            } else {
              const offer = {
                id: typeOffreData.id,
                name: typeOffreData.nameFr,
              };
              //  console.log(offer)
              newOffre.push(offer);
              newOffre.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
              );
            }
          });
          const offre = {
            id: '-1',
            name: t('Dropdown.Autre'),
          };
          newOffre.push(offre);
          setTypeOffres(newOffre);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [selectedLanguageCode, t, category]);

  //console.log(typeOffres)

  const handleOffreService = (values: string[]) => {
    // console.log(values)
    if (Array.isArray(values)) {
      if (values.includes('-1')) {
        setShowCustomRegionInput(true);
        setDropdownVisible(false);
      } else {
        setShowCustomRegionInput(false);
        setDropdownVisible(true);
      }
      setOffre(values);
      setSelectedOffres(values);
    } else {
      console.warn('Expected array but got:', values);
    }
  };

  const handleAddCustomRegion = async () => {
    try {
      const offreExists = await checkIfDocumentExists('type_offres', {
        [`name${selectedLanguageCode.toUpperCase()}`]: customOffre,
      });
  
      if (offreExists) {
        console.log('Un type d offres avec ce nom existe déjà.');
        return; // Arrêtez si le type de prix existe déjà
      }
      // Add the new offer to Firestore
      const uid = uuidv4();
      const newOffreData = {
        id: uid,
        nameFr: selectedLanguageCode === 'fr' ? customOffre : '',
        nameEn: selectedLanguageCode === 'en' ? customOffre : '',
        category: category,
        actif: true,
      };
      await addRecord('type_offres', newOffreData, uid);
      const newOffreId = uid; // Get the new document ID

      const newOffre = {id: newOffreId, name: customOffre};
      setTypeOffres([...typeOffres, newOffre]);

      // Deselect "Autre" and select the new offer
      const updatedSelectedOffres = selectedOffres
        .filter(offre => offre !== '-1')
        .concat(newOffreId);
      setSelectedOffres(updatedSelectedOffres);
      setOffre(updatedSelectedOffres);

      setCustomOffre('');
      setShowCustomRegionInput(false);
      setDropdownVisible(true);
    } catch (error) {
      console.error('Error adding custom region:', error);
    }
  };

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
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      margin: 0,
      borderBottomRightRadius: 4,
    },
    customRegionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginRight: 10,
      flex: 1,
    },
    multiSelectContainer: {
      /* borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5, */
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
    multiSelectMainWrapper: {
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
    multiSelectInputGroup: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    multiSelectText: {
      textAlign: 'center',
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

  return (
    <View>
      {dropdownVisible && (
        <MultiSelect
          items={typeOffres}
          uniqueKey="id"
          onSelectedItemsChange={handleOffreService}
          selectedItems={selectedOffres}
          selectText={t('Dropdown.Offre')}
          searchInputPlaceholderText={t('Dropdown.Search')}
          displayKey="name"
          hideSubmitButton={true}
          styleDropdownMenuSubsection={styles.multiSelectContainer} // Appliquez des styles personnalisés ici
          styleInputGroup={styles.multiSelectInputGroup} // Pour centrer le placeholder
          styleTextDropdown={styles.multiSelectText}
        />
      )}
      {showCustomRegionInput && (
        <View>
          <View>
            <PaperTextInput
              style={styles.input}
              placeholder={t('Global.Offre')}
              value={customOffre}
              onChangeText={setCustomOffre}
              returnKeyType="done"
            />
          </View>
          <Button
            mode="contained"
            onPress={handleAddCustomRegion}
            style={{marginLeft: 10}}>
            {t('Global.Add')}
          </Button>
        </View>
      )}
    </View>
  );
};
