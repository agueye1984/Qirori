import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = {
  goBack: () => void;
};

const BackButton = ({goBack}: Props) => (
  <TouchableOpacity onPress={goBack} style={styles.container}>
    <Icon name="arrow-back" size={24} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 10,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default BackButton;
