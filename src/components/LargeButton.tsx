import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {theme} from '../core/theme';

interface Props {
  isPrimary?: boolean;
  color?: string;
  title: string;
  action: () => void;
  disabled?: boolean;
}

export const LargeButton = ({
  title,
  action,
  color,
  isPrimary = false,
  disabled = false,
}: Props) => {
  let backgroundColor = theme.colors.primary;
  let borderColor = theme.colors.primary;
  let textColor = theme.colors.surface;

  if (isPrimary) {
    if (color) {
      backgroundColor = color;
      borderColor = color;
    }
  } else {
    if (color) {
      backgroundColor = theme.colors.surface;
      borderColor = color;
      textColor = color;
    } else {
      backgroundColor = theme.colors.primaryBackground;
      textColor = theme.colors.primary;
    }
  }

  const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: backgroundColor,
      borderRadius: 5,
      marginHorizontal: 10,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      borderWidth: 2,
      borderColor: borderColor,
      borderStyle: 'solid',
    },
    textStyles: {
      fontWeight: 'bold',
      color: textColor,
      fontSize: 16,
    },
  });
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={action}
      disabled={disabled}>
      <Text style={styles.textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};
