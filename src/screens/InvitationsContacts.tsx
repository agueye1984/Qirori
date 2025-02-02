import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../contexts/theme';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {StackNavigationProp} from '@react-navigation/stack';
import {ManageEventsParamList, TypeEvent, User} from '../contexts/types';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {BacktoHome} from '../components/BacktoHome';
import Icon from 'react-native-vector-icons/FontAwesome';
import {v4 as uuidv4} from 'uuid';
import {theme} from '../core/theme';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {phoneValidator} from '../core/utils';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import PhoneInput from 'react-native-phone-number-input';

type eventDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'EventDetails'
>;

export const InvitationsContacts = () => {
  const {ColorPallet} = useTheme();
  const {i18n, t} = useTranslation();
  const route =
    useRoute<RouteProp<ManageEventsParamList, 'InvitationsContacts'>>();
  const item = route.params.item;
  const navigation = useNavigation<eventDetailsProp>();
  const [toggle, setToggle] = useState(false);
  const [numTelephone, setNumTelephone] = useState<string>('');
  const [phoneError, setPhoneError] = useState('');
  const [userId, setUserId] = useState('');
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const defaultStyles = DefaultComponentsThemes();
  const selectedLanguageCode = i18n.language;
  const phoneInput = useRef<PhoneInput>(null);
  let langue = 'fra';
  if (selectedLanguageCode == 'en') {
    langue = 'eng';
  }
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    const usersRef = firestore().collection('users');
    auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then(document => {
            const userData = document.data() as User;
            setUserId(userData.id);
          })
          .catch(error => {
            console.log('error1 ' + error);
          });
      }
    });
  }, []);

  useEffect(() => {
    firestore()
      .collection('type_events')
      .get()
      .then(querySnapshot => {
        const events: TypeEvent[] = [];
        querySnapshot.forEach(documentSnapshot => {
          events.push(documentSnapshot.data() as TypeEvent);
        });
        setTypeEvents(events);
      });
  }, []);

  const typeEvent = typeEvents.find(e => e.id === item.name);
  let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr;
  if (selectedLanguageCode === 'en') {
    nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn;
  }

  const getToggleOnOff = (toggle: boolean) => {
    setToggle(toggle);
  };

  const handleNumTelephone = (value: string) => {
    setNumTelephone(value);
  };

  const goToContactList = () => {
    navigation.navigate('ContactsList', {item: item});
  };

  const handleSaveInvitations = async () => {
    const phoneError = phoneValidator(numTelephone, t);
    if (phoneError) {
      setPhoneError(phoneError);
    } else {
      firestore()
        .collection('invitations')
        // Filter results
        .where('numeroTelephone', '==', numTelephone)
        .where('eventId', '==', item.id)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            const uid = uuidv4();
            const ageEnfants: any[] = [];
            firestore()
              .collection('invitations')
              .doc(uid)
              .set({
                id: uid,
                eventId: item.id,
                numeroTelephone: numTelephone,
                userId: userId,
                reponse: '',
                nbrAdultes: 0,
                nbrEnfants: 0,
                closeDonation: false,
                AgeEnfants: ageEnfants,
              })
              .then(() => {
                console.log('Invitation added!');
              });
          }
        });

      navigation.navigate('EventDetails', {item: item});
    }
  };

  const responsiveStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: width * 0.05,
    },
    header: {
      fontSize: height * 0.03,
      fontWeight: 'bold',
    },
    section: {
      marginVertical: 15, // Ajoute une marge verticale entre les sections
      paddingHorizontal: 10, // Garde un padding horizontal si nécessaire
    },
    detailsTitle: {
      fontSize: height * 0.02,
      fontWeight: '600',
      marginBottom: height * 0.01,
      color: ColorPallet.lightGray,
    },
    itemContainer: {
      width: '100%',
      maxWidth: width * 0.9, // S'assure que la largeur ne dépasse pas 90% de l'écran
      alignSelf: 'center', // Centre la vue dans l'écran
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      overflow: 'hidden', // Évite tout débordement de contenu enfant
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: width * 0.05, // Ajout d'un padding horizontal
      marginVertical: height * 0.01,
    },
    itemSeparator: {
      height: 1,
      backgroundColor: ColorPallet.lightGray,
      marginVertical: height * 0.01,
    },
    phoneInput: {
      width: width * 0.9,
      marginVertical: height * 0.01,
    },
    error: {
      color: 'red',
      marginTop: height * 0.01,
    },
  });

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 10,
    },
    detailsTitle: {
      color: ColorPallet.lightGray,
      fontSize: 16,
    },
    itemContainer: {
      height: 110,
      marginHorizontal: 5,
      borderWidth: 0.3,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    row: {
      flexDirection: 'row',
    },
    itemSeparator: {
      height: 75,
      marginHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 0.4,
    },
    containerStyleName: {
      borderColor: ColorPallet.lightGray,
      borderWidth: 1,
      backgroundColor: 'white',
      width: 250,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={responsiveStyles.container}>
      <BacktoHome textRoute={nameEvent} />
      <Header>{t('InvitationsContacts.title')}</Header>

      <View>
        {/* Section Partage */}
        <View style={responsiveStyles.section}>
          <Text style={responsiveStyles.detailsTitle}>
            {t('InvitationsContacts.Share')}
          </Text>
          <View style={responsiveStyles.itemContainer}>
            <View style={responsiveStyles.row}>
              <Text>{t('InvitationsContacts.Everyone')}</Text>
              <TouchableOpacity onPress={() => getToggleOnOff(!toggle)}>
                <Icon
                  name={toggle ? 'toggle-on' : 'toggle-off'}
                  color={toggle ? theme.colors.primary : ColorPallet.lightGray}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={responsiveStyles.itemSeparator} />
            <View style={responsiveStyles.row}>
              <Text>{t('InvitationsContacts.Limit')}</Text>
              <Text>{t('InvitationsContacts.Nos')}</Text>
            </View>
          </View>
        </View>

        {/* Section Inviter */}
        <View style={responsiveStyles.section}>
          <Text style={responsiveStyles.detailsTitle}>
            {t('InvitationsContacts.Invite')}
          </Text>
          <View style={responsiveStyles.itemContainer}>
            <View style={responsiveStyles.row}>
              <TouchableOpacity onPress={goToContactList}>
                <Text>{t('InvitationsContacts.FromContacts')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToContactList}>
                <Icon
                  name="angle-right"
                  color={ColorPallet.darkGray}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={responsiveStyles.itemSeparator} />
            <View>
              <PhoneInput
                ref={phoneInput}
                defaultValue={numTelephone}
                defaultCode="CA"
                layout="first"
                onChangeText={handleNumTelephone}
                onChangeFormattedText={handleNumTelephone}
                withDarkTheme
                placeholder={t('InvitationsContacts.PhoneNumber')}
                containerStyle={responsiveStyles.phoneInput}
              />
              <Button mode="contained" onPress={handleSaveInvitations}>
                {t('InvitationsContacts.Invitee')}
              </Button>
              {phoneError ? (
                <Text style={responsiveStyles.error}>{phoneError}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
