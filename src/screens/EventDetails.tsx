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
import {getFilteredRecords, getRecordById} from '../services/FirestoreServices';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import {parseDateTime} from '../services/EventsServices';

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
  const [eventName, setEventName] = useState<string>('');
  const [nombre, setNombre] = useState(0);
  const [nbYes, setNbYes] = useState(0);
  const [nbNo, setNbNo] = useState(0);
  const [mntContribution, setMntContribution] = useState(0);
  const [nbMaybe, setNbMaybe] = useState(0);
  const [mntArgent, setMntArgent] = useState(0);
  const [mntNature, setMntNature] = useState(0);

  const dateDebut = parseDateTime(item.dateDebut, item.heureDebut);
  const [closeContribution, setCloseContribution] = useState(false);
  const [localisation, setLocalisation] = useState({latitude: 0, longitude: 0});
  const {width} = Dimensions.get('window');
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

  const dateFin = parseDateTime(item.dateFin, item.heureFin);
  const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',
  });

  useEffect(() => {
    // Exemple d'utilisation de la fonction getFilteredRecords
    const fetchData = async () => {
      try {
        const data = await getFilteredRecords(
          'invitations',
          'eventId',
          item.id,
        );
        const newInvitation = data.map(record => record.data as Invitation);
        setInvitation(newInvitation);
        setNombre(newInvitation.length);
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
          {oui: 0, non: 0, close: 0},
        );
        setNbNo(compteur.non);
        setNbYes(compteur.oui);
        setCloseContribution(newInvitation.length === compteur.close);
        setNbMaybe(newInvitation.length - compteur.non - compteur.oui);
        const data1 = await getFilteredRecords(
          'contributions',
          'eventId',
          item.id,
        );
        const newContribution = data1.map(
          record => record.data as Contribution,
        );
        const donation = newContribution.reduce(
          (acc, obj) => {
            if (obj.nature === t('Global.Argent')) {
              acc.argent += Number(obj.montant);
            }
            if (obj.nature === t('Global.Nature')) {
              acc.nature += Number(obj.montant);
            }
            return acc;
          },
          {argent: 0, nature: 0},
        );
        setMntArgent(donation.argent);
        setMntNature(donation.nature);
        setMntContribution(donation.argent + donation.nature);
        const typeEvent = (await getRecordById(
          'type_events',
          item.name,
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
  }, [item]);

  useEffect(() => {
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
  }, []);

  const addToCalendar = (
    title: string,
    startDate: string,
    endDate: string,
    location: string,
  ) => {
    const eventConfig = {
      title,
      startDate: startDate,
      endDate: endDate,
      location,
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        // console.warn('adama');
        // console.warn(JSON.stringify(eventInfo));
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        // console.warn(error);
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
  };

  const handleInvitationsContacts = (item: Event) => {
    navigation.navigate('InvitationsContacts', {item: item});
  };
  const handleEditEvent = (item: Event) => {
    navigation.navigate('AddEvent', {isEditing: true, item: item});
  };

  const handleProduitsServices = (item: Event) => {
    navigation.navigate('ProdServEvents', {id: item.id});
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
    <SafeAreaView style={styles.container}>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{eventName}</Header>

      <ScrollView scrollEnabled>
        <View style={styles.section}>
          <View style={styles.eventItemContainer}>
            <View style={styles.eventContent}>
              <View style={styles.dateContainer}>
                <DateEvent dateDebut={item.dateDebut} flexSize={0.23} />
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.eventTime}>
                    {jourFormat['0']} {t('Global.from')} {heureFormatDebut}{' '}
                    {t('Global.to')} {heureFormatFin}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      addToCalendar(
                        eventName,
                        dateDebut.toISOString(),
                        dateFin.toISOString(),
                        item.localisation.description,
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
          <View style={styles.eventItemContainer}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <TouchableOpacity
                  onPress={() => handleInvitationsContacts(item)}>
                  <Icon
                    name={'user-plus'}
                    size={25}
                    color={theme.colors.primary}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {t('Events.Invite')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <TouchableOpacity onPress={() => handleProduitsServices(item)}>
                  <Icon3
                    name={'gift'}
                    size={25}
                    color={theme.colors.primary}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {t('AddProdServ.title')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <TouchableOpacity onPress={() => handleEditEvent(item)}>
                  <Icon
                    name={'pencil'}
                    size={25}
                    color={theme.colors.primary}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {t('Global.Modify')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.eventItemContainer}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 30}}>
                  <Text style={{textAlign: 'center'}}>{nombre}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Events.Invited')}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 25}}>
                  <Text style={{textAlign: 'center'}}>{nbYes}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Global.Yes')}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 20}}>
                  <Text style={{textAlign: 'center'}}>{nbNo}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Global.No')}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 30}}>
                  <Text style={{textAlign: 'center'}}>{nbMaybe}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Events.Maybe')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.eventItemContainer}>
            <View style={styles.row}>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 40}}>
                  <Text style={{textAlign: 'center'}}> {mntNature}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Events.AmountNature')}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 40}}>
                  <Text style={{textAlign: 'center'}}> {mntArgent}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Events.AmountArgent')}
                  </Text>
                </View>
              </View>
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View style={{marginHorizontal: 40}}>
                  <Text style={{textAlign: 'center'}}> {mntContribution}</Text>
                </View>
                <View style={{marginHorizontal: 15}}>
                  <Text
                    style={{color: theme.colors.primary, textAlign: 'center'}}>
                    {' '}
                    {t('Events.AmountDonation')}
                  </Text>
                </View>
              </View>
            </View>
            {!closeContribution && (
              <View
                style={{flexDirection: 'column', flex: 1, marginVertical: 10}}>
                <View
                  style={{
                    marginHorizontal: 15,
                    alignItems: 'center',
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
