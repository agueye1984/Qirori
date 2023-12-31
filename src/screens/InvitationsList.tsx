import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {useStore} from '../contexts/store';
import {LocalStorageKeys} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Contribution, Invitation, User} from '../contexts/types';
import {BacktoHome} from '../components/BacktoHome';
import {Table, Row} from 'react-native-table-component';

export const InvitationsList = () => {
  const defaultStyles = DefaultComponentsThemes();
  const {t} = useTranslation();
  const [state] = useStore();
  const [userId, setUserId] = useState('');
  const tableHead = ['Event', 'Invite', 'Presence', 'Number Person'];
  const widthArr = [100, 100, 100, 100];
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(LocalStorageKeys.UserId)
      .then(result => {
        if (result != null) {
          setUserId(result);
        }
      })
      .catch(error => console.log(error));
    let invitations: Invitation[] = [];
    const events = state.events.filter(event => event.userId === userId);
    events.map((event, index) => {
      const invitation = state.invitations.find(
        invite => invite.eventId === event.id,
      ) as Invitation;
      invitations[index] = invitation;
    });
    setInvitations(invitations);
  }, []);

  const generateTableData = (invitations: Invitation[]) => {
    const data: any[] = [];
    if (invitations === undefined) {
      invitations = [];
    }
    if (invitations.length > 0) {
      invitations.map((invite, index) => {
        const event = state.events.find(e => e.id === invite.eventId);
        const user = state.user.find(e => e.id === invite.userId);
        let row: any[] = [];
        if (event !== undefined) {
          row[0] = event.name;
        }
        if (user !== undefined) {
          row[1] = user.name;
        }
        row[2] = invite.reponse;
        if (invite.reponse === '') {
          row[2] = 'May be';
        }
        const nbEnfants =
          invite.nbrEnfants === undefined ? 0 : invite.nbrEnfants;
        row[3] = invite.nbrAdultes + nbEnfants;

        data.push(row);
      });
    }
    return data;
  };

  const data = generateTableData(invitations);

  const styles = StyleSheet.create({
    container: {padding: 16, paddingTop: 30, backgroundColor: '#fff'},
    head: {height: 40, backgroundColor: '#f1f8ff'},
    text: {textAlign: 'center', fontWeight: 'bold'},
    dataWrapper: {marginTop: -1},
    row: {height: 30},
  });

  return (
    <SafeAreaView>
      <BacktoHome textRoute={t('HomeScreen.title')} />
      <Header>{t('Invitations.title')}</Header>
      <View style={{justifyContent: 'center', alignContent: 'center'}}>
        {invitations.length === 0 && (
          <Text
            style={[
              defaultStyles.text,
              {
                marginVertical: 50,
                paddingHorizontal: 10,
                textAlign: 'center',
              },
            ]}>
            {t('Invitations.EmptyList')}
          </Text>
        )}
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                <Row
                  data={tableHead}
                  widthArr={widthArr}
                  style={styles.head}
                  textStyle={styles.text}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{borderColor: '#C1C0B9'}}>
                  {data.map((dataRow, index) => {
                    return (
                      <Row
                        key={index}
                        data={dataRow}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          {backgroundColor: index % 2 ? '#ffffff' : '#C1C0B9'},
                        ]}
                        textStyle={styles.text}
                      />
                    );
                  })}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
