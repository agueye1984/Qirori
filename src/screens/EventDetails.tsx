import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { t } from 'i18next'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { LargeButton } from '../components/LargeButton'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import BackgroundContents from '../components/BackgroundContents'
import { BacktoHome } from '../components/BacktoHome'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import DatePicker from 'react-native-date-picker'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { v4 as uuidv4 } from 'uuid';
import { Event, ManageEventsParamList } from '../contexts/types';
import { dateDebutValidator, dateFinValidator, descriptionValidator, heureDebutValidator, heureFinValidator, localisationValidator, nameValidator } from '../core/utils'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateEvent } from '../components/DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { AddEvent } from './AddEvent'
import MapView, { Marker } from 'react-native-maps'
import { StackNavigationProp } from '@react-navigation/stack'

type invitationsContactsProps = StackNavigationProp<ManageEventsParamList, 'InvitationsContacts'>;

export const EventDetails = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'EventDetails'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const navigation = useNavigation<invitationsContactsProps>()

  const anneeDebut = parseInt(item.dateDebut.substring(0, 4));
  const moisDebut = parseInt(item.dateDebut.substring(4, 6)) - 1;
  const jourDebut = parseInt(item.dateDebut.substring(6, 8));
  const heureDebut = parseInt(item.heureDebut.substring(0, 2));
  const minutesDebut = parseInt(item.heureDebut.substring(2, 4));
  const dateDebut = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0);
  const heureFormatDebut = dateDebut.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24',

  })
  const jourFormat = dateDebut.toLocaleTimeString('en-GB', {
    weekday: 'long',
  }).split(' ')
  const anneeFin = parseInt(item.dateFin.substring(0, 4));
  const moisFin = parseInt(item.dateFin.substring(4, 6)) - 1;
  const jourFin = parseInt(item.dateFin.substring(6, 8));
  const heureFin = parseInt(item.heureFin.substring(0, 2));
  const minutesFin = parseInt(item.heureFin.substring(2, 4));
  const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
  const heureFormatFin = dateFin.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h24'
  })

  const addToCalendar = (title: string, startDate: string, endDate: string) => {
    const eventConfig = {
      title,
      startDate: startDate.replace('Z', 'ZZ'),
      endDate: endDate.replace('Z', 'ZZ'),
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventId => {
        //handle success (receives event id) or dismissing the modal (receives false)
        if (eventId) {
          console.warn(eventId);
        } else {
          console.warn('dismissed');
        }
      })
      .catch((error: string) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  const handleInvitationsContacts = (item: Event) => {
    navigation.navigate('InvitationsContacts', { item: item, })
  };
  const handleEditEvent = (itemId: string) => {
    navigation.navigate('EditEvent', { itemId: itemId, })
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
  })

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

  const quebecRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };


  return (
    <BackgroundContents>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{item.name}</Header>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ flex: 1, flexDirection: 'row', }}>
              <DateEvent dateDebut={item.dateDebut} flexSize={0.87} />
            </View>
            <View style={{ flex: 4, flexDirection: 'row', }}>
              <View style={[styles.itemContainer]}>
                <View style={{ flexDirection: 'column', flex: 4, marginHorizontal: 5, marginVertical: 5 }}>
                  <View style={{ width: 250 }}>
                    <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 16, }]}>{jourFormat[`0`]} {t('Events.from')} {heureFormatDebut} {t('Events.to')} {heureFormatFin}</Text>
                  </View>
                  <View style={{ width: 250 }}>
                    <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                      <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Icon name={'calendar'} size={20} color={ColorPallet.primary} />
                        <Text style={{ color: ColorPallet.primary }}> {t('Events.addToCalendar')}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

          </View>
          <View style={[styles.itemContainer, { marginTop: 15 }]}>
            <View style={styles.row}>

              <View style={{ flexDirection: 'column', flex: 4, marginVertical: 5 }}>
              <TouchableOpacity onPress={() => handleInvitationsContacts(item)}>
                <View style={{ marginHorizontal: 25 }}>
                  <Icon name={'user-plus'} size={25} color={ColorPallet.primary} />
                </View>
                <View style={{ marginHorizontal: 15 }}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.Invite')}</Text>
                </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'column', flex: 5, marginVertical: 5 }}>
              <TouchableOpacity onPress={() => handleEditEvent(item.id)}>
                <View style={{ marginHorizontal: 15, alignItems: 'flex-end' }}>
                  <Icon name={'pencil'} size={25} color={ColorPallet.primary} />
                </View>
                <View style={{ marginHorizontal: 15, alignItems: 'flex-end' }}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.Modify')}</Text>
                </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={[styles.itemContainer, { marginTop: 15 }]}>
            <View style={styles.row}>

              <View style={{ flexDirection: 'column', flex: 4, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 30 }}>
                  <Text style={{ color: ColorPallet.primary }}> {0}</Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.Invited')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 4, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 25 }}>
                  <Text style={{ color: ColorPallet.primary }}> {0}</Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.Yes')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 4, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={{ color: ColorPallet.primary }}> {0}</Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.No')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 5, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 30 }}>
                  <Text style={{ color: ColorPallet.primary }}> {0}</Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.Maybe')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.itemContainer, { marginTop: 15 }]}>
            <View style={styles.row}>

              <View style={{ flexDirection: 'column', flex: 4, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 40 }}>
                  <Text style={{ color: ColorPallet.primary }}> {'0,00'}</Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.AmountDonation')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 5, marginVertical: 5 }}>
                <View style={{ marginHorizontal: 15, alignItems: 'flex-end', marginTop: 15 }}>
                  <TouchableOpacity onPress={() => addToCalendar(item.name, dateDebut.toISOString(), dateFin.toISOString())}>
                    <Text style={{ color: ColorPallet.primary }}> {t('Events.CloseDonation')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.mapview, { marginTop: 15 }]}>
            <MapView 
              customMapStyle={mapStyle} 
              style={{width: '100%', height: '100%', ...StyleSheet.absoluteFillObject,}} 
              initialRegion={{ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922,longitudeDelta: 0.0421,}}
            >
              <Marker 
                draggable 
                coordinate={{latitude: 37.78825, longitude: -122.4324}} 
                description={'This is a description of the marker'} 
                title={'Test Marker'} 
                onDragEnd={
                  (e) => console.log(JSON.stringify(e.nativeEvent.coordinate))
                }
              />
            </MapView>
          </View>
        </View>
      </ScrollView>
    </BackgroundContents>


  )
}
