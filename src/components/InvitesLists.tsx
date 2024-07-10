import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import storage from '@react-native-firebase/storage';
import {Event, ManageEventsParamList, Product, TypeEvent} from '../contexts/types';
import {useTranslation} from 'react-i18next';
import {Swipeable} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
interface InvitesData {
  id: string;
  nbr: number;
}

type Props = {
  invite: InvitesData;
  color: string;
};


const InvitesLists = ({invite, color}: Props) => {
  const {i18n, t} = useTranslation();
  const {ColorPallet} = useTheme();
  const [event, setEvent] = useState('');
  const selectedLanguageCode = i18n.language;
  

  useEffect(() => {
    firestore()
      .collection('events')
      .doc(invite.id)
      .get()
      .then((doc) => {
        const evt = doc.data() as Event;
        if(doc.exists){
          firestore()
          .collection('type_events')
      .doc(evt.name)
      .get()
      .then((doc1) => {
        const typeEvt = doc1.data() as TypeEvent;
        if (selectedLanguageCode === 'fr') {
          setEvent(typeEvt.nameFr);
        }
        if (selectedLanguageCode === 'en') {
          setEvent(typeEvt.nameEn);
        }
      })
        }
      })
  }, [invite])


  const styles = StyleSheet.create({
    contactCon: {
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
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color: color,
    },
    name: {
      fontSize: 16,
      color: ColorPallet.primary,
      fontWeight: 'bold',
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
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
  });



  return (
      <View style={styles.contactCon}>
      <View style={styles.contactDat}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.name}>{event} : </Text>
          <Text style={styles.txt}>{invite.nbr}</Text>
        </View>
        </View>
      </View>
  );
};

export default InvitesLists;
