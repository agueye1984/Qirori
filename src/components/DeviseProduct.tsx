import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {getSupportedCurrencies} from 'react-native-format-currency';
import {theme} from '../core/theme';

type Props = {
  productDevise: string;
  setProductDevise: (value: string) => void;
};

export const DeviseProduct = ({productDevise, setProductDevise}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const [current, setCurrent] = useState({
    key: '',
    value: t('Dropdown.Select'),
  });

  let transformed = getSupportedCurrencies().map(({code, name}) => ({
    key: code,
    value: code + ': ' + name,
  }));

  transformed.push({key: '', value: t('Dropdown.Select')});
  transformed.sort((a, b) =>
    a.key.toLowerCase().localeCompare(b.key.toLowerCase()),
  );
  useEffect(() => {
    const devise = transformed.find(item => item.key === productDevise)
    setCurrent({key: devise===undefined ? '': devise.key, value: devise===undefined ? '': devise.value})

  }, [productDevise]);

console.log(current)
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
        setSelected={(val: string) => setProductDevise(val)}
        data={transformed}
        search={true}
        save="key"
        placeholder={t('Dropdown.Select')}
        defaultOption={defaultOption()}
        dropdownTextStyles={{fontWeight: '600'}}
        inputStyles={{fontWeight: '600'}}
      />
    </View>
  );
};
