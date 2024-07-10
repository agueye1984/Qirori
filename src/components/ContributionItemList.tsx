import React, {useEffect, useState} from 'react'
import {View, Text, ScrollView} from 'react-native'
import {Contribution, Event, TypeEvent, User} from '../contexts/types'
import {useTranslation} from 'react-i18next'
import {useTheme} from '../contexts/theme'

import {getFilteredRecords, getRecordById} from '../services/FirestoreServices'
import DefaultComponentsThemes from '../defaultComponentsThemes'

type Props = {
  event: Event
}

const ContributionItemList = ({event}: Props) => {
  const {t, i18n} = useTranslation()
  const {ColorPallet} = useTheme()
  const [contributions, setContributions] = useState<any[]>([])
  const selectedLanguageCode = i18n.language
  const defaultStyles = DefaultComponentsThemes()

  useEffect(() => {
    // Exemple d'utilisation de la fonction getFilteredRecords
    const fetchData = async () => {
      try {
        const data = await getFilteredRecords('contributions', 'eventId', event.id)
        const newDonation: any[] = []
        console.log(event.id)
        data.map(async (record) => {
          const donation = record.data as Contribution
          const nature = donation.nature == undefined ? '' : donation.nature
          const montant = donation.montant == undefined ? 0 : donation.montant
          const typeEvent = (await getRecordById('type_events', event.name)) as TypeEvent
          const userId = donation.userId == null ? '' : donation.userId
          const user = (await getRecordById('users', userId)) as User
          let nameEvent = typeEvent === undefined ? '' : typeEvent.nameFr
          if (selectedLanguageCode === 'en') {
            nameEvent = typeEvent === undefined ? '' : typeEvent.nameEn
          }
          const contributionList = {
            eventName: nameEvent,
            userName: user.displayName,
            nature: nature,
            montant: montant,
          }
          newDonation.push(contributionList)
        })
        console.log(newDonation.length)
        setContributions(newDonation)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [event, selectedLanguageCode])


  return (
    <ScrollView style={{padding: 10}} scrollEnabled>
      {contributions.map((donation: any, index: number) => {
        return (
          <View style={defaultStyles.contactCon} key={index.toString()}>
            <View style={defaultStyles.contactDat}>
              <View style={{flexDirection: 'row'}}>
                <Text style={defaultStyles.name}>{t('ContributionsList.eventTitle')} : </Text>
                <Text style={defaultStyles.txt}>{donation.eventName} </Text>
                <Text style={defaultStyles.name}>{t('ContributionsList.userTitle')} : </Text>
                <Text style={defaultStyles.txt}>{donation.userName} </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={defaultStyles.name}>{t('ContributionsList.natureTitle')} : </Text>
                <Text style={defaultStyles.txt}>{donation.nature} </Text>
                <Text style={defaultStyles.name}>{t('ContributionsList.montantTitle')} : </Text>
                <Text style={defaultStyles.txt}>{donation.montant} </Text>
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}

export default ContributionItemList
