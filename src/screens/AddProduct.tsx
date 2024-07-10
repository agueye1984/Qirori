import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
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
  descriptionValidator,
  imageValidator,
  nameSectionValidator,
  prixUnitaireValidator,
  quantiteValidator,
} from '../core/utils'
import {useStore} from '../contexts/store'
import {CategoryService} from '../components/CategoryService'

export const AddProduct = () => {
  const currentUser = auth().currentUser
  const {t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [productName, setProductName] = useState<string>('')
  const [nameError, setNameError] = useState('')
  const [productDescription, setProductDescription] = useState<string>('')
  const [descriptionError, setDescriptionError] = useState('')
  const [state] = useStore()
  const [productImage, setProductImage] = useState<string>('')
  const [imageError, setImageError] = useState('')
  const [productPrixUnitaire, setProductPrixUnitaire] = useState<string>('')
  const [prixUnitaireError, setPrixUnitaireError] = useState('')
  const [productQuantite, setProductQuantite] = useState<string>('')
  const [quantiteError, setQuantiteError] = useState('')
  const productDevise = state.currency.toString()
  const [serviceCategory, setServiceCategory] = useState<string>('')
  const [categoryError, setCategoryError] = useState('')
  const [boutonActif, setBoutonActif] = useState(false)
  const [productError, setProductError] = useState('')

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
    setProductImage(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryError('')
    setServiceCategory(value)
  }

  const handleSaveProducts = async () => {
    setBoutonActif(true)
    try {
      const nameEmpty = nameSectionValidator(productName, t)
      const descriptionEmpty = descriptionValidator(productDescription, t)
      const quantiteEmpty = quantiteValidator(productQuantite, t)
      const prixUnitaireEmpty = prixUnitaireValidator(productPrixUnitaire, t)
      const imageEmpty = imageValidator(productImage, t)

      if (nameEmpty || descriptionEmpty || quantiteEmpty || prixUnitaireEmpty || imageEmpty) {
        setNameError(nameEmpty)
        setDescriptionError(descriptionEmpty)
        setQuantiteError(quantiteEmpty)
        setPrixUnitaireError(prixUnitaireEmpty)
        setImageError(imageEmpty)
        setBoutonActif(false)
      } else {
        firestore()
          .collection('products')
          // Filter results
          .where('name', '==', productName)
          .where('userId', '==', currentUser?.uid)
          .get()
          .then(async (querySnapshot) => {
            console.log(querySnapshot.empty)
            if (querySnapshot.empty) {
              const uid = uuidv4()
              const filename = productImage.split('/').pop()
              const task = storage().ref(filename).putFile(productImage)
              try {
                await task
              } catch (e) {
                console.error(e)
              }
              firestore()
                .collection('products')
                .doc(uid)
                .set({
                  id: uid,
                  category: serviceCategory,
                  name: productName,
                  description: productDescription,
                  devise: productDevise,
                  quantite: parseInt(productQuantite),
                  prixUnitaire: parseInt(productPrixUnitaire),
                  images: filename,
                  userId: currentUser?.uid,
                  actif: true,
                })
                .then(() => {
                  console.log('Product added!')
                  setBoutonActif(false)
                  navigation.navigate('Ventes' as never)
                })
            } else {
              setBoutonActif(false)
              setProductError(t('AddProduct.ProductExistError'))
            }
          })
      }
    } catch (e: unknown) {
      setBoutonActif(false)
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddProduct.title')}</Header>
      <Text style={defaultStyles.error}>{productError}</Text>
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
          <ImageProduct productImage={productImage} setProductImage={handleImageChange} />
        </View>
        {imageError != '' && <Text style={defaultStyles.error}>{imageError}</Text>}
      </ScrollView>
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button mode="contained" onPress={() => navigation.navigate('Ventes' as never)} style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button mode="contained" onPress={handleSaveProducts} style={defaultStyles.button} disabled={boutonActif}>
            {t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
