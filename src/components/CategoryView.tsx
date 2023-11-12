import React, { useState } from 'react';
import { Text, Image, View, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../contexts/theme';
import { Category, Panier, Product } from '../contexts/types';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageKeys } from '../constants';
import { useStore } from '../contexts/store';
import { DispatchAction } from '../contexts/reducers/store';
import { NumericFormat } from 'react-number-format';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { theme } from '../core/theme';


type Props = {
  name: string
  onPress: () => void
}

export const CategoryView = ({ name, onPress }: Props) => {
  const { ColorPallet } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: 1,
      marginVertical: 20,
    },
    thumb: {
      height: 300,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: 300,
    },
    infoContainer: {
      padding: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    itemContainerForm: {
      height: 70,
      width:150,
      marginHorizontal: 5,
      borderWidth: 0.5,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center'
    },
    column: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View>
      <View style={[styles.itemContainerForm, { flexDirection: 'row', marginVertical:15, marginHorizontal:15}]}>
      <TouchableOpacity onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}