import {useNavigation} from '@react-navigation/native'
import React, {useEffect, useState} from 'react'
import {FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import DefaultComponentsThemes from '../defaultComponentsThemes'
import {BacktoHome} from '../components/BacktoHome'
import Header from '../components/Header'
import {v4 as uuidv4} from 'uuid'
import {Offre} from '../contexts/types'
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
  zoneValidator,
} from '../core/utils'
import {useStore} from '../contexts/store'
import {ConditionsService} from '../components/ConditionsService'
import {ZoneService} from '../components/ZoneService'
import Icon from 'react-native-vector-icons/AntDesign'
import {SelectList} from 'react-native-dropdown-select-list'
import {theme} from '../core/theme'
import {useTheme} from '../contexts/theme'
import countryGeonameIds from '../services/countryGeonameIds.json'
import axios from 'axios'
import TextInput from '../components/TextInput'
import { QuantiteProduct } from '../components/QuantiteProduct'
import WeekSchedule from '../components/WeekSchedule'

export const AddService = () => {
  const currentUser = auth().currentUser
  let initOffre: Offre[] = []
  const {i18n, t} = useTranslation()
  const defaultStyles = DefaultComponentsThemes()
  const navigation = useNavigation()
  const [serviceName, setServiceName] = useState<string>('')
  const [nameError, setNameError] = useState('')
  const [state] = useStore()
  const [serviceDescription, setServiceDescription] = useState<string>('')
  const [descriptionError, setDescriptionError] = useState('')
  const [serviceImage, setServiceImage] = useState<string>('')
  const [imageError, setImageError] = useState('')
  const [offres, setOffres] = useState(initOffre)
  const [offreService, setOffreService] = useState<string[]>([])
  const [offreError, setOffreError] = useState('')
  const [serviceCategory, setServiceCategory] = useState<string>('')
  const [categoryError, setCategoryError] = useState('')
  const [montant, setMontant] = useState<string>('')
  const [montantError, setMontantError] = useState('')
  const devise = state.currency.toString()
  const [offresIds, setOffresIds] = useState<string[]>([])
  const [serviceConditions, setServiceConditions] = useState<string>('')
  const [conditionsError, setConditionsError] = useState('')
  const [boutonActif, setBoutonActif] = useState(false)
  const [zoneService, setZoneService] = useState<string[]>([])
  const [zoneError, setZoneError] = useState('')
  const [zones, setZones] = useState<string[]>([])
  const [zonesIds, setZonesIds] = useState<string[]>([])
  const [showCustomRegionInput, setShowCustomRegionInput] = useState<boolean>(false)
  const [customOffre, setCustomOffre] = useState<string>('')
  const {ColorPallet} = useTheme()
  const [provinces, setProvinces] = useState<{key: string; value: string}[]>([])
  const [province, setProvince] = useState<string>('')
  const [regions, setRegions] = useState<{key: string; value: string}[]>([])
  const [region, setRegion] = useState<string>('')
  const countryCode = state.country.toString()
  const selectedLanguageCode = i18n.language
  const [typePrix, setTypePrix] = useState<string>('')
  const [typePrixError, setTypePrixError] = useState('')
  const [capacite, setCapacite] = useState<string>('')
  const [capaciteError, setCapaciteError] = useState('')


  const typesPrix: any[] = [
    {
      key: '1',
      value: t('TypePrix.Unit'),
    },
    {
      key: '2',
      value: t('TypePrix.Person'),
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const geonameId = (countryGeonameIds as Record<string, number>)[countryCode]
      if (geonameId) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguageCode}`
        console.log(apiUrl)
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          })
          if (result) {
            // console.log(result)
            const provinceList = result.data.geonames.map((province: any) => ({
              key: province.geonameId,
              value: province.name,
            }))
            provinceList.sort((a: any, b: any) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()))
            setProvinces(provinceList)
          }
        } catch (e) {
          console.log('Error ' + e)
        }
      }
    }
    fetchData()
  }, [countryCode])

  useEffect(() => {
    const fetchData = async () => {
      if (province) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${province}&username=amadagueye&lang=${selectedLanguageCode}`
        console.log(apiUrl)
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          })
          if (result) {
            // console.log(result)
            const regionList = result.data.geonames.map((region: any) => ({
              key: region.geonameId,
              value: region.name,
            }))
            regionList.sort((a: any, b: any) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()))
            setRegions(regionList)
          }
        } catch (e) {
          console.log('Error ' + e)
        }
      }
    }
    fetchData()
  }, [province])

  const handleNameChange = (value: string) => {
    setNameError('')
    setServiceName(value)
  }
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('')
    setServiceDescription(value)
  }

  const handleCapaciteChange = (value: string) => {
    setCapaciteError('')
    setCapacite(value)
  }

  const handleImageChange = (value: string) => {
    setImageError('')
    setServiceImage(value)
  }

 /*  const handleOffreChange = (value: string[]) => {
    setOffreError('')
    console.log('handleOffreService values:', JSON.stringify(value))

    if (Array.isArray(value)) {
      if (value.includes('-1')) {
        setShowCustomRegionInput(true)
      } else {
        setShowCustomRegionInput(false)
      }
      setOffreService(value)
    } else {
      console.warn('Expected array but got:', value)
    }
  } */

  const handleOffreChange = (value: string[]) => {
    setOffreError('');
    setOffreService(value);
    console.log('handleOffreChange called with:', value);
  };

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

  const handleTypePrixChange = (value: string) => {
    setTypePrixError('')
    setTypePrix(value)
  }

  const handleZoneChange = (value: string[]) => {
    setZoneError('')
    setZoneService(value)
  }

  console.log(offreService)

  /* const deleteOffre = (offres: Offre[], offresId: string[], number: number) => {
    setOffres(offres.filter((offer, index) => index !== number))
    setOffresIds(offresId.filter((offer, index) => index !== number))
  }

  const addOffre = (offres: Offre[], offresId: string[]) => {
    const offreEmpty = offreValidator(offre, t)
    const montantEmpty = prixUnitaireValidator(montant, t)
    if (offreEmpty || montantEmpty) {
      setOffreError(offreEmpty)
      setMontantError(montantEmpty)
    } else {
      const id = uuidv4()
      const offer = {
        id: id,
        name: offre,
        montant: parseInt(montant),
        devise: devise,
        typeOffre: '',
        typeMontant:'',
        images:'',
      }
      offres.push(offer)
      offresId.push(id)
      setOffre('')
      setOffreError('')
      setMontant('')
      setMontantError('')
      setOffres(offres)
      setOffresIds(offresId)
    }
  } */

  const handleSaveProducts = async () => {
    setBoutonActif(true)
    try {
      const nameEmpty = nameSectionValidator(serviceName, t)
      const descriptionEmpty = descriptionValidator(serviceDescription, t)
      const categoryEmpty = categoryValidator(serviceCategory, t)
      const imageEmpty = imageValidator(serviceImage, t)
      const conditionEmpty = conditionValidator(serviceConditions, t)
      let offreEmpty = ''
      let montantEmpty = ''
      /*  if (offres.length === 0) {
        offreEmpty = offreValidator(offre, t)
        montantEmpty = prixUnitaireValidator(montant, t)
      } */
      if (
        nameEmpty ||
        descriptionEmpty ||
        categoryEmpty ||
        offreEmpty ||
        montantEmpty ||
        conditionEmpty ||
        imageEmpty
      ) {
        setNameError(nameEmpty)
        setDescriptionError(descriptionEmpty)
        setCategoryError(categoryEmpty)
        setOffreError(offreEmpty)
        setImageError(imageEmpty)
        setMontantError(montantEmpty)
        setConditionsError(conditionEmpty)
        setBoutonActif(false)
      } else {
        const uid = uuidv4()
        const filename = serviceImage.split('/').pop()
        const task = storage().ref(filename).putFile(serviceImage)
        try {
          await task
        } catch (e) {
          console.error(e)
          setBoutonActif(false)
        }
        firestore()
          .collection('services')
          .doc(uid)
          .set({
            id: uid,
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
            console.log('Service added!')
            setBoutonActif(false)
            navigation.navigate('Ventes' as never)
          })
      }
    } catch (e: unknown) {
      setBoutonActif(false)
    }
  }

  const styles = StyleSheet.create({
    container: {
      minHeight: 50,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    buttonStyle: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
    },
    text: {
      textAlign: 'left',
    },
    dropdownStyle: {
      borderColor: ColorPallet.lightGray,
      borderBottomWidth: 2,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid',
      borderBottomLeftRadius: 4,
      maring: '0',
      borderBottomRightRadius: 4,
    },
    input: {
      width: 70,
      backgroundColor: theme.colors.surface,
    },
    selectedContainer: {
      marginTop: 20,
    },
    selectedLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    selectedItem: {
      fontSize: 14,
      marginTop: 5,
    },
  })

  const data = [
    { key: 'header', component: <Header>{t('AddService.title')}</Header> },
    { key: 'category', component: (
        <View style={defaultStyles.section}>
          <CategoryService categoryService={serviceCategory} setCategoryService={handleCategoryChange} />
          {categoryError && <Text style={defaultStyles.error}>{t('Global.CategoryErrorEmpty')}</Text>}
        </View>
      )
    },
    { key: 'zone', component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Zone')}</Text>
          <SelectList
            boxStyles={styles.container}
            setSelected={(val: string) => setProvince(val)}
            data={provinces}
            search={true}
            save="key"
            placeholder={t('Dropdown.Province')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          <SelectList
            boxStyles={styles.container}
            setSelected={(val: string) => setRegion(val)}
            data={regions}
            search={true}
            save="key"
            placeholder={t('Dropdown.Region')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          <ZoneService region={region} setZoneService={handleZoneChange} />
          {zoneError && <Text style={defaultStyles.error}>{t('Global.ZoneErrorEmpty')}</Text>}
        </View>
      )
    },
    { key: 'offre', component: (
        <View style={defaultStyles.section}>
          <View style={{marginVertical:10}}>
          <Text>{t('AddService.Offre')}</Text>
          </View>
          <View>
          <OffreService setOffreService={handleOffreChange} />
          {offreError && <Text style={defaultStyles.error}>{t('Global.OffreErrorEmpty')}</Text>}
          </View>
        </View>
      )
    },
    { key: 'type_prix', component: (
      <View style={defaultStyles.section}>
           <SelectList
            boxStyles={styles.container}
            setSelected={(val: string) => setTypePrix(val)}
            data={typesPrix}
            search={true}
            save="key"
            placeholder={t('Dropdown.TypePrix')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
        {typePrixError && <Text style={defaultStyles.error}>{t('Global.OffreErrorEmpty')}</Text>}
      </View>
    )
  },
  { key: 'prix_unitaire', component: (
    <View style={defaultStyles.section}>
          <PrixUnitaireProduct productPrixUnitaire={montant} setProductPrixUnitaire={handleMontanthange} />
            {montantError && <Text style={defaultStyles.error}>{t('Global.PrixUnitaireErrorEmpty')}</Text>}
    </View>
  )
},
{ key: 'capacite', component: (
  <View style={defaultStyles.section}>
    <Text>{t('AddService.Conditions')}</Text>
    <WeekSchedule />
    {offreError && <Text style={defaultStyles.error}>{t('Global.OffreErrorEmpty')}</Text>}
  </View>
)
},
    { key: 'image', component: (
        <View style={defaultStyles.section}>
          <ImageProduct productImage={serviceImage} setProductImage={handleImageChange} />
        </View>
      )
    },
  /*   { key: 'bottomButtons', component: (
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
      )
    } */
  ];

  return (
   /*  <SafeAreaView style={{flex: 1}}>
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
          <Text>{t('AddService.Zone')}</Text>
          <SelectList
            boxStyles={styles.container}
            setSelected={(val: string) => setProvince(val)}
            data={provinces}
            search={true}
            save="key"
            placeholder={t('Dropdown.Province')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          <SelectList
            boxStyles={styles.container}
            setSelected={(val: string) => setRegion(val)}
            data={regions}
            search={true}
            save="key"
            placeholder={t('Dropdown.Region')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          <ZoneService region={region} setZoneService={handleZoneChange} />
          {zoneError && <Text style={defaultStyles.error}>{t('Global.ZoneErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Offre')}</Text>
          <OffreService setOffreService={handleOffreChange} />
          {offreError && <Text style={defaultStyles.error}>{t('Global.OffreErrorEmpty')}</Text>}
        </View>
        <View style={defaultStyles.section}>
          <ImageProduct productImage={serviceImage} setProductImage={handleImageChange} />
        </View>
        {imageError && <Text style={defaultStyles.error}>{t('Global.ImageErrorEmpty')}</Text>}
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
    </SafeAreaView> */
    <SafeAreaView style={{ flex: 1 }}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <FlatList
        data={data}
        renderItem={({ item }) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={defaultStyles.scrollViewContent}
      />
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
