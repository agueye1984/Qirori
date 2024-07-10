import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/theme';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {
  Contribution,
  Event,
  Invitation,
  ManageEventsParamList,
  TypeEvent,
} from '../contexts/types';
import {DateEvent} from '../components/DateEvent';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import MapView, {Marker} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {theme} from '../core/theme';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import Config from 'react-native-config';
import firestore from '@react-native-firebase/firestore';
import { getFilteredRecords, getRecordById } from '../services/FirestoreServices';

type invitationsContactsProps = StackNavigationProp<
  ManageEventsParamList,
  'InvitationsContacts'
>;

export const EventDetails = () => {
  const {i18n, t} = useTranslation();
  const route = useRoute<RouteProp<ManageEventsParamList, 'EventDetails'>>();
  const item = route.params.item;
  const defaultStyles = DefaultComponentsThemes();
  const {ColorPallet} = useTheme();
  const navigation = useNavigation<invitationsContactsProps>();
  const [invitation, setInvitation] = useState<Invitation[]>([]);
  const [contribution, setContribution] = useState<Contribution[]>([]);
  const [eventName, setEventName] = useState<string>('')
  const [nombre, setNombre] = useState(0)
  const [nbYes, setNbYes] = useState(0)
  const [nbNo, setNbNo] = useState(0)
  const [mntContribution, setMntContribution] =useState(0)
  const [nbClose, setNbClose] = useState(0)
  const [nbMaybe, setNbMaybe] = useState(0)

  const anneeDebut = parseInt(item.dateDebut.substring(0, 4));
  const moisDebut = parseInt(item.dateDebut.substring(4, 6)) - 1;
  const jourDebut = parseInt(item.dateDebut.substring(6, 8));
  const heureDebut = parseInt(item.heureDebut.substring(0, 2));
  const minutesDebut = parseInt(item.heureDebut.substring(2, 4));
  const dateDebut = new Date(
    anneeDebut,
    moisDebut,
    jourDebut,
    heureDebut,
    minutesDebut,
    0,
  );
  const [closeContribution, setCloseContribution] = useState(false);
  const [localisation, setLocalisation] = useState({latitude: 0, longitude: 0});
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const selectedLanguageCode = i18n.language;
  let languageDate = '';
  if (selectedLanguageCode === 'fr') {
    languageDate = 'fr-fr';
  }
  if (selectedLanguageCode === 'en') {
    languageDate = 'en-GB';
  }

  const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });
  const jourFormat = dateDebut
    .toLocaleTimeString(languageDate, {
      weekday: 'long',
    })
    .split(' ');
  const anneeFin = parseInt(item.dateFin.substring(0, 4));
  const moisFin = parseInt(item.dateFin.substring(4, 6)) - 1;
  const jourFin = parseInt(item.dateFin.substring(6, 8));
  const heureFin = parseInt(item.heureFin.substring(0, 2));
  const minutesFin = parseInt(item.heureFin.substring(2, 4));
  const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
  const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  useEffect(() => {
    // Exemple d'utilisation de la fonction getFilteredRecords
    const fetchData = async () => {
      try {
        const data = await getFilteredRecords('invitations', 'eventId', item.id)
        const newInvitation = data.map((record) => record.data as Invitation)
        console.log(newInvitation.length)
        setInvitation(newInvitation)
        setNombre(newInvitation.length)
        const compteur = newInvitation.reduce(
          (acc, obj) => {
            if (obj.reponse === t('Global.Yes')) {
              acc.oui += 1;
            }
            if (obj.reponse === t('Global.No')) {
              acc.non += 1;
            }
            if (obj.closeDonation) {
              acc.close += 1;
            }
            return acc;
          },
          { oui: 0, non: 0, close:0 }
        );
        setNbClose(compteur.close)
        setNbNo(compteur.non)
        setNbYes(compteur.oui)
        const data1 = await getFilteredRecords('contributions', 'eventId', item.id)
        let mntDonation = 0
        data1.map((record) =>{
            const donation= record.data as Contribution
            mntDonation += Number(donation.montant)
        })
       setMntContribution(mntDonation)
        const typeEvent = (await getRecordById('type_events', item.name)) as TypeEvent
        let evenName = typeEvent.nameFr
        if (selectedLanguageCode === 'en') {
          evenName = typeEvent.nameEn
        }
        setEventName(evenName)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [item])

  /* useEffect(() => {
    firestore()
      .collection('invitations')
      // Filter results
      .where('eventId', '==', item.id)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setInvitation([]);
        } else {
          const invitations: Invitation[] = [];
          querySnapshot.forEach(documentSnapshot => {
            invitations.push(documentSnapshot.data() as Invitation);
          });
          setInvitation(invitations);
        }
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('contributions')
      // Filter results
      .where('eventId', '==', item.id)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          setContribution([]);
        } else {
          const contributions: Contribution[] = [];
          querySnapshot.forEach(documentSnapshot => {
            contributions.push(documentSnapshot.data() as Contribution);
          });
          setContribution(contributions);
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
  }, []); */

  /* const typeEvent = typeEvents.find(e => e.id === item.name);
  let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr;
  if (selectedLanguageCode === 'en') {
    nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn;
  }
 */
 /*  let invitations = invitation;
  let contributions = contribution; */
  //let nombre = invitations.length;
  /* let nbYes = 0;
  let nbNo = 0;
  let mntContribution = 0;
  let nbClose = 0; */
  /* invitations.map(invitation => {
    if (invitation.reponse === t('Global.Yes')) {
      nbYes += 1;
    }
    if (invitation.reponse === t('Global.No')) {
      nbNo += 1;
    }
    if (invitation.closeDonation) {
      nbClose += 1;
    }
  });
  let nbMaybe = nombre - nbNo - nbYes; */
  useEffect(() => {
    /* if (nombre > 0) {
      setCloseContribution(nombre === nbClose);
    } */
    const apiUrl = `${Config.GOOGLE_PACES_API_BASE_URL}/details/json?key=${Config.GOOGLE_API_KEY}&place_id=${item.localisation.placeId}&components=country:ca`;
    axios
      .request({method: 'post', url: apiUrl})
      .then(result => {
        if (result) {
          const {width, height} = Dimensions.get('window');
          const ASPECT_RATIO = width / height;
          const lat = parseFloat(result.data.result.geometry.location.lat);
          const lng = parseFloat(result.data.result.geometry.location.lng);
          const northeastLat = parseFloat(
            result.data.result.geometry.viewport.northeast.lat,
          );
          const southwestLat = parseFloat(
            result.data.result.geometry.viewport.southwest.lat,
          );
          const latDelta = northeastLat - southwestLat;
          const lngDelta = latDelta * ASPECT_RATIO;
          setLocalisation({latitude: lat, longitude: lng});
          setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          });
        }
      })
      .catch(error => console.log(error));
  }, [nombre, closeContribution]);

  /* contributions.map(contribution => {
    mntContribution += Number(contribution.montant === undefined ? 0 : contribution.montant)
      ;
  }); */
console.log(closeContribution)
  const addToCalendar = (title: string, startDate: string, endDate: string) => {
    const eventConfig = {
      title,
      startDate: startDate.replace('Z', 'ZZ'),
      endDate: endDate.replace('Z', 'ZZ'),
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.warn('adama');
        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.warn('adama1');
        console.warn(error);
      });
  };

   const closeDonation = () => {
    invitation.map(invitation => {
    firestore()
          .collection('invitations')
          .doc(invitation.id)
          .update({
            closeDonation: true,
          })
          .then(() => {
            console.log('Invitations updated!');
          });
        });
        navigation.navigate('Events' as never);
    /* invitations.map(invitation => {
      let invite: Invitation = {
        ...invitation,
        closeDonation: true,
      };
      dispatch({
        type: DispatchAction.UPDATE_INVITE,
        payload: invite,
      });
    }); */
  }; 

  const handleInvitationsContacts = (item: Event) => {
    navigation.navigate('InvitationsContacts', {item: item});
  };
  const handleEditEvent = (item: Event) => {
    navigation.navigate('EditEvent', {item: item});
  };

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
    mapview: {
      height: 300,
      marginHorizontal: 5,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  const mapStyle = [
    {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
    {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
    {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{color: '#263c3f'}],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{color: '#6b9a76'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}],
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{eventName}</Header>

      <ScrollView scrollEnabled>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <DateEvent dateDebut={item.dateDebut} flexSize={0.87} />
            </View>
            <View style={{flex: 4, flexDirection: 'row'}}>
              <View style={[styles.itemContainer]}>
                <View
                  style={{
                    flexDirection: 'column',
                    flex: 4,
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}>
                  <View style={{width: 250}}>
                    <Text
                      style={[
                        defaultStyles.text,
                        {fontWeight: 'bold', fontSize: 16},
                      ]}>
                      {jourFormat['0']} {t('Global.from')} {heureFormatDebut}{' '}
                      {t('Global.to')} {heureFormatFin}
                    </Text>
                  </View>
                  <View style={{width: 250}}>
                    <TouchableOpacity
                      onPress={() =>
                        addToCalendar(
                          item.name,
                          dateDebut.toISOString(),
                          dateFin.toISOString(),
                        )
                      }>
                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Icon
                          name={'calendar'}
                          size={20}
                          color={theme.colors.primary}
                        />
                        <Text style={{color: theme.colors.primary}}>
                          {' '}
                          {t('Events.addToCalendar')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.itemContainer, {marginTop: 15}]}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 4, marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => handleInvitationsContacts(item)}>
                  <View style={{marginHorizontal: 25}}>
                    <Icon
                      name={'user-plus'}
                      size={25}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Events.Invite')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'column', flex: 5, marginVertical: 5}}>
                <TouchableOpacity onPress={() => handleEditEvent(item)}>
                  <View style={{marginHorizontal: 15, alignItems: 'flex-end'}}>
                    <Icon
                      name={'pencil'}
                      size={25}
                      color={theme.colors.primary}
                    />
                  </View>
                  <View style={{marginHorizontal: 15, alignItems: 'flex-end'}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Global.Modify')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.itemContainer, {marginTop: 15}]}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 4, marginVertical: 5}}>
                <View style={{marginHorizontal: 30}}>
                  <Text style={{color: theme.colors.primary}}> {nombre}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Events.Invited')}
                    </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 4, marginVertical: 5}}>
                <View style={{marginHorizontal: 25}}>
                  <Text style={{color: theme.colors.primary}}> {nbYes}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Global.Yes')}
                    </Text>
             </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 4, marginVertical: 5}}>
                <View style={{marginHorizontal: 20}}>
                  <Text style={{color: theme.colors.primary}}> {nbNo}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Global.No')}
                    </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 5, marginVertical: 5}}>
                <View style={{marginHorizontal: 30}}>
                  <Text style={{color: theme.colors.primary}}> {nbMaybe}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Events.Maybe')}
                    </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.itemContainer, {marginTop: 15}]}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 4, marginVertical: 5}}>
                <View style={{marginHorizontal: 40}}>
                  <Text style={{color: theme.colors.primary}}>
                    {' '}
                    {mntContribution.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                    <Text style={{color: theme.colors.primary}}>
                      {' '}
                      {t('Events.AmountDonation')}
                    </Text>
                </View>
              </View>
              {!closeContribution && (
                <View
                  style={{flexDirection: 'column', flex: 5, marginVertical: 5}}>
                  <View
                    style={{
                      marginHorizontal: 15,
                      alignItems: 'flex-end',
                      marginTop: 15,
                    }}>
                    <TouchableOpacity onPress={closeDonation}>
                      <Text style={{color: theme.colors.primary}}>
                        {' '}
                        {t('Events.CloseDonation')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.mapview, {marginTop: 15}]}>
            <MapView
              customMapStyle={mapStyle}
              style={{
                width: '100%',
                height: '100%',
                ...StyleSheet.absoluteFillObject,
              }}
              showsUserLocation={true}
              region={region}>
              <Marker
                draggable
                coordinate={localisation}
                description={'This is a description of the marker'}
                title={'Test Marker'}
                onDragEnd={e =>
                  console.log(JSON.stringify(e.nativeEvent.coordinate))
                }
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
