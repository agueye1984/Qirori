import React, { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import { useStore } from '../contexts/store'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Contribution, Invitation, User } from '../contexts/types'
import { BacktoHome } from '../components/BacktoHome'
import { Table, Row } from 'react-native-table-component';


export const ContributionsList = () => {
  const defaultStyles = DefaultComponentsThemes();
  const { t } = useTranslation();
  const [state] = useStore();
  const [userId, setUserId] = useState('')
  const tableHead= ["Event", "Donator", "Type Donation", "Amount"];
  const widthArr = [100, 100, 100, 100];

  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))
  let contributions: Contribution[] = [];
  const events = state.events.filter((event) => event.userId === userId);
  events.map((event, index) => {
    const donations = state.contributions.find((donation) => donation.eventId === event.id) as Contribution;
    contributions[index] = donations;
  });
  console.log(contributions);

  const generateTableData = (contributions: Contribution[]) => {
    const data: any[] = [];
    
    contributions.map((contribution, index) => {
      const event = state.events.find((e) => e.id === contribution.eventId);
      const user = state.user.find((e) => e.id === contribution.userId);
      let row: any[] = [];
      if(event!==undefined){
        row[0] = event.name;
      }
      if(user!==undefined){
        row[1] = user.name;
      }
      row[2] = contribution.nature;
      row[3] = contribution.montant;
      
       data.push(row);
    });

    return data;
 };
 
 const data = generateTableData(contributions);
 console.log(data)

  if (events) {
    //const telephone = users.telephone
    //invitations = state.invitations.filter((invitation) => invitation.numeroTelephone === telephone && invitation.closeDonation) as Invitation[]
    // invitations =  getCanContributions(telephone);
    // console.log(invitations);
  }

  const styles = StyleSheet.create({
    container: { padding: 16, paddingTop: 30, backgroundColor: "#fff" },
    head: { height: 40, backgroundColor: "#f1f8ff" },
    text: { textAlign: "center", fontWeight: "bold" },
    dataWrapper: { marginTop: -1 },
    row: { height: 30 },
  })

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Contributions.title')}</Header>
      <View style={{ justifyContent: 'center', alignContent: 'center' }}>
        {contributions.length === 0 && (
          <Text
            style={[
              defaultStyles.text,
              {
                marginVertical: 50,
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            ]}>
            {t('Contributions.EmptyList')}
          </Text>
        )}
        <View style={styles.container}>
         <ScrollView horizontal={true}>
            <View>
               <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                  <Row
                     data={tableHead}
                     widthArr={widthArr}
                     style={styles.head}
                     textStyle={styles.text}
                  />
               </Table>
               <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                     {data.map((dataRow, index) => {
          
                      return (
                        <Row
                           key={index}
                           data={dataRow}
                           widthArr={widthArr}
                           style={[styles.row,{ backgroundColor: index % 2 ? "#ffffff": "#C1C0B9" }]}
                           textStyle={styles.text}
                        />
                     )})}
                  </Table>
               </ScrollView>
            </View>
         </ScrollView>
      </View>
        
      </View>
    </SafeAreaView>
  )
}
