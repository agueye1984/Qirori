import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  textRoute: string;
  goBack: () => void;
};

export const BacktoShop = ({textRoute, goBack}: Props) => {
  const navigation = useNavigation();
  const defaultStyles = DefaultComponentsThemes();

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
  });

  let content = (
    <ScrollView style={{padding: 10}}>
      <TouchableOpacity
        style={[styles.touchableStyle]}
        onPress={goBack}>
        <View style={styles.row}>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Icon
              name="arrow-back-ios"
              color={theme.colors.primary}
              size={20}
            />
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text
              style={[
                defaultStyles.text,
                {fontWeight: 'bold', fontSize: 15, color: theme.colors.primary},
              ]}>
              {textRoute}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  return content;
};
