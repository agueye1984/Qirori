import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { BacktoHome } from '../components/BacktoHome';
import { useNavigation } from '@react-navigation/native';
import { Accueil } from '../contexts/types';
import { AchatsItem } from '../components/AchatsItem';
import { AchatsList } from '../components/AchatsList';


export const Achats = () => {
  const { t } = useTranslation();
  const achat = AchatsList(t);
  const { navigate } = useNavigation();

  function handleSelection(item: Accueil) {
    navigate(item.route as never);
  }
  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Achats.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
      <View style={{ padding: 10 }}>
            {achat.map((item: Accueil) => {
              return <AchatsItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
    </SafeAreaView>
  );
}
