import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {i18n} from '../localization';

type Props = {
  dateDebut: string;
  flexSize: number;
};

export const DateEvent = ({dateDebut, flexSize}: Props) => {
  const defaultStyles = DefaultComponentsThemes();
  const annee = parseInt(dateDebut.substring(0, 4));
  const mois = parseInt(dateDebut.substring(4, 6)) - 1;
  const jour = parseInt(dateDebut.substring(6, 8));
  const date = new Date(annee, mois, jour, 0, 0, 0);
  const selectedLanguageCode = i18n.language;

  const moisformat = date.toLocaleDateString(selectedLanguageCode, {
    month: 'short',
  });

  const styles = StyleSheet.create({
    touchableStyle: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    date: {
      height: 70,
      width: 60,
      flex: flexSize,
      backgroundColor: '#F4F4F4',
      borderWidth: 0.2,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    mois: {
      height: 20,
      width: 60,
      flex: 0.3,
      backgroundColor: '#E37627',
      borderWidth: 0.2,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      alignItems: 'center',
    },
    textMois: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 15,
      alignItems: 'center',
    },
    textJour: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 15,
    },
    textAnnee: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 15,
    },
  });

  let content = (
    <View style={styles.date}>
      <View style={styles.mois}>
        <Text style={[defaultStyles.text, styles.textMois]}>{moisformat}</Text>
      </View>
      <View style={{flex: 0.4, alignItems: 'center'}}>
        <Text style={[defaultStyles.text, styles.textJour]}>{jour}</Text>
        <Text style={[defaultStyles.text, styles.textAnnee]}>{annee}</Text>
      </View>
    </View>
  );

  return content;
};
