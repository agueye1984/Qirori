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
import { Event, ManageEventsParamList, Product, Service } from '../contexts/types';
import { dateDebutValidator, dateFinValidator, descriptionValidator, heureDebutValidator, heureFinValidator, localisationValidator, nameValidator } from '../core/utils'
import { LocalStorageKeys } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NameSection } from '../components/NameSection'
import { DescriptionSection } from '../components/DescriptionSection'
import { DateHeureSection } from '../components/DateHeureSection'
import { EmplacementSection } from '../components/EmplacementSection'
import { StackNavigationProp } from '@react-navigation/stack'
import { NameProduct } from '../components/NameProduct'
import { DescriptionProduct } from '../components/DescriptionProduct'
import { QuantiteProduct } from '../components/QuantiteProduct'
import { PrixUnitaireProduct } from '../components/PrixUnitaireProduct'
import { DeviseProduct } from '../components/DeviseProduct'
import { ImageProduct } from '../components/ImageProduct'
import { theme } from '../core/theme'
import { useTranslation } from 'react-i18next'

export const AddService = () => {
    const { t } = useTranslation();
    const [, dispatch] = useStore()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const navigation = useNavigation()
    const [serviceName, setServiceName] = useState<string>('')
    const [nameDirty, setNameDirty] = useState(false)
    const [serviceDescription, setServiceDescription] = useState<string>('')
    const [descriptionDirty, setDescriptionDirty] = useState(false)
    const [serviceImage, setServiceImage] = useState<string>('assets/No_image_available.svg')
    const [imageDirty, setImageDirty] = useState(false)

    const handleNameChange = (value: string) => {
        setNameDirty(true)
        setServiceName(value)
    }
    const handleDescriptionChange = (value: string) => {
        setDescriptionDirty(true)
        setServiceDescription(value)
    }

    const handleImageChange = (value: string) => {
        setImageDirty(true)
        setServiceImage(value)
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
            borderColor: serviceName.trim().length === 0 && nameDirty ? ColorPallet.error : ColorPallet.lightGray,
            borderWidth: serviceName.trim().length === 0 && nameDirty ? 2 : 1,
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

    const handleSaveProducts = async () => {
        try {
            const userId = await AsyncStorage.getItem(LocalStorageKeys.UserId);
            let service: Service = {
                id: uuidv4(),
                name: serviceName,
                description: serviceDescription,
                images: serviceImage,
                userId: userId
            }
            console.log(service)
            dispatch({
                type: DispatchAction.ADD_SERVICE,
                payload: service,
            })
            navigation.navigate('Ventes' as never)
        } catch (e: unknown) {

        }

    }

    return (
        <SafeAreaView>
            <BacktoHome textRoute={t('Ventes.title')} />
            <Header>{t('AddService.title')}</Header>

            <ScrollView>
                <View style={styles.section}>
                    <NameProduct
                        productName={serviceName}
                        setProductName={handleNameChange}
                        containerStyles={styles.containerStyleName}
                    />
                    {serviceName.length === 0 && nameDirty && <Text style={styles.error}>{t('Global.NameErrorEmpty')}</Text>}
                </View>
                <View style={styles.section}>
                    <DescriptionProduct
                        maxLength={200}
                        productDescription={serviceDescription}
                        setProductDescription={handleDescriptionChange}
                    />
                    {serviceDescription.length === 0 && descriptionDirty && <Text style={styles.error}>{t('Global.DescriptionErrorEmpty')}</Text>}
                </View>
                <View style={styles.section}>
                    <ImageProduct
                        productImage={serviceImage}
                        setProductImage={handleImageChange}
                        containerStyles={styles.containerStyleName}
                    />
                </View>
                {serviceImage.length === 0 && imageDirty && <Text style={styles.error}>{t('Global.ImageErrorEmpty')}</Text>}
            </ScrollView>
            <View style={styles.itemContainer}>
                <View style={styles.row}>
                    <View style={defaultStyles.leftSectRowContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Ventes' as never)}>
                            <Text style={[defaultStyles.text, { marginVertical: 10, marginHorizontal: 10, fontSize: 20, color: theme.colors.primary }]}>{t('Global.Cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    {nameDirty && descriptionDirty && 
                        <View style={defaultStyles.rightSectRowContainer}>
                            <TouchableOpacity onPress={handleSaveProducts}>
                                <Text style={[defaultStyles.text, { marginVertical: 10, marginHorizontal: 10, fontSize: 20, color: theme.colors.primary }]}>{t('Global.Create')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}