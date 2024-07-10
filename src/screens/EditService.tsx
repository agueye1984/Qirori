import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import {ManageEventsParamList, Offre} from '../contexts/types'
import {NameProduct} from '../components/NameProduct'
import {DescriptionProduct} from '../components/DescriptionProduct'
import {ImageProduct} from '../components/ImageProduct'
import {useTranslation} from 'react-i18next'
import Button from '../components/Button'
import {OffreService} from '../components/OffreService'
import {CategoryService} from '../components/CategoryService'
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import {
  categoryValidator,
  conditionValidator,
  descriptionValidator,
  imageValidator,
  nameSectionValidator,
  offreValidator,
  prixUnitaireValidator,
} from '../core/utils'
import {StackNavigationProp} from '@react-navigation/stack'
import {useStore} from '../contexts/store'
import {ConditionsService} from '../components/ConditionsService'

type EditServiceProps = StackNavigationProp<ManageEventsParamList, 'EditService'>

export const EditService = () => {
  const currentUser = auth().currentUser
  const {t} = useTranslation()
  const route = useRoute<RouteProp<ManageEventsParamList, 'EditService'>>()
  const item = route.params.item
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation<EditServiceProps>()
  const [serviceName, setServiceName] = useState<string>(item.name)
  const [nameError, setNameError] = useState('')
  const [serviceDescription, setServiceDescription] = useState<string>(item.description)
  const [descriptionError, setDescriptionError] = useState('')
  let serviceImage = item.images
  const [imageError, setImageError] = useState('')
  const [offres, setOffres] = useState(item.offres)
  const [offresIds, setOffresIds] = useState<string[]>(item.offresIds)
  const [offre, setOffre] = useState<string>('')
  const [offreError, setOffreError] = useState('')
  const [serviceCategory, setServiceCategory] = useState<string>(item.category)
  const [categoryError, setCategoryError] = useState('')
  const [montant, setMontant] = useState<string>('')
  const [montantError, setMontantError] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [number, setNumber] = useState(-1)
  const [state] = useStore()
  const [serviceImage1, setServiceImage1] = useState<string>('')
  const [serviceConditions, setServiceConditions] = useState<string>(
    item.conditions === undefined ? '' : item.conditions
  )
  const [conditionsError, setConditionsError] = useState('')

  useEffect(() => {
    storage()
      .ref(serviceImage)
      .getDownloadURL()
      .then((url) => setImageUrl(url))
  }, [serviceImage])

  const handleNameChange = (value: string) => {
    setNameError('')
    setServiceName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('')
    setServiceDescription(value)
  }

  const handleImageChange = (value: string) => {
    setImageError('')
    setServiceImage1(value)
  }

  const handleOffreChange = (value: string) => {
    setOffreError('')
    setOffre(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryError('')
    setServiceCategory(value)
  }

  const handleMontanthange = (value: string) => {
    setMontantError('')
    setMontant(value)
  }

  const handleConditionsChange = (value: string) => {
    setConditionsError('')
    setServiceConditions(value)
  }

  const editOffre = (offres: Offre[], number: number) => {
    setOffre(offres[number].name)
    setMontant(offres[number].montant.toString())
    setNumber(number)
  }

  const addOffre = (offres: Offre[], offresId: string[], index: number) => {
    const offreEmpty = offreValidator(offre, t)
    const montantEmpty = prixUnitaireValidator(montant, t)
    if (offreEmpty || montantEmpty) {
      setOffreError(offreEmpty)
      setMontantError(montantEmpty)
    } else {
      const devise = state.currency.toString()
      if (index === -1) {
        const id = uuidv4()
        const offer = {
          id: id,
          name: offre,
          montant: parseInt(montant),
          devise: devise,
        }
        offres.push(offer)
        offresId.push(id)
      } else {
        const id = offres[index].id
        const offer = {
          id: id,
          name: offre,
          montant: parseInt(montant),
          devise: devise,
        }
        offres[index] = offer
        offresId[index] = id
      }

      setOffre('')
      setOffreError('')
      setMontant('')
      setMontantError('')
      setOffres(offres)
      setOffresIds(offresId)
      setNumber(-1)
      console.log(index)
    }
  }

  const deleteOffre = (offres: Offre[], offresId: string[], number: number) => {
    setOffres(offres.filter((offer, index) => index !== number))
    setOffresIds(offresId.filter((offer, index) => index !== number))
    setOffre('')
    setOffreError('')
    setMontant('')
    setMontantError('')
    setNumber(-1)
  }

  const handleSaveProducts = async () => {
    try {
      const nameEmpty = nameSectionValidator(serviceName, t)
      const descriptionEmpty = descriptionValidator(serviceDescription, t)
      const categoryEmpty = categoryValidator(serviceCategory, t)
      const imageEmpty = imageValidator(serviceImage, t)
      const conditionEmpty = conditionValidator(serviceConditions, t)
      let offreEmpty = ''
      if (offres.length === 0) {
        offreEmpty = imageValidator(offre, t)
      }
      if (nameEmpty || descriptionEmpty || categoryEmpty || imageEmpty || conditionEmpty || offreEmpty) {
        setNameError(nameEmpty)
        setDescriptionError(descriptionEmpty)
        setCategoryError(categoryEmpty)
        setImageError(imageEmpty)
        setOffreError(offreEmpty)
        setConditionsError(conditionEmpty)
      } else {
        let filename = serviceImage.split('/').pop()
        if (serviceImage1 != '') {
          filename = serviceImage1.split('/').pop()
          console.log(serviceImage1)
          const task = storage().ref(filename).putFile(serviceImage1)
          try {
            await task
          } catch (e) {
            console.error(e)
          }
        }

        firestore()
          .collection('services')
          .doc(item.id)
          .update({
            id: item.id,
            name: serviceName,
            description: serviceDescription,
            images: filename,
            userId: currentUser?.uid,
            offres: offres,
            offresIds: offresIds,
            category: serviceCategory,
            conditions: serviceConditions,
          })
          .then(() => {
            console.log('Service update!')
            navigation.navigate('Ventes' as never)
          })
      }
    } catch (e: unknown) {}
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <Header>{t('AddService.title')}</Header>
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
          <NameProduct productName={serviceName} setProductName={handleNameChange} />
          {nameError && <Text style={defaultStyles.error}>{t('Global.NameErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <DescriptionProduct
            maxLength={200}
            productDescription={serviceDescription}
            setProductDescription={handleDescriptionChange}
          />
          {descriptionError && <Text style={defaultStyles.error}>{t('Global.DescriptionErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <ConditionsService
            maxLength={200}
            serviceCondition={serviceConditions}
            setServiceCondition={handleConditionsChange}
          />
          {conditionsError && <Text style={defaultStyles.error}>{t('Global.ConditionsErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Offre')}</Text>
          <View style={defaultStyles.row}>
            <View style={{alignSelf: 'flex-start', marginRight: 15}}>
              <OffreService offreService={offre} setOffreService={handleOffreChange} />
              {offreError && <Text style={defaultStyles.error}>{t('Global.OffreErrorEmpty')}</Text>}
              <PrixUnitaireProduct productPrixUnitaire={montant} setProductPrixUnitaire={handleMontanthange} />
              {montantError && <Text style={defaultStyles.error}>{t('Global.PrixUnitaireErrorEmpty')}</Text>}
            </View>
            <View style={[{alignSelf: 'flex-end', marginVertical: 15}]}>
              <Button mode="contained" onPress={() => addOffre(offres, offresIds, number)}>
                {t('Global.Modify')}
              </Button>
              <Button mode="contained" onPress={() => deleteOffre(offres, offresIds, number)}>
                {t('Global.Delete')}
              </Button>
            </View>
            <View style={[{alignSelf: 'flex-end', marginVertical: 75}]}></View>
          </View>
        </View>
        <View style={defaultStyles.section}>
          {offres.map((offer: Offre, index: number) => {
            return (
              <View key={index}>
                <TouchableOpacity key={index} onPress={() => editOffre(offres, index)}>
                  <View style={[defaultStyles.itemContainerForm, {marginVertical: 5}]}>
                    <Text style={{textAlign: 'center', marginVertical: 15}}>
                      {offer.name} : {offer.montant} {offer.devise}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
        <View style={defaultStyles.section}>
          <ImageProduct productImage={serviceImage1} setProductImage={handleImageChange} imageUrl={imageUrl} />
        </View>
        {imageError && <Text style={defaultStyles.error}>{t('Global.ImageErrorEmpty')}</Text>}
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
