import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import { useTheme } from '../contexts/theme';
SafeAreaView;
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { Invitation, ManageEventsParamList, User } from '../contexts/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useStore } from '../contexts/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorageKeys } from '../constants';
import { BacktoHome } from '../components/BacktoHome';
import { EmptyList } from '../components/EmptyList';
import { EventItem } from '../components/EventItem';
import { InvitationItem } from '../components/InvitationItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../core/theme';
import { version } from 'uuid';
import VersionNumber from 'react-native-version-number';
import auth from '@react-native-firebase/auth';


export const Setting = () => {
    const defaultStyles = DefaultComponentsThemes();
    const { ColorPallet } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation()
    const [state] = useStore();
    const [userId, setUserId] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
        AsyncStorage.getItem(LocalStorageKeys.UserId)
            .then((result) => {
                if (result != null) {
                    setUserId(result);
                }
            })
            .catch(error => console.log(error))
        const users = state.user.find((user) => user.id === userId) as User;
        if (users !== undefined) {
            setName(users.name);
            setEmail(users.email);
            setPhone(users.phone);
        }
    }, [userId, name])

    const logout= ()=>{
       // AsyncStorage.setItem(LocalStorageKeys.UserId,'');
       //navigation.navigate("LoginScreen" as never);
       auth()
       .signOut()
       .then(() => navigation.navigate("LoginScreen" as never));
        
    }
    const styles = StyleSheet.create({
        section: {
            marginHorizontal: 20,
            paddingVertical: 20,
        },
        row: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        itemContainerForm: {
            height: 50,
            marginHorizontal: 5,
            borderWidth: 0.4,
            //flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },

        itemContainerForm1: {
            height: 250,
            marginHorizontal: 5,
            borderWidth: 0.4,
            //flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        itemSeparator: {
            //height: 40,
            marginHorizontal: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 0.2,
        },
    })

    return (
        <SafeAreaView>
            <BacktoHome textRoute={t('Settings.title')} />
            <Header>{t('Setting.title')}</Header>
            <View style={styles.section}>
                <Text style={{ marginVertical: 15 }}>{t('Setting.Name')}</Text>
                <View style={[styles.itemContainerForm]}>
                    <Text style={{ marginVertical: 15, marginLeft: 15 }}>{name}</Text>
                </View>
            </View>
            <View style={[styles.section, { marginVertical: 5 }]}>
                <View style={[styles.itemContainerForm1]}>
                    <TouchableOpacity onPress={()=>{ navigation.navigate("LanguageSetting" as never)}}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ color: theme.colors.primary, marginHorizontal: 15 }}>{t('Setting.LanguageSetting')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemSeparator, { marginTop: 10 }]}></View>
                    <TouchableOpacity onPress={()=>{ navigation.navigate("ContactUs" as never)}}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ color: theme.colors.primary, marginHorizontal: 15 }}>{t('Setting.ContactUs')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemSeparator, { marginTop: 10 }]}></View>
                    <TouchableOpacity onPress={logout}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ color: theme.colors.primary, marginHorizontal: 15 }}>{t('Setting.Logout')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemSeparator, { marginTop: 10 }]}></View>
                    <View style={[styles.row]}>
                        <View style={[defaultStyles.leftSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ marginHorizontal: 15 }}>{t('Setting.Email')}</Text>
                        </View>
                        <View style={[defaultStyles.rightSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ color: theme.colors.lightGray, marginHorizontal: 15 }}>{email}</Text>
                        </View>
                    </View>
                    <View style={[styles.itemSeparator, { marginTop: 10 }]}></View>
                    <View style={[styles.row]}>
                        <View style={[defaultStyles.leftSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ marginHorizontal: 15 }}>{t('Setting.Phone')}</Text>
                        </View>
                        <View style={[defaultStyles.rightSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ color: theme.colors.lightGray, marginHorizontal: 15 }}>{phone}</Text>
                        </View>
                    </View>
                    <View style={[styles.itemSeparator, { marginTop: 10 }]}></View>
                    <View style={[styles.row]}>
                        <View style={[defaultStyles.leftSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ marginHorizontal: 15 }}>{t('Setting.Version')}</Text>
                        </View>
                        <View style={[defaultStyles.rightSectRowContainer, { marginTop: 10 }]}>
                            <Text style={{ color: theme.colors.lightGray, marginHorizontal: 15 }}>{VersionNumber.appVersion + '(' + VersionNumber.buildVersion + ')'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
