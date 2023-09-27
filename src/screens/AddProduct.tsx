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
import { Product } from '../contexts/types';
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

export const AddProduct = () => {
    const { t } = useTranslation();
    const [, dispatch] = useStore()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const navigation = useNavigation()
    const [productName, setProductName] = useState<string>('')
    const [nameDirty, setNameDirty] = useState(false)
    const [productDescription, setProductDescription] = useState<string>('')
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
        setProductName(value)
    }
    const handleDescriptionChange = (value: string) => {
        setDescriptionDirty(true)
        setProductDescription(value)
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
            borderColor: productName.trim().length === 0 && nameDirty ? ColorPallet.error : ColorPallet.lightGray,
            borderWidth: productName.trim().length === 0 && nameDirty ? 2 : 1,
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
            let product: Product = {
                id: uuidv4(),
                name: productName,
                description: productDescription,
                devise: productDevise,
                quantite: parseInt(productQuantite),
                prixUnitaire: parseInt(productPrixUnitaire),
                images: productImage,
                userId: userId
            }
            console.log(product)
            dispatch({
                type: DispatchAction.ADD_PRODUCT,
                payload: product,
            })
            navigation.navigate('Ventes' as never)
        } catch (e: unknown) {

        }

    }

    return (
        <SafeAreaView>
            <BacktoHome textRoute={t('Ventes.title')} />
            <Header>{t('AddProduct.title')}</Header>
            <ScrollView>
                <View style={styles.section}>
                    <NameProduct
                        productName={productName}
                        setProductName={handleNameChange}
                        containerStyles={styles.containerStyleName}
                    />
                    {productName.length === 0 && nameDirty && <Text style={styles.error}>{t('Global.NameErrorEmpty')}</Text>}
                </View>
                <View style={styles.section}>
                    <DescriptionProduct
                        maxLength={200}
                        productDescription={productDescription}
                        setProductDescription={handleDescriptionChange}
                    />
                    {productDescription.length === 0 && descriptionDirty && <Text style={styles.error}>{t('Global.DescriptionErrorEmpty')}</Text>}
                </View>
                <View style={styles.section}>
                    <QuantiteProduct
                        productQuantite={productQuantite}
                        setProductQuantite={handleQuantiteChange}
                        containerStyles={styles.containerStyleName}
                    />
                </View>
                {productQuantite.length === 0 && quantiteDirty && <Text style={styles.error}>{t('Global.QuantiteErrorEmpty')}</Text>}
                <View style={styles.section}>
                    <PrixUnitaireProduct
                        productPrixUnitaire={productPrixUnitaire}
                        setProductPrixUnitaire={handlePrixUnitaireChange}
                        containerStyles={styles.containerStyleName}
                    />
                </View>
                {productPrixUnitaire.length === 0 && prixUnitaireDirty && <Text style={styles.error}>{t('Global.PrixUnitaireErrorEmpty')}</Text>}
                <View style={styles.section}>
                    <DeviseProduct
                        productDevise={productDevise}
                        setProductDevise={handleDeviseChange}
                        containerStyles={styles.containerStyleName}
                    />
                </View>
                <View style={styles.section}>
                    <ImageProduct
                        productImage={productImage}
                        setProductImage={handleImageChange}
                        containerStyles={styles.containerStyleName}
                    />
                </View>
                {productDevise.length === 0 && imageDirty && <Text style={styles.error}>{t('Global.ImageErrorEmpty')}</Text>}

                <View style={styles.section}>

                </View>
            </ScrollView>
            <View style={styles.section}>
                <View style={styles.row}>
                    <View style={{ marginRight: 90, alignItems: 'flex-start' }}>
                        <Button mode="contained" onPress={() => navigation.navigate('Ventes' as never)}>
                            {t('Global.Cancel')}
                        </Button>
                    </View>
                    <View style={[{ marginLeft: 90, alignItems: 'flex-end' }]}>
                        <Button mode="contained" onPress={handleSaveProducts}>
                            {t('Global.Create')}
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
