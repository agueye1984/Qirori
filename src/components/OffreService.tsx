import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/theme';
import TextInput from './TextInput';
import { Button } from 'react-native-paper'; // Assurez-vous d'importer Button depuis react-native-paper
import { theme } from '../core/theme';
import { getFilteredRecords, addRecord } from '../services/FirestoreServices'; // Ajoutez addRecord pour ajouter un enregistrement à Firestore

type Props = {
  setOffreService: (value: string[]) => void;
};

export const OffreService = ({ setOffreService }: Props) => {
  const { ColorPallet } = useTheme();
  const { i18n, t } = useTranslation();
  const [typeOffres, setTypeOffres] = useState<{ id: string; name: string }[]>([]);
  const selectedLanguageCode = i18n.language;
  const [showCustomRegionInput, setShowCustomRegionInput] = useState<boolean>(false);
  const [customOffre, setCustomOffre] = useState<string>('');
  const [selectedOffres, setSelectedOffres] = useState<string[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getFilteredRecords('type_offres', 'nameFr', '');
        if (selectedLanguageCode === 'en') {
          data = await getFilteredRecords('type_offres', 'nameEn', '');
        }

        const offre = {
          id: '-1',
          name: t('Dropdown.Autre'),
        };
        const newOffre = data.map((record) => ({
          id: record.id,
          name: selectedLanguageCode === 'fr' ? record.data.nameFr : record.data.nameEn,
        }));

        newOffre.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        newOffre.push(offre);
        setTypeOffres(newOffre);
        console.log('Fetched typeOffres:', newOffre);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedLanguageCode, t]);

  const handleOffreService = (values: string[]) => {
    console.log('handleOffreService values:', values);

    if (Array.isArray(values)) {
      if (values.includes('-1')) {
        setShowCustomRegionInput(true);
        setDropdownVisible(false);
      } else {
        setShowCustomRegionInput(false);
        setDropdownVisible(true);
      }
      setOffreService(values);
      setSelectedOffres(values);
    } else {
      console.warn('Expected array but got:', values);
    }
  };

  const handleAddCustomRegion = async () => {
    try {
      // Add the new offer to Firestore
      const newRegionData = { nameFr: customOffre, nameEn: customOffre };
      const newRegionRef = await addRecord('type_offres', newRegionData);
      const newRegionId = newRegionRef.id; // Get the new document ID

      const newRegion = { id: newRegionId, name: customOffre };
      setTypeOffres([...typeOffres, newRegion]);

      // Deselect "Autre" and select the new offer
      const updatedSelectedOffres = selectedOffres.filter(offre => offre !== '-1').concat(newRegionId);
      setSelectedOffres(updatedSelectedOffres);
      setOffreService(updatedSelectedOffres);

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
      alignItems:'center',
    },
    multiSelectText: {
      textAlign: 'center',
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
       //   tagRemoveIconColor="#CCC"
        //  tagBorderColor="#CCC"
        //  tagTextColor="#CCC"
        //  selectedItemTextColor="#CCC"
        //  selectedItemIconColor="#CCC"
       //   itemTextColor="#000"
          displayKey="name"
     //     searchInputStyle={{ color: '#CCC' }}
     //     submitButtonColor="#CCC"
     //     submitButtonText={t('Dropdown.Submit')}
     hideSubmitButton={true}
     // styleMainWrapper={styles.multiSelectMainWrapper} // Appliquez des styles personnalisés ici
          styleDropdownMenuSubsection={styles.multiSelectContainer} // Appliquez des styles personnalisés ici
          styleInputGroup={styles.multiSelectInputGroup} // Pour centrer le placeholder
        />
      )}
      {showCustomRegionInput && (
         <View>
        <View style={styles.customRegionContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter custom offer"
            value={customOffre}
            onChangeText={setCustomOffre}
          />
        </View>
        <Button mode="contained" onPress={handleAddCustomRegion} style={{ marginLeft: 10 }}>
            Add Offer
          </Button>
        </View>
      )}
    </View>
  );
};
