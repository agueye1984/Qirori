import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {theme} from '../core/theme';

type Props = {
  children: React.ReactNode;
};

const Header = ({children}: Props) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
  },
});

export default Header;
