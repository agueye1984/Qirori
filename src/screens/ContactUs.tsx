import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import { BacktoHome } from '../components/BacktoHome'
import Header from '../components/Header'
import { v4 as uuidv4 } from 'uuid';
import { Mail, Product } from '../contexts/types';
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NameProduct } from '../components/NameProduct'
import { DescriptionProduct } from '../components/DescriptionProduct'
import { QuantiteProduct } from '../components/QuantiteProduct'
import { PrixUnitaireProduct } from '../components/PrixUnitaireProduct'
import { DeviseProduct } from '../components/DeviseProduct'
import { ImageProduct } from '../components/ImageProduct'
import { theme } from '../core/theme'
import { useTranslation } from 'react-i18next'
import Button from '../components/Button'
import { DescriptionContactUs } from '../components/DescriptionContactUs'
import { NameContactUs } from '../components/NameContactUs'
import email from 'react-native-email'

export const ContactUs = () => {
    const { t } = useTranslation();
    const [, dispatch] = useStore()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const navigation = useNavigation()
    const [contactUsName, setContactUsName] = useState<string>('')
    const [nameDirty, setNameDirty] = useState(false)
    const [contactUsDescription, setContactUsDescription] = useState<string>('')
    const [descriptionDirty, setDescriptionDirty] = useState(false)
    const [productDevise, setProductDevise] = useState<string>('')
    const [deviseDirty, setDeviseDirty] = useState(false)
    const [productImage, setProductImage] = useState<string>('assets/No_image_available.svg')
    const [imageDirty, setImageDirty] = useState(false)
    const [productPrixUnitaire, setProductPrixUnitaire] = useState<string>('')
    const [prixUnitaireDirty, setPrixUnitaireDirty] = useState(false)
    const [productQuantite, setProductQuantite] = useState<string>('')
    const [quantiteDirty, setQuantiteDirty] = useState(false)

    const handleNameChange = (value: string) => {
        setNameDirty(true)
        setContactUsName(value)
    }
    const handleDescriptionChange = (value: string) => {
        setDescriptionDirty(true)
        setContactUsDescription(value)
    }

    const handleQuantiteChange = (value: string) => {
        setQuantiteDirty(true)
        setProductQuantite(value)
    }

    const handlePrixUnitaireChange = (value: string) => {
        setPrixUnitaireDirty(true)
        setProductPrixUnitaire(value)
    }

    const handleDeviseChange = (value: string) => {
        setDeviseDirty(true)
        setProductDevise(value)
    }
    const handleImageChange = (value: string) => {
        setImageDirty(true)
        setProductImage(value)
    }

    const sendMessage = async () => {
        try {
            const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
            let contactUs: Mail = {
                id: uuidv4(),
                subject: contactUsName,
                message: contactUsDescription,
                userId: userId
            }
            dispatch({
                type: DispatchAction.ADD_CONTACT_US,
                payload: contactUs,
            })
            navigation.navigate('Setting' as never);
        } catch (e: unknown) {

        }
    }

    const styles = StyleSheet.create({
        section: {
            marginHorizontal: 10,
            paddingVertical: 5,
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
            borderColor: contactUsName.trim().length === 0 && nameDirty ? ColorPallet.error : ColorPallet.lightGray,
            borderWidth: contactUsName.trim().length === 0 && nameDirty ? 2 : 1,
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
            color: theme.colors.primaryText,
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

    return (
        <SafeAreaView>
            <BacktoHome textRoute={t('Setting.title')} />
            <Header>{t('Setting.ContactUs')}</Header>
            <ScrollView>
                <View style={styles.section}>
                    <NameContactUs
                        contactUsName={contactUsName}
                        setContactUsName={handleNameChange}
                    />
                    {contactUsName.length === 0 && nameDirty && <Text style={styles.error}>{t('Global.NameErrorEmpty')}</Text>}
                </View>
                <View style={styles.section}>
                    <DescriptionContactUs
                        maxLength={500}
                        contactUsDescription={contactUsDescription}
                        setContactUsDescription={handleDescriptionChange}
                    />
                    {contactUsDescription.length === 0 && descriptionDirty && <Text style={styles.error}>{t('Global.DescriptionErrorEmpty')}</Text>}
                </View>
            </ScrollView>
            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={{ marginRight: 90, alignItems: 'flex-start' }}>
                        <Button mode="contained" onPress={() => navigation.navigate('Setting' as never)}>
                            {t('Global.Cancel')}
                        </Button>
                    </View>
                    <View style={[{ marginLeft: 90, alignItems: 'flex-end' }]}>
                        <Button mode="contained" onPress={sendMessage}>
                            {t('Global.Send')}
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
