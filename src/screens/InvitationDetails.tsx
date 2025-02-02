import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {
  AgeEnfant,
  Event,
  Invitation,
  ManageEventsParamList,
  TypeEvent,
} from '../contexts/types';
import {DateEvent} from '../components/DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import {theme} from '../core/theme';
import Button from '../components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import firestore from '@react-native-firebase/firestore';
import {getRecordById} from '../services/FirestoreServices';
import {parseDateTime} from '../services/EventsServices';
import {useTheme} from '../contexts/theme';
import Stepper from '../components/Stepper';
import CustomSwitch from '../components/CustomSwitch';
import {TextInput as PaperTextInput} from 'react-native-paper';

export const InvitationDetails = () => {
  let filteredNumbers: number[] = [];
  const {i18n, t} = useTranslation();
  const route =
    useRoute<RouteProp<ManageEventsParamList, 'InvitationDetails'>>();
  const item = route.params.item;
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [presence, setPresence] = useState('');
  const [nbAdult, setNbAdult] = useState<number>(0);
  const [nbKid, setNbKid] = useState<number>(0);
  const [displayBtn, setDisplayBtn] = useState(true);
  const [displayNo, setDisplayNo] = useState(false);
  const [initAge, setInitAge] = useState(
    Array(filteredNumbers.length).fill(''),
  );
  const [ageKid, setAgeKid] = useState(Array(filteredNumbers.length).fill(''));
  const [eventName, setEventName] = useState<string>('');
  const [heureFormatDebut, setHeureFormatDebut] = useState<string>('');
  const [heureFormatFin, setHeureFormatFin] = useState<string>('');
  const [jourFormat, setJourFormat] = useState<string[]>([]);
  const [dateDebut, setDateDebut] = useState<string>('');
  const {ColorPallet} = useTheme();
  const {width} = Dimensions.get('window');
  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = (await getRecordById('events', item.eventId)) as Event;
        const dateDeb = parseDateTime(event.dateDebut, event.heureDebut);
        setDateDebut(event.dateDebut);
        setHeureFormatDebut(
          dateDeb.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          }),
        );
        setJourFormat(
          dateDeb
            .toLocaleTimeString(languageDate, {
              weekday: 'long',
            })
            .split(' '),
        );
        const dateFin = parseDateTime(event.dateFin, event.heureFin);
        setHeureFormatFin(
          dateFin.toLocaleTimeString(languageDate, {
            hour: 'numeric',
            minute: 'numeric',
            hourCycle: 'h24',
          }),
        );
        const typeEvent = (await getRecordById(
          'type_events',
          event.name,
        )) as TypeEvent;
        let evenName = typeEvent.nameFr;
        if (selectedLanguageCode === 'en') {
          evenName = typeEvent.nameEn;
        }
        setEventName(evenName);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [item.eventId, languageDate]);

  const reponseInvitations = (invite: Invitation) => {
    console.log(presence);

    if (presence == t('Global.Yes')) {
      let ageEnfant = {};
      let newAgeEnfant: AgeEnfant[] = [];

      let newAge = [...(invite.AgeEnfants as AgeEnfant[])];

      for (let i = 0; i < nbKid; i++) {
        ageEnfant = {
          age: ageKid[i],
        };
        newAgeEnfant.push(ageEnfant as AgeEnfant);
        newAge.push(ageEnfant as AgeEnfant);
      }
      firestore()
        .collection('invitations')
        .doc(item.id)
        .update({
          nbrAdultes: nbAdult,
          nbrEnfants: nbKid,
          reponse: presence,
          AgeEnfants: newAge,
        })
        .then(() => {
          console.log('Invitations updated!');
        });
    } else {
      firestore()
        .collection('invitations')
        .doc(item.id)
        .update({
          reponse: presence,
        })
        .then(() => {
          console.log('Invitations updated!');
        });
    }
    navigation.navigate('Invitations' as never);
  };

  const getPresenceOuiNon = (value: boolean) => {
    if (value == false) {
      setPresence(t('Global.No'));
      setDisplayNo(false);
      setDisplayBtn(true);
    }
    if (value == true) {
      setPresence(t('Global.Yes'));
      setDisplayNo(true);
      setDisplayBtn(false);
      if (nbAdult > 0) {
        setDisplayBtn(true);
      }
    }
  };

  const incrementAdult = () => {
    /*  setNbAdult(nbAdult + 1);
    if (nbAdult > 0) {
      setDisplayBtn(true);
    } */
    setNbAdult(prevNbAdult => {
      const newNbAdult = prevNbAdult + 1;
      if (newNbAdult > 0) {
        setDisplayBtn(true);
      }
      return newNbAdult;
    });
  };

  const decrementAdult = () => {
    //setNbAdult(nbAdult > 0 ? nbAdult - 1 : 0); // Évite les nombres négatifs
    setNbAdult(prevNbAdult => {
      const newNbAdult = nbAdult > 0 ? nbAdult - 1 : 0;
      if (newNbAdult === 0) {
        setDisplayBtn(false);
      }
      return newNbAdult;
    });
  };

  const handleNbAdult = (text: string) => {
    const parsed = parseInt(text, 10);
    setDisplayBtn(true);
    if (parsed <= 0) {
      setDisplayBtn(false);
    }
    setNbAdult(isNaN(parsed) ? 0 : parsed);
  };

  const incrementKid = () => setNbKid(nbKid + 1);
  const decrementKid = () => setNbKid(nbKid > 0 ? nbKid - 1 : 0); // Évite les nombres négatifs
  const handleNbKid = (text: string) => {
    const parsed = parseInt(text, 10);
    setNbKid(isNaN(parsed) ? 0 : parsed);
  };

  const handleAgeKid = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    const newInitAge = [...initAge];
    newInitAge[index] = numericValue;
    setInitAge(newInitAge);

    const newAgeKid = [...ageKid];
    newAgeKid[index] = numericValue;
    setAgeKid(newAgeKid);
  };

  for (let i = 0; i < nbKid; i++) {
    filteredNumbers.push(i);
  }

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 20,
      paddingVertical: 20,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    detailsTitle: {
      ...defaultStyles.text,
      ...defaultStyles.requestDetailsTitle,
    },
    itemContainer: {
      height: 70,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    itemContainerContribution: {
      height: 120,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    mapview: {
      height: 300,
      marginHorizontal: 5,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    eventContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateContainer: {
      flex: 1,
    },
    detailsContainer: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: 15,
    },
    textContainer: {
      flex: 1,
    },
    eventTitle: {
      fontSize: width > 400 ? 18 : 16, // Dynamically adjust font size based on screen width
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
    },
    eventTime: {
      fontSize: 14,
      color: '#666',
    },
    eventItemContainer: {
      marginVertical: 10,
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      // Ajoutez ces styles pour l'espacement
      marginHorizontal: 10, // Assure un espacement des côtés gauche/droit
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    labelContainer: {
      flex: 1,
    },
    container1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginVertical: 8,
    },
    input: {
      width: 70,
      backgroundColor: theme.colors.surface,
      //width: '100%', // Prend toute la largeur du conteneur
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Invitations.title')} />
      <Header>{t('InvitationsDetails.title')}</Header>

      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <View style={styles.eventItemContainer}>
            <View style={styles.eventContent}>
              <View style={styles.dateContainer}>
                <DateEvent dateDebut={dateDebut} flexSize={0.23} />
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.eventTime}>
                    {jourFormat['0']} {t('Global.from')} {heureFormatDebut}{' '}
                    {t('Global.to')} {heureFormatFin}
                  </Text>
                  <TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 10}}>
                      <Icon
                        name={'calendar'}
                        size={20}
                        color={theme.colors.primary}
                      />
                      <Text
                        style={{
                          color: theme.colors.primary,
                          marginHorizontal: 10,
                        }}>
                        {eventName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={defaultStyles.section}>
          <View style={[defaultStyles.itemContainerFormInvite]}>
            <CustomSwitch
              label={t('InvitationsDetails.Presence')}
              onValueChange={value => getPresenceOuiNon(value)}
            />
            {displayNo && (
              <View
                style={[
                  defaultStyles.itemContainerFormInvite,
                  {marginHorizontal: 20},
                ]}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.label}>
                    {t('InvitationsDetails.nbrPersons')}
                  </Text>
                </View>
              </View>
            )}

            {displayNo && (
              <View style={styles.container1}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    {t('InvitationsDetails.Adults')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Stepper
                    value={nbAdult}
                    onIncrement={incrementAdult}
                    onDecrement={decrementAdult}
                    onChange={handleNbAdult}
                  />
                </View>
              </View>
            )}
            {displayNo && (
              <View style={styles.container1}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>
                    {t('InvitationsDetails.KidsOver17')}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Stepper
                    value={nbKid}
                    onIncrement={incrementKid}
                    onDecrement={decrementKid}
                    onChange={handleNbKid}
                  />
                </View>
              </View>
            )}
            {displayNo &&
              filteredNumbers.map((index: number) => {
                return (
                  <View style={styles.container1} key={index}>
                    <View style={styles.labelContainer}>
                      <Text style={styles.label}>
                        {t('InvitationsDetails.KidsAge')} {index + 1}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <PaperTextInput
                        key={index}
                        value={initAge[index]}
                        onChangeText={text => handleAgeKid(index, text)}
                        style={styles.input}
                        autoCapitalize="none"
                        returnKeyType="done"
                      />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
      {displayBtn && (
        <View style={defaultStyles.bottomButtonContainer}>
          <View style={defaultStyles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Invitations' as never)}
              style={defaultStyles.button}>
              {t('Global.Cancel')}
            </Button>
            <Button
              mode="contained"
              onPress={() => reponseInvitations(item)}
              style={defaultStyles.button}>
              {t('Global.Confirm')}
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
