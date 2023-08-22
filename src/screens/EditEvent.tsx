import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { t } from 'i18next'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import BackgroundContents from '../components/BackgroundContents'
import { BacktoHome } from '../components/BacktoHome'
import Header from '../components/Header'
import { v4 as uuidv4 } from 'uuid';
import { Event, ManageEventsParamList } from '../contexts/types';
import { dateDebutValidator, dateFinValidator, descriptionValidator, heureDebutValidator, heureFinValidator, localisationValidator, nameValidator } from '../core/utils'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NameSection } from '../components/NameSection'
import { DescriptionSection } from '../components/DescriptionSection'
import { DateHeureSection } from '../components/DateHeureSection'
import { EmplacementSection } from '../components/EmplacementSection'
import { StackNavigationProp } from '@react-navigation/stack'

type editEventProps = StackNavigationProp<ManageEventsParamList, 'EventDetails'>

export const EditEvent = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditEvent'>>()
  const [state, dispatch] = useStore()
  const defaultStyles = DefaultComponentsThemes()
  const { ColorPallet } = useTheme()
  const navigation = useNavigation<editEventProps>()
  const item = state.events.find((event) => event.id === route.params.itemId) as Event
  const [eventName, setEventName] = useState<string>(item.name)
  const [nameDirty, setNameDirty] = useState(false)
  const [eventDescription, setEventDescription] = useState<string>(item.description)
  const [descriptionDirty, setDescriptionDirty] = useState(false)
  const [eventLocalisation, setEventLocalisation] = useState<string>(item.localisation)
  const [localisationDirty, setLocalisationDirty] = useState(false)
  const dateDebFormat = item.dateDebut.substring(0, 4) + '-' + item.dateDebut.substring(4, 6) + '-' + item.dateDebut.substring(6, 8)
  const heurDebFormat = dateDebFormat + ' ' + item.heureDebut.substring(0, 2) + ':' + item.heureDebut.substring(2, 4)
  const dateFinFormat = item.dateFin.substring(0, 4) + '-' + item.dateFin.substring(4, 6) + '-' + item.dateFin.substring(6, 8)
  const heurFinFormat = dateFinFormat + ' ' + item.heureFin.substring(0, 2) + ':' + item.heureFin.substring(2, 4)
  const [dateDebut, setDateDebut] = useState<Date>(new Date(dateDebFormat))
  const [heureDebut, setHeureDebut] = useState<Date>(new Date(heurDebFormat))
  const [dateFin, setDateFin] = useState<Date>(new Date(dateFinFormat))
  const [heureFin, setHeureFin] = useState<Date>(new Date(heurFinFormat))



  const handleNameChange = (value: string) => {
    setNameDirty(true)
    setEventName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionDirty(true)
    setEventDescription(value)
  }

  const handleLocalisationChange = (value: string) => {
    setLocalisationDirty(true)
    setEventLocalisation(value)
  }

  const handleDateDebutChange = (value: Date) => {
    setDateDebut(value)
  }

  const handleHeureDebutChange = (value: Date) => {
    setHeureDebut(value)
  }

  const handleDateFinChange = (value: Date) => {
    setDateFin(value)
  }

  const handleHeureFinChange = (value: Date) => {
    setHeureFin(value)
  }

  const styles = StyleSheet.create({
    section: {
      marginHorizontal: 10,
      paddingVertical: 10,
    },
    buttonsContainer: {
      paddingBottom: 50,
    },
    error: {
      ...defaultStyles.text,
      color: ColorPallet.error,
      fontWeight: 'bold',
    },
    containerStyleName: {
      borderColor: eventName.trim().length === 0 && nameDirty ? ColorPallet.error : ColorPallet.lightGray,
      borderWidth: eventName.trim().length === 0 && nameDirty ? 2 : 1,
    },
    itemContainer: {
      borderTopWidth: 0.2,
      borderTopStyle: 'solid',
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    input: {
      flex: 1,
      textAlignVertical: 'top',
      fontSize: 16,
      height: '100%',
      color: ColorPallet.primaryText,
    },
    container: {
      minHeight: 50,
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: ColorPallet.lightGray,
      borderRadius: 4,
    },
  })

  const handleSaveEvents = async () => {
    try {
      const dateformatDebut = dateDebut.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('');
      const heureFormatDebut = heureDebut.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
      }).split(':').join('');
      const dateformatFin = dateFin.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('');
      const heureFormatFin = heureFin.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
      }).split(':').join('');
      const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
      let event: Event = {
        id: item.id,
        name: eventName,
        description: eventDescription,
        dateDebut: dateformatDebut,
        heureDebut: heureFormatDebut,
        dateFin: dateformatFin,
        heureFin: heureFormatFin,
        localisation: eventLocalisation,
        userId: userId
      }
      dispatch({
        type: DispatchAction.UPDATE_EVENT,
        payload: event,
      })
      navigation.navigate('Events' as never)
    } catch (e: unknown) {

    }

  }

  return (
    <BackgroundContents>
      <BacktoHome textRoute={t('Events.title')} />
      <Header>{t('AddEvent.titleModify')}</Header>

      <ScrollView>
        <View style={styles.section}>
          <NameSection
            eventName={eventName}
            setEventName={handleNameChange}
            containerStyles={styles.containerStyleName}
          />
          {eventName.length === 0 && nameDirty && <Text style={styles.error}>{t('RegisterScreen.NameErrorEmpty')}</Text>}
        </View>
        <View style={styles.section}>
          <DescriptionSection
            maxLength={200}
            eventDescription={eventDescription}
            setEventDescription={handleDescriptionChange}
          />
          {eventDescription.length === 0 && descriptionDirty && <Text style={styles.error}>{t('AddEvent.DescriptionErrorEmpty')}</Text>}
        </View>
        <View style={styles.section}>
          <DateHeureSection
            dateDeb={dateDebut}
            heureDeb={heureDebut}
            dateF={dateFin}
            heureF={heureFin}
            setDateDeb={handleDateDebutChange}
            setHeureDeb={handleHeureDebutChange}
            setDateF={handleDateFinChange}
            setHeureF={handleHeureFinChange}
          />
        </View>
        <View style={styles.section}>
          <EmplacementSection
            eventLocalisation={eventLocalisation}
            setEventLocalisation={handleLocalisationChange}
            containerStyles={styles.containerStyleName}
          />
        </View>
        {eventLocalisation.length === 0 && localisationDirty && <Text style={styles.error}>{t('AddEvent.localisationErrorEmpty')}</Text>}
      </ScrollView>
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <View style={defaultStyles.leftSectRowContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Events' as never)}>
              <Text style={[defaultStyles.text, { marginVertical: 10, marginHorizontal: 10, fontSize: 20, color: ColorPallet.primary }]}>{t('AddEvent.Cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={defaultStyles.rightSectRowContainer}>
            <TouchableOpacity onPress={handleSaveEvents}>
              <Text style={[defaultStyles.text, { marginVertical: 10, marginHorizontal: 10, fontSize: 20, color: ColorPallet.primary }]}>{t('AddEvent.Modify')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>


    </BackgroundContents>


  )
}
