import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {ManageEventsParamList} from '../contexts/types'
import {NameProduct} from '../components/NameProduct'
import {DescriptionProduct} from '../components/DescriptionProduct'
import {QuantiteProduct} from '../components/QuantiteProduct'
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct'
import {ImageProduct} from '../components/ImageProduct'
import {useTranslation} from 'react-i18next'
import Button from '../components/Button'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import {
  categoryValidator,
  descriptionValidator,
  imageValidator,
  nameSectionValidator,
  prixUnitaireValidator,
  quantiteValidator,
} from '../core/utils'
import {CategoryService} from '../components/CategoryService'

export const EditProduct = () => {
  const currentUser = auth().currentUser
  const {t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditProduct'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [productName, setProductName] = useState<string>(item.name)
  const [nameError, setNameError] = useState('')
  const [productDescription, setProductDescription] = useState<string>(item.description)
  const [descriptionError, setDescriptionError] = useState('')
  const productDevise = item.devise
  let productImage = item.images
  const [imageError, setImageError] = useState('')
  const [productPrixUnitaire, setProductPrixUnitaire] = useState<string>(item.prixUnitaire.toString())
  const [prixUnitaireError, setPrixUnitaireError] = useState('')
  const [productQuantite, setProductQuantite] = useState<string>(item.quantite.toString())
  const [quantiteError, setQuantiteError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [serviceCategory, setServiceCategory] = useState<string>(item.category)
  const [categoryError, setCategoryError] = useState('')
  const [productImage1, setProductImage1] = useState<string>('')

  useEffect(() => {
    storage()
      .ref(productImage)
      .getDownloadURL()
      .then((url) => setImageUrl(url))
  }, [productImage])

  const handleNameChange = (value: string) => {
    setNameError('')
    setProductName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('')
    setProductDescription(value)
  }

  const handleQuantiteChange = (value: string) => {
    setQuantiteError('')
    setProductQuantite(value)
  }

  const handlePrixUnitaireChange = (value: string) => {
    setPrixUnitaireError('')
    setProductPrixUnitaire(value)
  }

  const handleImageChange = (value: string) => {
    setImageError('')
    setProductImage1(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryError('')
    setServiceCategory(value)
  }

  const handleSaveProducts = async () => {
    try {
      const nameEmpty = nameSectionValidator(productName, t)
      const descriptionEmpty = descriptionValidator(productDescription, t)
      const categoryEmpty = categoryValidator(serviceCategory, t)
      const quantiteEmpty = quantiteValidator(productQuantite, t)
      const prixUnitaireEmpty = prixUnitaireValidator(productPrixUnitaire, t)
      const imageEmpty = imageValidator(productImage, t)

      if (nameEmpty || descriptionEmpty || categoryEmpty || quantiteEmpty || prixUnitaireEmpty || imageEmpty) {
        setNameError(nameEmpty)
        setDescriptionError(descriptionEmpty)
        setCategoryError(categoryEmpty)
        setQuantiteError(quantiteEmpty)
        setPrixUnitaireError(prixUnitaireEmpty)
        setImageError(imageEmpty)
      } else {
        let filename = productImage.split('/').pop()
        if (productImage1 != '') {
          filename = productImage1.split('/').pop()
          console.log(productImage1)
          const task = storage().ref(filename).putFile(productImage1)
          try {
            await task
          } catch (e) {
            console.error(e)
          }
        }
        firestore()
          .collection('products')
          .doc(item.id)
          .update({
            id: item.id,
            name: productName,
            category: serviceCategory,
            description: productDescription,
            devise: productDevise,
            quantite: parseInt(productQuantite),
            prixUnitaire: parseInt(productPrixUnitaire),
            images: filename,
            userId: currentUser?.uid,
          })
          .then(() => {
            console.log('Product added!')
            navigation.navigate('Ventes' as never)
          })
      }
    } catch (e: unknown) {}
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddProduct.title')}</Header>
      <ScrollView
        scrollEnabled
        showsVerticalScrollIndicator
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={defaultStyles.scrollViewContent}>
        <View style={defaultStyles.section}>
          <CategoryService categoryService={serviceCategory} setCategoryService={handleCategoryChange} />
          {categoryError && <Text style={defaultStyles.error}>{t('Global.CategoryErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <NameProduct productName={productName} setProductName={handleNameChange} />
        </View>
        {nameError != '' && <Text style={defaultStyles.error}>{nameError}</Text>}
        <View style={defaultStyles.section}>
          <DescriptionProduct
            maxLength={200}
            productDescription={productDescription}
            setProductDescription={handleDescriptionChange}
          />
        </View>
        {descriptionError != '' && <Text style={defaultStyles.error}>{descriptionError}</Text>}
        <View style={defaultStyles.section}>
          <QuantiteProduct productQuantite={productQuantite} setProductQuantite={handleQuantiteChange} />
        </View>
        {quantiteError != '' && <Text style={defaultStyles.error}>{quantiteError}</Text>}
        <View style={defaultStyles.section}>
          <PrixUnitaireProduct
            productPrixUnitaire={productPrixUnitaire}
            setProductPrixUnitaire={handlePrixUnitaireChange}
          />
        </View>
        {prixUnitaireError != '' && <Text style={defaultStyles.error}>{prixUnitaireError}</Text>}
        <View style={defaultStyles.section}>
          <ImageProduct productImage={productImage1} setProductImage={handleImageChange} imageUrl={imageUrl} />
        </View>
        {imageError != '' && <Text style={defaultStyles.error}>{imageError}</Text>}
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('Ventes' as never)} style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSaveProducts} style={defaultStyles.button}>
            {t('Global.Modify')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
