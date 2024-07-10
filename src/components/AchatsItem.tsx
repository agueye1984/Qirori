import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Accueil} from '../contexts/types';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../core/theme';

type Props = {
  item: Accueil;
  action: () => void;
};

export const AchatsItem = ({item, action}: Props) => {
  const defaultStyles = DefaultComponentsThemes();
  const icon = item.images.split(':');

  const styles = StyleSheet.create({
    itemContainer: {
      height: 75,
      marginHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.2,
      borderBottomStyle: 'solid',
    },
    touchableStyle: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
    },
    image: {
      width: 35,
      height: 35,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  let content = (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={[styles.touchableStyle]} onPress={action}>
        <View style={styles.row}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {icon[0] == 'Icon' && (
              <Icon name={icon[1]} color={theme.colors.primary} size={35} />
            )}
            {icon[0] == 'Icon1' && (
              <Icon1 name={icon[1]} color={theme.colors.primary} size={35} />
            )}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                defaultStyles.text,
                {
                  paddingLeft: 10,
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: theme.colors.primary,
                },
              ]}>
              {item.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return content;
};
