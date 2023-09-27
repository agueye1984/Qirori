import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useTheme } from '../contexts/theme';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { AgeEnfant, Invitation, ManageEventsParamList, User } from '../contexts/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BacktoHome } from '../components/BacktoHome';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomInputText } from '../components/CustomInputText';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LocalStorageKeys } from '../constants';
import { useStore } from '../contexts/store';
import { DispatchAction } from '../contexts/reducers/store';
import { theme } from '../core/theme';
import Button from '../components/Button';

type eventDetailsProp = StackNavigationProp<ManageEventsParamList, 'EventDetails'>


export const InvitationsContacts = () => {
  const [state, dispatch] = useStore();
  const defaultStyles = DefaultComponentsThemes();
  const { ColorPallet } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<RouteProp<ManageEventsParamList, 'InvitationsContacts'>>();
  const item = route.params.item;
  const navigation = useNavigation<eventDetailsProp>()
  const [toggle, setToggle] = useState(false)
  const [numTelephone, setNumTelephone] = useState<string>('')
  const [userId, setUserId] = useState('')

  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then((result) => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error))


  const getToggleOnOff = (toggle: boolean) => {
    setToggle(toggle)
  };

  const handleNumTelephone = (value: string) => {
    setNumTelephone(value)
  }

  const handleSaveInvitations = async () => {
    const findIndex = state.invitations.findIndex((req) => req.numeroTelephone === numTelephone);
    const ageEnfant: AgeEnfant[] = [];
    if (findIndex) {
      let invitation: Invitation = {
        id: uuidv4(),
        eventId: item.id,
        reponse: '',
        nbrAdultes: 0,
        numeroTelephone: numTelephone,
        nbrEnfants: 0,
        AgeEnfants: ageEnfant,
        userId: userId,
        closeDonation: false
      }
      dispatch({
        type: DispatchAction.ADD_INVITE,
        payload: invitation,
      })
      navigation.navigate('EventDetails', { item: item, })
    }

  }

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
      backgroundColor:'white'
    },
  })

  return (
    <SafeAreaView>
      <BacktoHome textRoute={item.name} />
      <Header>{t('InvitationsContacts.title')}</Header>
      <View>
        <View style={styles.section}>
          <Text style={[styles.detailsTitle, { marginTop: 15, marginLeft: 10 }]}>{t('InvitationsContacts.Share')}</Text>
          <View style={[styles.itemContainer, { marginTop: 15 }]}>
            <View style={styles.row}>
              <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <Text >{t('InvitationsContacts.Everyone')}</Text>
              </View>
              <View style={{ marginVertical: 10, marginLeft: 150 }}>
                {toggle ? (
                  <TouchableOpacity onPress={() => getToggleOnOff(false)}>
                    <Icon
                      name={'toggle-on'}
                      color={theme.colors.primary}
                      size={20}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => getToggleOnOff(true)}>
                    <Icon
                      name={'toggle-off'}
                      color={ColorPallet.lightGray}
                      size={20}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={[styles.itemSeparator, { flex: 0.2 }]}></View>
            <View style={styles.row}>
              <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                <Text >{t('InvitationsContacts.Limit')}</Text>
              </View>
              <View style={{ marginVertical: 15, marginLeft: 200 }}>
                <Text >{t('InvitationsContacts.Nos')}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.detailsTitle, { marginTop: 15, marginLeft: 10 }]}>{t('InvitationsContacts.Invite')}</Text>
          <View style={[styles.itemContainer, { marginTop: 15 }]}>
            <View style={styles.row}>
              <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ContactsList' as never)}>
                  <Text >{t('InvitationsContacts.FromContacts')}</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 10, marginLeft: 200 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ContactsList' as never)}>
                  <Icon
                    name={'angle-right'}
                    color={ColorPallet.darkGray}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.itemSeparator, { flex: 0.2 }]}></View>
            <View style={styles.row}>
              <View style={{ marginHorizontal: 15 }}>
                <CustomInputText
                  value={numTelephone}
                  setValue={handleNumTelephone}
                  placeholder={t('InvitationsContacts.PhoneNumber')}
                  containerStyle={styles.containerStyleName}
                />
              </View>
              <View style={{ marginLeft: 50 }}>
                <Button mode="contained" onPress={handleSaveInvitations}>
                  {t('InvitationsContacts.Invitee')}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>


  )
}
