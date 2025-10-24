import React, { useState } from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import MultiSelect from 'react-native-multiple-select';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';

type Props = {
  categoryService: string[];
  setCategoryService: (value: string[]) => void;
  error: string;
  categories: any[];
};

export const CategorySection = ({
  categoryService,
  setCategoryService,
  error,
  categories
}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const defaultStyles = DefaultComponentsThemes();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryService,
  );

  const handleCategorieService = (values: string[]) => {
    // console.log(values)
    if (Array.isArray(values)) {
      
      setCategoryService(values);
      setSelectedCategories(values);
    } else {
      console.warn('Expected array but got:', values);
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
  });

  return (
    <View style={defaultStyles.sectionStyle}>
      {/* <SelectList
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
      /> */}
      <MultiSelect
          items={categories}
          uniqueKey="key"
          onSelectedItemsChange={handleCategorieService}
          selectedItems={selectedCategories}
          selectText={t('Dropdown.Category')}
          searchInputPlaceholderText={t('Dropdown.Search')}
          displayKey="value"
          hideSubmitButton={true}
          styleDropdownMenuSubsection={styles.multiSelectContainer} // Appliquez des styles personnalisés ici
          styleInputGroup={styles.multiSelectInputGroup} // Pour centrer le placeholder
          styleTextDropdown={styles.multiSelectText}
        />
    </View>
  );
};
