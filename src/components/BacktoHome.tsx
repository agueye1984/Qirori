import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  textRoute: string;
};

export const BacktoHome = ({ textRoute }: Props) => {
  const navigation = useNavigation();
  const defaultStyles = DefaultComponentsThemes();

  const styles = StyleSheet.create({
    touchableStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start', // Change to 'flex-start' to align items to the start
      padding: 10, // Add padding instead of margin
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center', // Ensure alignment
    },
  });

  return (
    <TouchableOpacity style={styles.touchableStyle} onPress={() => navigation.goBack()}>
      <View style={styles.row}>
        <Icon name="arrow-back-ios" color={theme.colors.primary} size={20} />
        <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 15, color: theme.colors.primary }]}>
          {textRoute}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
