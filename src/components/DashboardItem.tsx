import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Accueil} from '../contexts/types';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';

type Props = {
  item: Accueil;
  action: () => void;
};

export const DashboardItem = ({item, action}: Props) => {
  const defaultStyles = DefaultComponentsThemes();
  const icon = item.images.split(':');
  const { width } = Dimensions.get('window'); 

  const styles = StyleSheet.create({
    itemContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
    },
    touchableStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    imageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    icon: {
      width: 35,
      height: 35,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    text: {
      fontWeight: 'bold',
      fontSize: width > 400 ? 18 : 16, // Adjust font size based on screen width.
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.touchableStyle} onPress={action}>
        <View style={styles.imageContainer}>
          {/* Dynamically Render Icon */}
          {icon[0] === 'Icon' && <Icon name={icon[1]} color={theme.colors.primary} size={30} />}
          {icon[0] === 'Icon1' && <Icon1 name={icon[1]} color={theme.colors.primary} size={30} />}
          {icon[0] === 'Icon2' && <Icon2 name={icon[1]} color={theme.colors.primary} size={30} />}
          {icon[0] === 'Icon3' && <Icon3 name={icon[1]} color={theme.colors.primary} size={30} />}
          {icon[0] === 'Icon4' && <Icon4 name={icon[1]} color={theme.colors.primary} size={30} />}
        </View>
        {/* Title */}
        <View style={styles.textContainer}>
          <Text style={[defaultStyles.text, styles.text]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

};
