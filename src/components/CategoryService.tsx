import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import {CategoryList} from './CategoryList';

type Props = {
  categoryService: string;
  setCategoryService: (value: string) => void;
};

export const CategoryService = ({
  categoryService,
  setCategoryService,
}: Props) => {
  const {t} = useTranslation();
  const categories = CategoryList(t);
  const {ColorPallet} = useTheme();
  const [current, setCurrent] = useState({
    key: '',
    value: t('Dropdown.Category'),
  });

  let transformed = categories.map(({id, name}) => ({key: id, value: name}));

  transformed.push({key: '', value: t('Dropdown.Category')});
  transformed.sort((a, b) =>
    a.key.toLowerCase().localeCompare(b.key.toLowerCase()),
  );

  useEffect(() => {
    transformed.map(({key, value}) => {
      if (key === categoryService) {
        setCurrent({key: key, value: value});
      }
    });
  }, []);
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
  });

  const defaultOption = (): {key: string; value: string} | undefined => {
    if (current.key.length > 0) {
      return {key: current.key, value: current.value};
    }
    return undefined;
  };

  return (
    <View>
      <SelectList
        boxStyles={styles.container}
        setSelected={(val: string) => setCategoryService(val)}
        data={transformed}
        search={true}
        save="key"
        placeholder={t('Dropdown.Category')}
        defaultOption={defaultOption()}
        dropdownTextStyles={{ backgroundColor: theme.colors.surface}}
        inputStyles={{backgroundColor: theme.colors.surface}}
      />
    </View>
  );
};
