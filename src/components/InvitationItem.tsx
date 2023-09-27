import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Event, Invitation, ManageEventsParamList } from '../contexts/types'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { DateEvent } from './DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useStore } from '../contexts/store'
import { theme } from '../core/theme'

type Props = {
    item: Invitation
}

type InvitationDetailsProp = StackNavigationProp<ManageEventsParamList, 'InvitationDetails'>

export const InvitationItem = ({ item }: Props) => {
    const { i18n, t } = useTranslation();
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const { navigate } = useNavigation<InvitationDetailsProp>()
    const [state] = useStore();
    const selectedLanguageCode = i18n.language;
    let languageDate = ''
    if(selectedLanguageCode==='fr'){
        languageDate = 'fr-fr';
    }
    if(selectedLanguageCode==='en'){
        languageDate = 'en-GB';
    }

    const events = state.events.find((event) => event.id === item.eventId) as Event;

    const anneeDebut = parseInt(events.dateDebut.substring(0, 4));
    const moisDebut = parseInt(events.dateDebut.substring(4, 6)) - 1;
    const jourDebut = parseInt(events.dateDebut.substring(6, 8));
    const heureDebut = parseInt(events.heureDebut.substring(0, 2));
    const minutesDebut = parseInt(events.heureDebut.substring(2, 4));
    const dateDebut = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0);
    const heureFormatDebut = dateDebut.toLocaleTimeString(languageDate, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
    })
    const anneeFin = parseInt(events.dateFin.substring(0, 4));
    const moisFin = parseInt(events.dateFin.substring(4, 6)) - 1;
    const jourFin = parseInt(events.dateFin.substring(6, 8));
    const heureFin = parseInt(events.heureFin.substring(0, 2));
    const minutesFin = parseInt(events.heureFin.substring(2, 4));
    const dateFin = new Date(anneeFin, moisFin, jourFin, heureFin, minutesFin, 0);
    const heureFormatFin = dateFin.toLocaleTimeString(languageDate, {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
    })

    const handleEventSelection = (item: Invitation) => {
        navigate('InvitationDetails', { item: item, })
    }

    const styles = StyleSheet.create({
        itemContainer: {
            height: 70,
            marginHorizontal: 15,
            borderWidth: 0.3,
            flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            backgroundColor: 'white',
        },
        touchableStyle: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '100%',
            width: '100%',
        },
        image: {
            width: 35,
            height: 35,
            marginBottom: 10,
        },
        row: {
            flexDirection: 'row',
            flex: 1,
        },
    })
    let content = (
        <View style={[{ marginVertical: 15, }]} >
            <TouchableOpacity onPress={() => handleEventSelection(item)}>
                <View style={[styles.itemContainer]}>
                    <View style={styles.row}>
                        <DateEvent dateDebut={events.dateDebut} flexSize={0.23} />
                        <View style={styles.row}>
                            <View style={[defaultStyles.leftSectRowContainer]}>
                                <View style={{ flexDirection: 'column', flex: 4, marginHorizontal: 15, marginVertical: 15 }}>
                                    <View style={{ width: 250 }}>
                                        <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 20, }]}>{events.name}</Text>
                                    </View>
                                    <View style={{ width: 250 }}>
                                        <Text>{t('Global.from')} {heureFormatDebut} {t('Global.to')} {heureFormatFin}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[defaultStyles.rightSectRowContainer, { marginHorizontal: 15, marginVertical: 15, alignItems: 'center' }]}>
                                <Icon name="angle-right" size={20} color={theme.colors.primaryText} />
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )

    return content
}
