import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SelectList} from 'react-native-dropdown-select-list';
import {theme} from '../core/theme';
import firestore from '@react-native-firebase/firestore';
import {Category} from '../contexts/types';
import {TextInput as PaperTextInput} from 'react-native-paper';

interface FiltersProps {
  setSelectedZone: (zone: string) => void;
  setSelectedFormula: (formula: string) => void;
  setParticipantCount: (count: number) => void;
  serviceCategory: string;
  handleCategoryChange: (value: string) => void;
  zones: {key: string; value: string}[];
  formulas: {key: string; value: string}[];
}

const Filters: React.FC<FiltersProps> = ({
  setSelectedZone,
  setSelectedFormula,
  setParticipantCount,
  serviceCategory,
  handleCategoryChange,
  zones,
  formulas,
}) => {
  const {t, i18n} = useTranslation();
  const [selectedZone, setSelectedZoneState] = useState<string>('');
  const [selectedFormula, setSelectedFormulaState] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const selectedLanguageCode = i18n.language;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categories')
      .where('actif','==', true)
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setCategories([]);
        } else {
          const newCat: any[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const cat = documentSnapshot.data() as Category;
            const tabCat = {
              key: cat.id,
              value: selectedLanguageCode === 'fr' ? cat.nameFr : cat.nameEn,
            };
            newCat.push(tabCat);
          });
          newCat.sort((a, b) =>
            a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
          );
          setCategories(newCat);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const handleZoneChange = (val: string) => {
    setSelectedZone(val);
    setSelectedZoneState(val);
  };

  const handleFormulaChange = (val: string) => {
    setSelectedFormula(val);
    setSelectedFormulaState(val);
  };

  return (
    <View style={styles.filters}>
      <SelectList
        key={serviceCategory}
        boxStyles={styles.selectList}
        setSelected={handleCategoryChange}
        data={categories}
        search={true}
        save="key"
        placeholder={t('Dropdown.Category')}
        defaultOption={categories.find(cat => cat.key === serviceCategory)}
        dropdownTextStyles={{backgroundColor: theme.colors.surface}}
        inputStyles={styles.inputStyles}
      />

      <SelectList
        boxStyles={styles.selectList}
        setSelected={handleZoneChange}
        data={zones}
        search={true}
        save="key"
        placeholder={t('Dropdown.Zone')}
        dropdownTextStyles={styles.dropdownText}
        inputStyles={styles.inputStyles}
        defaultOption={zones.find(zone => zone.key === selectedZone)}
      />

      <SelectList
        boxStyles={styles.selectList}
        setSelected={handleFormulaChange}
        data={formulas}
        search={true}
        save="key"
        placeholder={t('Dropdown.Formula')}
        dropdownTextStyles={styles.dropdownText}
        inputStyles={styles.inputStyles}
        defaultOption={formulas.find(
          formula => formula.key === selectedFormula,
        )}
      />

      <PaperTextInput
        style={styles.textInput}
        placeholder={t('Global.Participants')}
        keyboardType="numeric"
        returnKeyType="done"
        onChangeText={text => setParticipantCount(Number(text))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filters: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  selectList: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Couleur d'arrière-plan plus douce
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  inputStyles: {
    fontSize: 14,
    color: '#555',
    backgroundColor: '#f9f9f9',
  },
  textInput: {
    backgroundColor: theme.colors.surface,
  },
});

export default Filters;
