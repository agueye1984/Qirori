import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {ManageEventsParamList, TypePrix} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type Props = {
  typePrix: TypePrix;
  color: string;
};

type AddTypePrixProps = StackNavigationProp<
  ManageEventsParamList,
  'AddTypePrix'
>;

const TypePrixLists = ({typePrix, color}: Props) => {
  const {t} = useTranslation();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<AddTypePrixProps>();
  const [rightActions, setRightActions] = useState<boolean>(false);

  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color: color,
    },
    name: {
      fontSize: 16,
      color: color,
    },
    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 50,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 50,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.primary,
    },
    copyContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 5,
      backgroundColor: ColorPallet.link,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderCard: {
      backgroundColor: '#f8f9fa',
      marginVertical: 10,
      padding: 15,
      borderRadius: 8,
    },
    orderId: {fontWeight: 'bold', fontSize: 16},
    customer: {marginVertical: 5},
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
      flexDirection: 'row', // Aligner les icônes en ligne
      alignItems: 'center', // Centrer verticalement les icônes
    },
    buttonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      flexDirection: 'row', // Aligner les boutons horizontalement
      justifyContent: 'space-between', // Espacer les boutons uniformément
    },
  });

  const handleEdit = () => {
    navigation.navigate('AddTypePrix', {item: typePrix, isEditing: true});
  };

  const handleDesactive = () => {
    firestore()
    .collection('type_prix')
    .doc(typePrix.id)
      .update({
        actif: false,
      })
      .then(() => {
        console.log('Type Prix updated!');
      });
  };

  const handleActive = () => {
    firestore()
      .collection('type_prix')
      .doc(typePrix.id)
      .update({
        actif: true,
      })
      .then(() => {
        console.log('Type Prix updated!');
      });
  };

  return (
    <View style={styles.orderCard}>
       <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddProdServ.type')} : </Text>
        {typePrix.type ==='1' ? t('Type.Product') : t('Type.Service')}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddTypePrix.NameFr')} : </Text>
        {typePrix.nameFr}
      </Text>
      <Text style={styles.customer}>
        <Text style={styles.orderId}>{t('AddTypePrix.NameEn')} : </Text>
        {typePrix.nameEn}
      </Text>
      <View style={styles.imageWrapper}>
        {typePrix.actif ? (
         <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => handleEdit()}
              style={({pressed}) => [
                styles.editContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="edit" size={30} color={ColorPallet.white} />
            </Pressable>
            <Pressable
              onPress={() => handleDesactive()}
              style={({pressed}) => [
                styles.copyContainer,
                pressed && {opacity: 0.8},
              ]}>
              <Icon name="lock" size={30} color={ColorPallet.white} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => handleActive()}
            style={({pressed}) => [
              styles.editContainer,
              pressed && {opacity: 0.8},
            ]}>
            <Icon name="unlock" size={30} color={ColorPallet.white} />
          </Pressable>
          </View>
        )}
      </View>
    </View>
    
  );
};

export default TypePrixLists;
