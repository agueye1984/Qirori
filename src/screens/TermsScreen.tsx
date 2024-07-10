import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import CheckBoxRow from '../components/CheckBoxRow';
import {LargeButton} from '../components/LargeButton';
import {NotificationBox} from '../components/NotificationBox';
import Header from '../components/Header';
import {AccordionItem} from '../components/react-native-accordion-list-view';
import {DispatchAction} from '../contexts/reducers/store';
import {useStore} from '../contexts/store';
import {useTheme} from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';

const TermsScreen: React.FC = () => {
  const [, dispatch] = useStore();
  const [checked, setChecked] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {ColorPallet} = useTheme();
  const defaultStyle = defaultComponentsThemes();
  const style = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.primaryBackground,
    },
    bodyText: {
      ...defaultStyle.text,
      flexShrink: 1,
    },
    titleText: {
      ...defaultStyle.text,
      textDecorationLine: 'underline',
    },
    title: {
      ...defaultStyle.subtitle,
    },
    controlsContainer: {
      marginTop: 'auto',
      marginBottom: 20,
    },
    paragraph: {
      flexDirection: 'row',
      marginTop: 20,
    },
    enumeration: {
      ...defaultStyle.text,
      marginRight: 25,
    },
    link: {
      ...defaultStyle.text,
      color: ColorPallet.link,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const onSubmitPressed = useCallback(() => {
    setFormSubmitted(true);

    if (!checked) {
      return;
    }

    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
    });

    navigation.navigate('LoginScreen' as never);
  }, [checked, formSubmitted]);

  return (
    <SafeAreaView>
      <ScrollView
        style={{paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}>
        <Header>{t('TermsV2.title')}</Header>
        <Text>{t('TermsV2.Consent.body')}</Text>
        <Text style={[style.title, {marginTop: 20}]}>
          {t('TermsV2.Consent.title')}
        </Text>
        <Text style={[style.bodyText, {marginTop: 20}]}>
          {t('TermsV2.Consent.body')}
        </Text>

        <Text style={[style.title, {marginTop: 20}]}>
          {t('TermsV2.Consent.PersonalUse.title')}
        </Text>
        <Text style={[style.bodyText, {marginTop: 20, marginBottom: 20}]}>
          {t('TermsV2.Consent.PersonalUse.body')}
        </Text>
        <AccordionItem
          customTitle={() => (
            <Text style={[style.title]}>
              {t('TermsV2.Consent.PersonalUse.subsection.title')}
            </Text>
          )}
          customBody={() => (
            <Text style={[style.bodyText, {margin: 20}]}>
              {t('TermsV2.Consent.PersonalUse.subsection.body')}
            </Text>
          )}
        />

        <Text style={[style.title, {marginTop: 20}]}>
          {t('TermsV2.Consent.IdentityTheft.title')}
        </Text>
        <Text style={[style.bodyText, {marginTop: 20, marginBottom: 20}]}>
          {t('TermsV2.Consent.IdentityTheft.body')}
        </Text>
        <AccordionItem
          customTitle={() => (
            <Text style={[style.title]}>
              {t('TermsV2.Consent.IdentityTheft.subsection.title')}
            </Text>
          )}
          customBody={() => (
            <Text style={[style.bodyText, {margin: 20}]}>
              {t('TermsV2.Consent.IdentityTheft.subsection.body')}
            </Text>
          )}
        />

        <Text style={[style.title, {marginTop: 20}]}>
          {t('TermsV2.Consent.Privacy.title')}
        </Text>
        <Text
          style={[
            style.bodyText,
            {marginTop: 20, marginBottom: 20, marginVertical: 20},
          ]}>
          {t('TermsV2.Consent.Privacy.body')}
        </Text>
        <AccordionItem
          containerStyle={{marginBottom: 20}}
          customTitle={() => (
            <Text style={[style.title]}>
              {t('TermsV2.Consent.Privacy.subsection.title')}
            </Text>
          )}
          customBody={() => (
            <Text style={[style.bodyText, {margin: 20}]}>
              {t('TermsV2.Consent.Privacy.subsection.body')}
            </Text>
          )}
        />

        <View style={[style.controlsContainer]}>
          {
            /*!(store.onboarding.didAgreeToTerms && store.authentication.didAuthenticate) && */
            <>
              <CheckBoxRow
                title={t('TermsV2.Credential.Body')}
                accessibilityLabel={t('TermsV2.IAgree') || ''}
                checked={checked}
                onPress={() => setChecked(!checked)}
              />
              {!checked && formSubmitted && (
                <NotificationBox
                  type="warning"
                  body={t('TermsV2.Credential.Error')}
                />
              )}
              <View style={[{paddingTop: 10}]}>
                <LargeButton
                  title={t('Global.Continue')}
                  action={onSubmitPressed}
                  isPrimary
                />
              </View>
            </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
