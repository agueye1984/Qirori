import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';

interface Props {
  title: string;
  accessibilityLabel?: string;
  testID?: string;
  checked: boolean;
  onPress: () => void;
}

const CheckBoxRow: React.FC<Props> = ({
  title,
  accessibilityLabel,
  testID,
  checked,
  onPress,
}) => {
  const defaultStyle = defaultComponentsThemes();

  const style = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
    },
    text: {
      ...defaultStyle.text,
      flexShrink: 1,
      marginLeft: 10,
    },
  });
  const accessible =
    accessibilityLabel && accessibilityLabel !== '' ? true : false;

  return (
    <View style={style.container}>
      <TouchableOpacity
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        onPress={onPress}>
        {checked ? (
          <Icon name={'check-box'} size={30} color={theme.colors.primary} />
        ) : (
          <Icon
            name={'check-box-outline-blank'}
            size={30}
            color={theme.colors.primary}
          />
        )}
      </TouchableOpacity>
      <Text style={[style.text]}>{title}</Text>
    </View>
  );
};

export default CheckBoxRow;
