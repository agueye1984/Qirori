import React, { useEffect, useState } from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import defaultComponentsThemes from '../defaultComponentsThemes';
import { LargeButton } from '../components/LargeButton';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../contexts/store';
import { DispatchAction } from '../contexts/reducers/store';
import Icon from 'react-native-vector-icons/Fontisto';
import {theme} from '../core/theme';
import CurrencyList from 'currency-list';

export const DeviseSetting = () => {
  const {t, i18n} = useTranslation();
  const defaultStyles = defaultComponentsThemes();
  const [state, dispatch] = useStore();
  const navigation = useNavigation();
  const [currencyCode, setCurrencyCode] = useState(state.currency.toString());
  const [updatedSetting, setUpdatedSetting] = useState(false);
  const [devises, setDevises] = useState<any[]>([])
  const selectedLanguageCode = i18n.language;
 
  let languageDate = 'fr_FR';
  if (selectedLanguageCode == 'en') {
    languageDate = 'en_GB';
  }

  useEffect(() => {
    const currencie = CurrencyList.getAll(languageDate);
    const currencies: any[] = []
    for (const [key, value] of Object.entries(currencie)) {
      const devise = {
        key: key,
        value: key + ': ' + value.name,
      }
      currencies.push(devise);
    }
    setDevises(currencies)
  }, [languageDate])
 

  const setSelectedCurrency = (code: string) => {
    setUpdatedSetting(true);
    setCurrencyCode(code);
  };

  const setCurrency = (code: string) => {
    dispatch({
      type: DispatchAction.UPDATE_CURRENCY,
      payload: code,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header>{t('Setting.DeviseSetting')}</Header>
      <ScrollView scrollEnabled
        showsVerticalScrollIndicator>
      {devises.map((devise, index: number) => {
        const selectedCurrency = devise.key === currencyCode;
        return (
          <View key={index}>
            <TouchableOpacity
              style={defaultStyles.itemContainer}
              onPress={() => setSelectedCurrency(devise.key)}>
              <View style={defaultStyles.touchableStyle}>
                {selectedCurrency ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name={'radio-btn-active'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        defaultStyles.text,
                        {paddingLeft: 5, fontWeight: 'bold'},
                      ]}>
                      {devise.value}
                    </Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name={'radio-btn-passive'}
                      size={20}
                      color={theme.colors.primary}
                    />
                    <Text style={[defaultStyles.text, {paddingLeft: 5}]}>
                    {devise.value}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
      {updatedSetting ? (
        <View style={defaultStyles.buttonsContainer}>
          <LargeButton
            title={t('Global.Save')}
            action={() => setCurrency(currencyCode)}
            isPrimary={true}
          />
        </View>
      ) : null}
       <View style={defaultStyles.buttonsContainer}>
          <LargeButton
            title={t('Global.Cancel')}
            action={() => navigation.goBack()}
          />
        </View>
        </View>
    </SafeAreaView>
  );
};
