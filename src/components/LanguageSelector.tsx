import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {LargeButton} from './LargeButton';
import {theme} from '../core/theme';

interface LanguageList {
  code: string;
  label: string;
}

const LanguageSelector = () => {
  const {i18n, t} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const defaultStyles = defaultComponentsThemes();
  const languageList: LanguageList[] = [
    {
      code: 'en',
      label: t('LanguageList.English'),
    },
    {
      code: 'fr',
      label: t('LanguageList.French'),
    },
  ];
  const [, dispatch] = useStore();
  const navigation = useNavigation();
  const [languageCode, setLanguageCode] = useState(selectedLanguageCode);
  const [updatedSetting, setUpdatedSetting] = useState(false);

  const setLanguage = (code: string) => {
    dispatch({
      type: DispatchAction.UPDATE_LANGUAGE,
      payload: code,
    });
    i18n.changeLanguage(code);
    navigation.goBack();
  };

  const setSelectedLanguage = (code: string) => {
    setUpdatedSetting(true);
    setLanguageCode(code);
  };

  return (
    <ScrollView>
      {languageList.map((language, index: number) => {
        const selectedLanguage = language.code === languageCode;
        return (
          <View key={index}>
            <TouchableOpacity
              style={defaultStyles.itemContainer}
              onPress={() => setSelectedLanguage(language.code)}>
              <View style={defaultStyles.touchableStyle}>
                {selectedLanguage ? (
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
                      {language.label}
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
                      {language.label}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
      {updatedSetting ? (
        <View style={defaultStyles.buttonsContainer}>
          <LargeButton
            title={t('Global.Save')}
            action={() => setLanguage(languageCode)}
            isPrimary={true}
          />
          <View style={{height: 10}} />
          <LargeButton
            title={t('Global.Cancel')}
            action={() => navigation.goBack()}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

export default LanguageSelector;
