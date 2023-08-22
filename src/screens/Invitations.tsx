import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useTheme } from '../contexts/theme';
import BackgroundContents from '../components/BackgroundContents';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { ManageEventsParamList } from '../contexts/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type invitationsProps = StackNavigationProp<ManageEventsParamList, 'Invitations'>;

export const Invitations = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<ManageEventsParamList, 'Invitations'>>();
  const item = route.params.item;
  const navigation = useNavigation<invitationsProps>()

  const styles = StyleSheet.create({
    img: {
      width: '30%',
      resizeMode: 'contain',
      paddingRight: 50,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  return (
    <BackgroundContents>
      <View style={styles.row}>
        <View style={defaultStyles.leftSectRowContainer}>
          <Image source={require('../assets/back@20x20.png')} />
        </View>
        <View style={{alignContent: 'space-between', height: 30 }} >
          <Text>{t('HomeScreen.title')}</Text>
        </View>
      </View>
      <Header>{t('Invitations.title')}</Header>
    </BackgroundContents>
  )
}
