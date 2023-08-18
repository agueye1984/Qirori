import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Event, ManageEventsParamList } from '../contexts/types'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { DateEvent } from './DateEvent'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

type Props = {
    item: Event
    action: () => void
}

type eventDetailsProp = StackNavigationProp<ManageEventsParamList, 'EventDetails'>

export const EventItem = ({ item, action }: Props) => {
    const { t } = useTranslation()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const { navigate } = useNavigation<eventDetailsProp>()
    const anneeDebut = parseInt(item.dateDebut.substring(0, 4));
    const moisDebut = parseInt(item.dateDebut.substring(4, 6)) - 1;
    const jourDebut = parseInt(item.dateDebut.substring(6, 8));
    const heureDebut = parseInt(item.heureDebut.substring(0, 2));
    const minutesDebut = parseInt(item.heureDebut.substring(2, 4));
    const dateDebut = new Date(anneeDebut, moisDebut, jourDebut, heureDebut, minutesDebut, 0);
    const heureFormatDebut = dateDebut.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h24'
    })
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

    const handleEventSelection = (item: Event) => {
        navigate('EventDetails', { item: item, })
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
        <TouchableOpacity onPress={() => handleEventSelection(item)}>
            <View style={[styles.itemContainer]}>
                <View style={styles.row}>
                    <DateEvent dateDebut={item.dateDebut} flexSize={0.23} />
                    <View style={styles.row}>
                        <View style={[defaultStyles.leftSectRowContainer]}>
                            <View style={{ flexDirection: 'column', flex: 4, marginHorizontal: 15, marginVertical: 15 }}>
                                <View style={{ width: 250 }}>
                                    <Text style={[defaultStyles.text, { fontWeight: 'bold', fontSize: 20, }]}>{item.name}</Text>
                                </View>
                                <View style={{ width: 250 }}>
                                    <Text>{t('Events.from')} {heureFormatDebut} {t('Events.to')} {heureFormatFin}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[defaultStyles.rightSectRowContainer, { marginHorizontal: 15, marginVertical: 15, alignItems: 'center' }]}>
                            <Icon name="angle-right" size={20} color={ColorPallet.primaryText} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )

    return content
}
