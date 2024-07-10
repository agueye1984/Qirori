import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {LargeButton} from './LargeButton';
import {theme} from '../core/theme';
import { getSupportedCurrencies } from 'react-native-format-currency';
import {widthPercentageToDP as widthToDp} from 'react-native-responsive-screen';



const DeviseSelector = () => {
  const {i18n, t} = useTranslation();
  
  const defaultStyles = defaultComponentsThemes();
  
  const [state, dispatch] = useStore();
  const navigation = useNavigation();
  const [currencyCode, setCurrencyCode] = useState(state.currency.toString());
  const [updatedSetting, setUpdatedSetting] = useState(false);

 

  const currencies = getSupportedCurrencies().map(({code, name}) => ({
    key: code,
    value: code + ': ' + name,
  }));

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });


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
    <View>
      {currencies.map((devise, index: number) => {
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
      
    <View style={styles.row}>
    {updatedSetting ? (
        <View style={defaultStyles.buttonsContainer}>
          <LargeButton
            title={t('Global.Save')}
            action={() => setCurrency(currencyCode)}
            isPrimary={true}
          />
          <View style={{height: 10}} />
          <LargeButton
            title={t('Global.Cancel')}
            action={() => navigation.goBack()}
          />
        </View>
      ) : null}
    </View>
    </View>
  );
};

export default DeviseSelector;
