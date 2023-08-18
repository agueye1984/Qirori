import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackgroundContents from '../components/BackgroundContents';
import { useTranslation } from 'react-i18next';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Header from '../components/Header';
import React from 'react';
import { useStore } from '../contexts/store';
import { AccueilList } from '../components/AccueilList';
import { Accueil } from '../contexts/types';
import { useNavigation } from '@react-navigation/native';
import { AccueilItem } from '../components/AccueilItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/theme';



const HomeScreen = () => {
  const { t } = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const [state] = useStore();
  const accueil = AccueilList(t)
  const { navigate } = useNavigation()
  const { ColorPallet } = useTheme()

  function handleSelection(item: Accueil) {
    navigate(item.route as never)
  }

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
      <ScrollView style={{ padding: 10 }}>
        <View style={styles.row}>
          <View style={defaultStyles.leftSectRowContainer}>
            <Image source={require('../assets/logo.png')} style={{ width: 60, height: 60 }} />
          </View>
          <View style={defaultStyles.rightSectRowContainer}>
            <View style={{ paddingRight: 5, paddingBottom: 7 }}>
              <TouchableOpacity onPress={() => navigate('AddEvent' as never)}>
                <Icon
                  name={'calendar-plus-o'}
                  color={ColorPallet.primary}
                  size={30}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Header>{t('HomeScreen.title')}</Header>
        <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }}>
          <View style={{ padding: 10 }}>
            {accueil.map((item: Accueil) => {
              return <AccueilItem key={item.id} item={item} action={() => handleSelection(item)} />
            })}
          </View>
        </View>
      </ScrollView>
    </BackgroundContents>
  )
};

export default HomeScreen;
