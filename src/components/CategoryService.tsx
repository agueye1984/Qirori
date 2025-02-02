import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {
  getFilteredByInRecords,
} from '../services/FirestoreServices';

type Props = {
  categoryService: string;
  setCategoryService: (value: string) => void;
  error: string;
  categoryVendeur: string[];
};

export const CategoryService = ({
  categoryService,
  setCategoryService,
  error,
  categoryVendeur,
}: Props) => {
  const {t, i18n} = useTranslation();
  const [categories, setCategories] = useState<any[]>([]);
  const {ColorPallet} = useTheme();
  const selectedLanguageCode = i18n.language;
  const defaultStyles = DefaultComponentsThemes();
  if (categoryVendeur.length === 1) {
    categoryService = categoryVendeur[0];
  }

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (categoryVendeur.length > 0) {
          const data = await getFilteredByInRecords(
            'categories',
            'id',
            categoryVendeur,
          );
          const newProd = data.map(record => ({
            key: record.id,
            value:
              selectedLanguageCode === 'fr'
                ? record.data.nameFr
                : record.data.nameEn,
          }));
          newProd.sort((a, b) =>
            a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
          );
          if (isMounted) {
            setCategories(newProd);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [categoryService, categoryVendeur]);

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
      maring: '0',
      borderBottomRightRadius: 4,
    },
    errorBorder: {
      borderColor: 'red', // Bordure rouge en cas d'erreur
      borderWidth: 1,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <View style={defaultStyles.sectionStyle}>
      <SelectList
        key={categoryService}
        boxStyles={
          error
            ? {...styles.container, ...styles.errorBorder}
            : styles.container
        }
        setSelected={(val: string) => setCategoryService(val)}
        data={categories}
        search={true}
        save="key"
        placeholder={t('Dropdown.Category')}
        defaultOption={
          categoryService
            ? categories.find(typ => typ.key === categoryService)
            : undefined
        }
        dropdownTextStyles={{backgroundColor: theme.colors.surface}}
        inputStyles={
          error
            ? {...styles.input, color: 'red'} // Placeholder en rouge en cas d'erreur
            : styles.input
        }
      />
    </View>
  );
};
