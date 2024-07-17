import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DefaultComponentsThemes from '../defaultComponentsThemes';
import {BacktoHome} from '../components/BacktoHome';
import Header from '../components/Header';
import {v4 as uuidv4} from 'uuid';
import {Formula, ScheduleState, TypeOffre} from '../contexts/types';
import {NameProduct} from '../components/NameProduct';
import {DescriptionProduct} from '../components/DescriptionProduct';
import {useTranslation} from 'react-i18next';
import Button from '../components/Button';
import {OffreService} from '../components/OffreService';
import {CategoryService} from '../components/CategoryService';
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  categoryValidator,
  conditionValidator,
  descriptionValidator,
  imagesValidator,
  nameSectionValidator,
  offreValidator,
  prixUnitaireValidator,
  provinceValidator,
  regionValidator,
  typePrixValidator,
  zoneValidator,
} from '../core/utils';
import {useStore} from '../contexts/store';
import {ZoneService} from '../components/ZoneService';
import {SelectList} from 'react-native-dropdown-select-list';
import {theme} from '../core/theme';
import {useTheme} from '../contexts/theme';
import countryGeonameIds from '../services/countryGeonameIds.json';
import axios from 'axios';
import WeekSchedule from '../components/WeekSchedule';
import MultiImagePicker from '../components/MultiImagePicker';
import {getRecordById} from '../services/FirestoreServices';
import {Swipeable} from 'react-native-gesture-handler';
import Icon1 from 'react-native-vector-icons/FontAwesome';

export const AddService = () => {
  const currentUser = auth().currentUser;
  const {i18n, t} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [serviceName, setServiceName] = useState<string>('');
  const [nameError, setNameError] = useState('');
  const [state] = useStore();
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [offreService, setOffreService] = useState<string[]>([]);
  const [offreError, setOffreError] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('');
  const [categoryError, setCategoryError] = useState('');
  const [montant, setMontant] = useState<string>('');
  const [montantError, setMontantError] = useState('');
  const devise = state.currency.toString();
  const [serviceConditions, setServiceConditions] =
    useState<ScheduleState | null>(null);
    const [conditionsError, setConditionsError] = useState<string>('');
  const [boutonActif, setBoutonActif] = useState(false);
  const [zoneService, setZoneService] = useState<string[]>([]);
  const [zoneError, setZoneError] = useState('');
  const {ColorPallet} = useTheme();
  const [provinces, setProvinces] = useState<{key: string; value: string}[]>(
    [],
  );
  const [province, setProvince] = useState<string>('');
  const [provinceError, setProvinceError] = useState<string>('');
  const [regions, setRegions] = useState<{key: string; value: string}[]>([]);
  const [region, setRegion] = useState<string>('');
  const [regionError, setRegionError] = useState<string>('');
  const countryCode = state.country.toString();
  const selectedLanguageCode = i18n.language;
  const [typePrix, setTypePrix] = useState<string>('');
  const [typePrixError, setTypePrixError] = useState('');
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loadedOffers, setLoadedOffers] = useState<{[key: number]: string[]}>(
    {},
  );

  const typesPrix: any[] = [
    {
      key: '1',
      value: t('TypePrix.Unit'),
    },
    {
      key: '2',
      value: t('TypePrix.Person'),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const geonameId = (countryGeonameIds as Record<string, number>)[
        countryCode
      ];
      if (geonameId) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguageCode}`;
        console.log(apiUrl);
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          });
          if (result) {
            const provinceList = result.data.geonames.map((province: any) => ({
              key: province.geonameId,
              value: province.name,
            }));
            provinceList.sort((a: any, b: any) =>
              a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
            );
            setProvinces(provinceList);
          }
        } catch (e) {
          console.log('Error ' + e);
        }
      }
    };
    fetchData();
  }, [countryCode]);

  useEffect(() => {
    const fetchData = async () => {
      if (province) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${province}&username=amadagueye&lang=${selectedLanguageCode}`;
        console.log(apiUrl);
        try {
          const result = await axios.request({
            method: 'get',
            url: apiUrl,
          });
          if (result) {
            const regionList = result.data.geonames.map((region: any) => ({
              key: region.geonameId,
              value: region.name,
            }));
            regionList.sort((a: any, b: any) =>
              a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
            );
            setRegions(regionList);
          }
        } catch (e) {
          console.log('Error ' + e);
        }
      }
    };
    fetchData();
  }, [province]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of formulas) {
        if (!newLoadedOffers[formula.id]) {
          const tabOffer: string[] = [];
          for (const offer of formula.offers) {
            const typeOffre = (await getRecordById(
              'type_offres',
              offer,
            )) as TypeOffre;
            tabOffer.push(typeOffre.nameFr);
          }
          newLoadedOffers[formula.id] = tabOffer;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };

    loadOffers();
  }, [formulas]);

  const handleNameChange = (value: string) => {
    setNameError('');
    setServiceName(value);
  };
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('');
    setServiceDescription(value);
  };

  const handleOffreChange = (value: string[]) => {
    setOffreError('');
    setOffreService(value);
    console.log('handleOffreChange called with:', value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryError('');
    setServiceCategory(value);
  };

  const handleMontanthange = (value: string) => {
    setMontantError('');
    setMontant(value);
  };

  const handleConditionsChange = (value: ScheduleState) => {
    setConditionsError('');
    setServiceConditions(value);
  };

  const handleTypePrixChange = (value: string) => {
    setTypePrixError('');
    setTypePrix(value);
  };

  const handleZoneChange = (value: string[]) => {
    setZoneError('');
    setZoneService(value);
  };

  const handleServicesImageschange = (value: string[]) => {
    setImageError('');
    setServiceImages(value);
  };

  const handleProvinceChange = (value: string) => {
    setProvinceError('');
    setProvince(value);
  };

  const handleRegionChange = (value: string) => {
    setRegionError('');
    setRegion(value);
  };

  const handleSubmit = () => {
    const newFormula = {
      id: formulas.length + 1,
      offers: offreService,
      priceType: typePrix,
      amount: montant,
    };
    setFormulas([...formulas, newFormula]);
    setOffreService([]);
    setTypePrix('');
    setMontant('');
  };

  const handleSaveProducts = async () => {
    setBoutonActif(true);
    try {
      const nameEmpty = nameSectionValidator(serviceName, t);
      const zoneEmpty = zoneValidator(zoneService, t);
      const descriptionEmpty = descriptionValidator(serviceDescription, t);
      const categoryEmpty = categoryValidator(serviceCategory, t);
      const imageEmpty = imagesValidator(serviceImages, t);
      const conditionEmpty = conditionValidator(serviceConditions, t);
      const provinceEmpty = provinceValidator(province, t);
      const regionEmpty = regionValidator(region, t);
      let offreEmpty = '';
      let typePrixEmpty = '';
      let montantEmpty = '';
      if (formulas.length === 0) {
        offreEmpty = offreValidator(offreService, t);
        typePrixEmpty = typePrixValidator(typePrix, t);
        montantEmpty = prixUnitaireValidator(montant, t);
      }
      if (
        nameEmpty ||
        descriptionEmpty ||
        categoryEmpty ||
        offreEmpty ||
        montantEmpty ||
        conditionEmpty ||
        zoneEmpty ||
        provinceEmpty ||
        regionEmpty ||
        typePrixEmpty ||
        imageEmpty
      ) {
        setNameError(nameEmpty);
        setDescriptionError(descriptionEmpty);
        setCategoryError(categoryEmpty);
        setOffreError(offreEmpty);
        setImageError(imageEmpty);
        setMontantError(montantEmpty);
        setConditionsError(conditionEmpty);
        setZoneError(zoneEmpty);
        setProvinceError(provinceEmpty);
        setRegionError(regionEmpty);
        setTypePrixError(typePrixEmpty);
        setBoutonActif(false);
      } else {
        const uid = uuidv4();
        let imagesServices: string[] = [];
        serviceImages.map(async imageServ => {
          const filename = imageServ.split('/').pop();
          imagesServices.push(filename == undefined ? '' : filename);
          const task = storage().ref(filename).putFile(imageServ);
          try {
            await task;
          } catch (e) {
            console.error(e);
            setBoutonActif(false);
          }
        });
        firestore()
          .collection('services')
          .doc(uid)
          .set({
            id: uid,
            name: serviceName,
            description: serviceDescription,
            images: imagesServices,
            userId: currentUser?.uid,
            formules: formulas,
            zone: zoneService,
            category: serviceCategory,
            conditions: serviceConditions,
            province: province,
            region: region,
          })
          .then(() => {
            console.log('Service added!');
            setBoutonActif(false);
            navigation.navigate('Ventes' as never);
          });
      }
    } catch (e: unknown) {
      setBoutonActif(false);
    }
  };

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
    formulaItem: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    formulaText: {
      fontSize: 16,
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
  });

  const handleDelete = (id: number) => {
    const newFormulas = formulas.filter(formula => formula.id !== id);
    setFormulas(newFormulas);
  };

  const renderItem = ({item}: {item: Formula}) => {
    const tabOffer = loadedOffers[item.id] || [];
    return (
      <Swipeable
        renderRightActions={() => (
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={({pressed}) => [
              styles.deleteContainer,
              pressed && {opacity: 0.8},
            ]}>
            <Icon1 name="trash" size={30} color={ColorPallet.white} />
          </Pressable>
        )}>
        <View style={styles.formulaItem}>
          <Text style={styles.formulaText}>
            {t('AddService.Offre')}s: {tabOffer.join('+')}
          </Text>
          <Text style={styles.formulaText}>
            {t('AddService.TypePrix')}:{' '}
            {item.priceType === '1' ? t('TypePrix.Unit') : t('TypePrix.Person')}
          </Text>
          <Text style={styles.formulaText}>
            {t('AddProduct.PrixUnitaire')}: {item.amount} {devise}
          </Text>
        </View>
      </Swipeable>
    );
  };

  const data = [
    {key: 'header', component: <Header>{t('AddService.title')}</Header>},
    {
      key: 'category',
      component: (
        <View style={defaultStyles.section}>
          <CategoryService
            categoryService={serviceCategory}
            setCategoryService={handleCategoryChange}
          />
          {categoryError && (
            <Text style={defaultStyles.error}>
              {t('Global.CategoryErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'name',
      component: (
        <View style={defaultStyles.section}>
          <NameProduct
            productName={serviceName}
            setProductName={handleNameChange}
          />
          {nameError && (
            <Text style={defaultStyles.error}>
              {t('Global.NameSectionErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'description',
      component: (
        <View style={defaultStyles.section}>
          <DescriptionProduct
            maxLength={200}
            productDescription={serviceDescription}
            setProductDescription={handleDescriptionChange}
          />
          {descriptionError && (
            <Text style={defaultStyles.error}>
              {t('Global.DescriptionErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'zone',
      component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Zone')}</Text>
          <SelectList
            boxStyles={styles.container}
            setSelected={handleProvinceChange}
            data={provinces}
            search={true}
            save="key"
            placeholder={t('Dropdown.Province')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          {provinceError && (
            <Text style={defaultStyles.error}>
              {t('Global.ProvinceErrorEmpty')}
            </Text>
          )}
          <SelectList
            boxStyles={styles.container}
            setSelected={handleRegionChange}
            data={regions}
            search={true}
            save="key"
            placeholder={t('Dropdown.Region')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          {regionError && (
            <Text style={defaultStyles.error}>
              {t('Global.RegionErrorEmpty')}
            </Text>
          )}
          <ZoneService region={region} setZoneService={handleZoneChange} />
          {zoneError && (
            <Text style={defaultStyles.error}>
              {t('Global.ZoneErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'offre',
      component: (
        <View style={defaultStyles.section}>
          <Text style={{fontSize: 20, marginBottom: 10}}>
            {t('AddService.AddFormulas')}
          </Text>
          <View style={{marginVertical: 10}}>
            <Text>{t('AddService.Offre')}</Text>
          </View>
          <View>
            <OffreService setOffreService={handleOffreChange} />
            {offreError && (
              <Text style={defaultStyles.error}>
                {t('Global.OffreErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ),
    },
    {
      key: 'type_prix',
      component: (
        <View style={defaultStyles.section}>
          <SelectList
            boxStyles={styles.container}
            setSelected={handleTypePrixChange}
            data={typesPrix}
            search={true}
            save="key"
            placeholder={t('Dropdown.TypePrix')}
            dropdownTextStyles={{backgroundColor: theme.colors.surface}}
            inputStyles={{backgroundColor: theme.colors.surface}}
          />
          {typePrixError && (
            <Text style={defaultStyles.error}>
              {t('Global.TypePrixErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'prix_unitaire',
      component: (
        <View style={defaultStyles.section}>
          <PrixUnitaireProduct
            productPrixUnitaire={montant}
            setProductPrixUnitaire={handleMontanthange}
          />
          {montantError && (
            <Text style={defaultStyles.error}>
              {t('Global.PrixUnitaireErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'formule',
      component: (
        <View style={defaultStyles.section}>
          <Button mode="contained" onPress={handleSubmit}>
            {t('AddService.AddFormula')}
          </Button>
          <Text style={{fontSize: 20, marginTop: 20}}>
            {t('AddService.FormulasAdded')}:
          </Text>
          <FlatList
            data={formulas}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      ),
    },
    {
      key: 'conditions',
      component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Conditions')}</Text>
          <WeekSchedule onScheduleChange={handleConditionsChange} />
          {conditionsError && (
            <Text style={defaultStyles.error}>
              {t('Global.ConditionsErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
    {
      key: 'image',
      component: (
        <View style={defaultStyles.section}>
          <MultiImagePicker setServiceImages={handleServicesImageschange} />
          {imageError && (
            <Text style={defaultStyles.error}>
              {t('Global.ImageErrorEmpty')}
            </Text>
          )}
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <BacktoHome textRoute={t('Ventes.title')} />
      <FlatList
        data={data}
        renderItem={({item}) => <View>{item.component}</View>}
        keyExtractor={item => item.key}
        contentContainerStyle={defaultStyles.scrollViewContent}
      />
      <View style={defaultStyles.bottomButtonContainer}>
        <View style={defaultStyles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Ventes' as never)}
            style={defaultStyles.button}>
            {t('Global.Cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSaveProducts}
            style={defaultStyles.button}
            disabled={boutonActif}>
            {t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
