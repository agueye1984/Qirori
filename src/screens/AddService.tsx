import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
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
import {
  Formula,
  ManageEventsParamList,
  ScheduleState,
  TypeOffre,
  TypePrix,
  Vendeur,
} from '../contexts/types';
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
  formuleValidator,
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
import WeekSchedule from '../components/WeekSchedule';
import MultiImagePicker from '../components/MultiImagePicker';
import {
  addRecord,
  checkIfDocumentExists,
  getFilteredFieldsRecords,
  getRecordById,
} from '../services/FirestoreServices';
import {WeekendList} from '../components/WeekendList';
import {Image} from 'react-native-compressor';
import {fetchGeonameName} from '../services/ZonesServices';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const AddService = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddService'>>();
  const isEditing = route.params?.isEditing || false;
  const serviceToEdit = route.params?.item || null;
  const {i18n, t} = useTranslation();
  const daysOfWeek = WeekendList(t);
  const initialSchedule = daysOfWeek.reduce((acc, day) => {
    acc[day.id] = {
      startTime: '00:00',
      endTime: '00:00',
      capacity: '',
    };
    return acc;
  }, {} as ScheduleState);
  const currentUser = auth().currentUser;
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [serviceName, setServiceName] = useState<string>(
    serviceToEdit?.name || '',
  );
  const [nameError, setNameError] = useState('');
  const [state] = useStore();
  const [serviceDescription, setServiceDescription] = useState<string>(
    serviceToEdit?.description || '',
  );
  const [descriptionError, setDescriptionError] = useState('');
  const [imageError, setImageError] = useState('');
  const [offre, setOffre] = useState<string[]>([]);
  const [offreError, setOffreError] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>(
    serviceToEdit?.category || '',
  );
  const [categoryError, setCategoryError] = useState('');
  const [montant, setMontant] = useState<string>('');
  const [montantError, setMontantError] = useState('');
  const devise = state.currency.toString();
  const [serviceConditions, setServiceConditions] = useState<ScheduleState>(
    serviceToEdit?.conditions || initialSchedule,
  );
  const [conditionsError, setConditionsError] = useState<string>('');
  const [boutonActif, setBoutonActif] = useState(false);
  const [zoneService, setZoneService] = useState<string[]>(
    serviceToEdit?.zone || [],
  );
  const [zoneError, setZoneError] = useState('');
  const {ColorPallet} = useTheme();
  const [provinces, setProvinces] = useState<{key: string; value: string}[]>(
    [],
  );
  const [province, setProvince] = useState<string>(
    serviceToEdit?.province || '',
  );
  const [provinceError, setProvinceError] = useState<string>('');
  const [regions, setRegions] = useState<{key: string; value: string}[]>([]);
  const [region, setRegion] = useState<string>(serviceToEdit?.region || '');
  const [regionError, setRegionError] = useState<string>('');
  const selectedLanguageCode = i18n.language;
  const [typePrix, setTypePrix] = useState<string>('');
  const [typePrixError, setTypePrixError] = useState('');
  const [serviceImages, setServiceImages] = useState<string[]>(
    serviceToEdit?.images || [],
  );
  const [formulas, setFormulas] = useState<any[]>(
    serviceToEdit?.formules || [],
  );
  const [formulaIds, setFormulaIds] = useState<string[]>(
    serviceToEdit?.formulesId || [],
  );
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string}>({});
  const [typesPrix, setTypesPrix] = useState<any[]>([]);
  const [categorieVendeur, setCategorieVendeur] = useState<string[]>([]);
  const [provinceVendeur, setProvinceVendeur] = useState<string[]>([]);
  const [regionVendeur, setRegionVendeur] = useState<string[]>([]);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<any>({
    id: '',
    formuleId: '',
    amount: '',
  });
  const [formulasSelect, setFormulasSelect] = useState<any[]>([]);
  const [formuleError, setFormuleError] = useState<string>('');
  const [showNewFormule, setShowNewFormule] = useState<boolean>(false);
  const [formuleId, setFormuleId] = useState<string>('');

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const data = await getFilteredFieldsRecords('formules', {
          type: 'services',
          category: serviceCategory,
        });
        const newOffre: any[] = [];
        const offreAutres = {
          key: '-1',
          value: t('Dropdown.New'),
        };
        newOffre.push(offreAutres);
        for (const record of data) {
          const offre = {
            key: record.id,
            value: record.data.name,
          };
          newOffre.push(offre);
        }
        setFormulasSelect(newOffre);
      } catch (error) {
        console.error('Erreur lors du chargement des formules :', error);
      }
    };
    fetchFormulas();
  }, [serviceCategory]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of serviceToEdit?.images) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    if (serviceToEdit != undefined) {
      getImages();
    }
  }, [serviceToEdit?.images]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('vendeurs')
      .where('actif', '==', true)
      .where('userId', '==', currentUser?.uid)
      .onSnapshot(querySnapshot => {
        const cat: string[] = [];
        const prov: string[] = [];
        const reg: string[] = [];
        let zoness: string[] = [];
        if (querySnapshot.empty) {
          setCategorieVendeur(cat);
          setProvinceVendeur(prov);
          setRegionVendeur(reg);
          setZoneService(zoness);
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const vendeur = documentSnapshot.data() as Vendeur;
            cat.push(vendeur.category);
            prov.push(vendeur.province);
            reg.push(vendeur.region);
            zoness = [...new Set([...zoness, ...vendeur.zone])];
          });
          // console.log('Zoness ' + zoness);
          setCategorieVendeur(cat);
          setProvinceVendeur(prov);
          setRegionVendeur(reg);
          setZoneService(zoness);
        }
      });
    return () => unsubscribe();
  }, [currentUser?.uid]);
  // console.log("zoneService "+zoneService)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('type_prix')
      .where('actif', '==', true)
      .where('type', '==', '2')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setTypesPrix([]);
        } else {
          const newTypePrix: any[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const typePrixData = documentSnapshot.data() as TypePrix;
            typePrixData.id = documentSnapshot.id; // ajouter l'id du document
            //newTypePrix.push(typePrixData);
            const prixList = {
              key: typePrixData.id,
              value:
                selectedLanguageCode === 'fr'
                  ? typePrixData.nameFr
                  : typePrixData.nameEn,
            };
            if (selectedLanguageCode === 'fr' && typePrixData.nameFr !== '') {
              newTypePrix.push(prixList);
            }
            if (selectedLanguageCode === 'en' && typePrixData.nameEn !== '') {
              newTypePrix.push(prixList);
            }
          });
          setTypesPrix(newTypePrix);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const provs: any[] = [];
      if (provinceVendeur.length > 0) {
        if (provinceVendeur.length === 1) {
          setProvince(provinceVendeur[0]);
        }
        for (const provin of provinceVendeur) {
          const provinceList = await fetchGeonameName(
            provin,
            selectedLanguageCode,
          );
          // console.log("provinceList"+provinceList.key)
          provs.push(provinceList);
        }
        provs.sort((a: any, b: any) =>
          a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
        );
        //console.log("provs"+provs)
        setProvinces(provs);
      }
    };
    fetchData();
  }, [provinceVendeur, selectedLanguageCode]);
  useEffect(() => {
    const fetchData = async () => {
      const regs: any[] = [];
      if (regionVendeur.length === 1) {
        setRegion(regionVendeur[0]);
      }
      for (const reg of regionVendeur) {
        const regList = await fetchGeonameName(reg, selectedLanguageCode);
        regs.push(regList);
      }
      regs.sort((a: any, b: any) =>
        a.value.toLowerCase().localeCompare(b.value.toLowerCase()),
      );
      setRegions(regs);
    };
    fetchData();
  }, [regionVendeur, selectedLanguageCode]);

  useEffect(() => {
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of formulas) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          const typePrix = (await getRecordById(
            'type_prix',
            formula.priceType,
          )) as TypePrix;
          const namePrix =
            selectedLanguageCode === 'fr' ? typePrix.nameFr : typePrix.nameEn;
          newLoadedOffers[formula.formuleId] = formule?.name + '#' + namePrix;
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
    setOffre(value);
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

  const handleFormule = (value: string) => {
    if (value === '-1') {
      setShowNewFormule(true);
    } else {
      setShowNewFormule(false);
    }
    setFormuleId(value);
    setFormuleError('');
  };

  const handleSubmit = async () => {
    const montantEmpty = prixUnitaireValidator(montant, t);
    const formuleEmpty = formuleValidator(formuleId, t);
    const typePrixEmpty = typePrixValidator(typePrix, t);
    let offreEmpty = '';

    if (formuleId === '-1') {
      offreEmpty = offreValidator(offre, t);
    }

    if (montantEmpty || formuleEmpty || offreEmpty || typePrixEmpty) {
      setMontantError(montantEmpty);
      setFormuleError(formuleEmpty);
      setOffreError(offreEmpty);
      setTypePrixError(typePrixEmpty);
      return;
    }
    try {
      let uid = formuleId;
      if (formuleId === '-1') {
        uid = uuidv4();
        const tabOffer: string[] = [];
        for (const offer of offre) {
          const typeOffre = (await getRecordById(
            'type_offres',
            offer,
          )) as TypeOffre;
          tabOffer.push(
            selectedLanguageCode === 'fr' ? typeOffre.nameFr : typeOffre.nameEn,
          );
        }
        const name = tabOffer.join('+');
        // Vérification d'existence
        const formuleExists = await checkIfDocumentExists('formules', {
          name: name,
          category: serviceCategory,
        });

        if (formuleExists) {
          console.log(
            'Une formule avec ce nom et cette catégorie existe déjà.',
          );
          return; // Arrêter l'exécution
        }

        // Création et enregistrement de la nouvelle formule
        const newFormule = {
          id: uid,
          name: name,
          category: serviceCategory,
          type: 'services',
        };
        await addRecord('formules', newFormule, uid);
        const updatedFormulasSelect = [
          ...formulasSelect,
          {key: uid, value: newFormule.name},
        ];
        setFormulasSelect(updatedFormulasSelect);
        setShowNewFormule(false);
      }
      const idFormule = uuidv4();
      const newFormula = {
        id: idFormule,
        formuleId: uid,
        priceType: typePrix,
        amount: montant,
      };
      // const idFormule = newFormula.id;
      setFormulaIds(prev => [...prev, idFormule.toString()]);
      setFormulas(prev => [...prev, newFormula]);
      setOffre([]);
      setFormuleId('');
      setTypePrix('');
      setMontant('');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleUpdate = () => {
    const montantEmpty = prixUnitaireValidator(montant, t);
    const formuleEmpty = formuleValidator(formuleId, t);
    const typePrixEmpty = typePrixValidator(typePrix, t);
    if (montantEmpty || formuleEmpty || typePrixEmpty) {
      setMontantError(montantEmpty);
      setFormuleError(formuleEmpty);
      setTypePrixError(typePrixEmpty);
      return;
    }
    if (editingItem) {
      const updatedFormulas = formulas.map(formula =>
        formula.id === editingItem.id
          ? {
              ...formula,
              formuleId: formuleId,
              priceType: typePrix,
              amount: montant,
            }
          : formula,
      );
      setFormulas(updatedFormulas);
      setEditingItem({
        id: '',
        formuleId: '',
        priceType: '',
        amount: '',
      });
      setOffre([]); // Replace with actual item data
      setTypePrix(''); // Replace with actual item data
      setMontant(''); // Replace with actual item data
      setFormuleId('');
    }
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
      let formuleEmpty = '';
      if (formulas.length === 0) {
        formuleEmpty = formuleValidator(formuleId, t);
        if (formuleId === '-1') {
          offreEmpty = offreValidator(offre, t);
        }
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
        formuleEmpty ||
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
        setFormuleError(formuleEmpty);
        setBoutonActif(false);
        return;
      } else {
        let imagesServices: string[] = [];
        for (const image of serviceImages) {
          try {
            let existingImage = undefined;
            if (serviceToEdit != undefined) {
              existingImage = serviceToEdit?.images.find(img => img === image);
            }

            if (!existingImage) {
              // Compress the image
              const compressedImageUri = await Image.compress(image, {
                maxWidth: 500, // Specify the width you want, e.g., 100 or 200
                maxHeight: 500,
                quality: 0.7, // Adjust quality (1 = original quality, 0.7 reduces it by 30%)
              });

              const filename = compressedImageUri.split('/').pop() || '';
              // Upload the compressed image
              const task = storage().ref(filename).putFile(compressedImageUri);

              await task;
              imagesServices.push(filename);
              console.log(`Image ${filename} uploaded successfully`);
            } else {
              imagesServices.push(image);
            }
          } catch (e) {
            console.error('Erreur lors du téléchargement:', e);
            setBoutonActif(false);
          }
        }

        if (imagesServices.length === serviceImages.length) {
          const updatedService = {
            name: serviceName,
            description: serviceDescription,
            images: imagesServices,
            formules: formulas,
            zone: zoneService,
            category: serviceCategory,
            conditions: serviceConditions,
            province: province,
            region: region,
            devise: devise,
            formulesId: formulaIds,
          };
          if (isEditing && serviceToEdit?.id) {
            await firestore()
              .collection('services')
              .doc(serviceToEdit.id)
              .update(updatedService);
            setBoutonActif(false);
            console.log('Service updated!');
          } else {
            const uid = uuidv4();
            await firestore()
              .collection('services')
              .doc(uid)
              .set({
                id: uid,
                ...updatedService,
                userId: currentUser?.uid,
              });
            setBoutonActif(false);
            console.log('Service created!');
          }

          navigation.navigate('Ventes' as never);
        }
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
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    replaceButton: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
    },
    removeButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1, // S'assurer que l'icône est au-dessus de l'image
    },
    container1: {
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
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });

  const handleDelete = (id: string) => {
    const newFormulas = formulas.filter(formula => formula.id !== id);
    setFormulas(newFormulas);
    const idFormules = formulaIds.filter(item => item !== id);
    setFormulaIds(idFormules);
  };

  const handleEdit = (item: Formula) => {
    setEditingItem(item);
    setOffre(item.offers); // Replace with actual item data
    setTypePrix(item.priceType); // Replace with actual item data
    setMontant(item.amount); // Replace with actual item data
    setOffreError('');
    setMontantError('');
    setTypePrixError('');
  };

  const renderItem = ({item}: {item: any}) => {
    const offer = loadedOffers[item.formuleId] || '';
    const tabOffer = offer.split('#');
    return (
      <View style={styles.formulaItem}>
        <Text style={styles.formulaText}>
          {t('AddService.Offre')}s: {tabOffer[0]}
        </Text>
        <Text style={styles.formulaText}>
          {t('AddService.TypePrix')}: {tabOffer[1]}
        </Text>
        <Text style={styles.formulaText}>
          {t('AddProduct.PrixUnitaire')}: {item.amount} {devise}
        </Text>
        <View style={styles.imageWrapper}>
          {/* Bouton pour remplacer l'image */}
          <Pressable
            onPress={() => handleEdit(item)}
            style={styles.replaceButton}>
            <Icon name="edit" size={20} color="white" />
          </Pressable>
          {/* Bouton pour supprimer l'image */}
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={styles.removeButton}>
            <Icon name="delete" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };


  const data = [
    {
      key: 'header',
      component: (
        <Header>
          {isEditing ? t('AddService.Modify') : t('AddService.title')}
        </Header>
      ),
    },
    {
      key: 'category',
      component: (
        <View style={defaultStyles.section}>
          <CategoryService
            categoryService={serviceCategory}
            setCategoryService={handleCategoryChange}
            error={categoryError}
            categoryVendeur={categorieVendeur}
          />
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
            error={nameError}
          />
        </View>
      ),
    },
    {
      key: 'zone',
      component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Zone')}</Text>
          <View style={defaultStyles.sectionStyle}>
            <SelectList
              //key={province}
              // boxStyles={styles.container}
              boxStyles={StyleSheet.flatten([
                styles.container,
                provinceError ? styles.inputError : null, // Ajoute la bordure rouge si `formuleError` est défini
              ])}
              setSelected={handleProvinceChange}
              data={provinces}
              search={true}
              save="key"
              placeholder={t('Dropdown.Province')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={{backgroundColor: theme.colors.surface}}
              defaultOption={
                province
                  ? provinces.find(typ => typ.key === province)
                  : undefined
              }
            />
            {provinceError && (
              <Text style={defaultStyles.error}>
                {t('Global.ProvinceErrorEmpty')}
              </Text>
            )}
          </View>
          <View style={defaultStyles.sectionStyle}>
            <SelectList
              key={region}
              boxStyles={StyleSheet.flatten([
                styles.container,
                regionError ? styles.inputError : null, // Ajoute la bordure rouge si `formuleError` est défini
              ])}
              setSelected={handleRegionChange}
              data={regions}
              search={true}
              save="key"
              placeholder={t('Dropdown.Region')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={{backgroundColor: theme.colors.surface}}
              defaultOption={
                region ? regions.find(typ => typ.key === region) : undefined
              }
            />
            {regionError && (
              <Text style={defaultStyles.error}>
                {t('Global.RegionErrorEmpty')}
              </Text>
            )}
          </View>
          <View style={defaultStyles.sectionStyle}>
            <ZoneService
              region={region}
              setZoneService={handleZoneChange}
              defaultSelectedZones={zoneService}
              error={zoneError}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'formules_select',
      component: (
        <View style={defaultStyles.section}>
          <Text style={{fontSize: 20, marginBottom: 10}}>
            {t('AddService.AddFormulas')}
          </Text>
          <View style={defaultStyles.sectionStyle}>
            <SelectList
              key={formuleId}
              boxStyles={StyleSheet.flatten([
                styles.container1,
                formuleError ? styles.inputError : null, // Ajoute la bordure rouge si `formuleError` est défini
              ])}
              setSelected={handleFormule}
              data={formulasSelect}
              search={true}
              save="key"
              placeholder={t('Dropdown.Formula')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={{backgroundColor: theme.colors.surface}}
              defaultOption={
                formuleId
                  ? formulasSelect.find(form => form.key === formuleId)
                  : undefined
              }
            />
          </View>
          {formuleError && (
            <Text style={defaultStyles.error}>{formuleError}</Text>
          )}
        </View>
      ),
    },
    {
      key: 'offre',
      component: showNewFormule ? (
        <View style={defaultStyles.section}>
          <View style={{marginVertical: 10}}>
            <Text>{t('AddService.Offre')}</Text>
          </View>
          <View style={defaultStyles.sectionStyle}>
            <OffreService
              setOffre={handleOffreChange}
              category={serviceCategory}
              defaultSelectedOffres={offre}
            />
            {offreError && (
              <Text style={defaultStyles.error}>
                {t('Global.OffreErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ) : null,
    },
    {
      key: 'type_prix',
      component: (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <SelectList
              key={typePrix}
              boxStyles={StyleSheet.flatten([
                styles.container,
                typePrixError ? styles.inputError : null, // Ajoute la bordure rouge si `formuleError` est défini
              ])}
              setSelected={handleTypePrixChange}
              data={typesPrix}
              search={true}
              save="key"
              placeholder={t('Dropdown.TypePrix')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={{backgroundColor: theme.colors.surface}}
              defaultOption={
                typePrix ? typesPrix.find(typ => typ.key === typePrix) : null
              }
            />
            {typePrixError && (
              <Text style={defaultStyles.error}>
                {t('Global.TypePrixErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ),
    },
    {
      key: 'prix_unitaire',
      component: (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <PrixUnitaireProduct
              productPrixUnitaire={montant}
              setProductPrixUnitaire={handleMontanthange}
              error={montantError}
            />
            {montantError && (
              <Text style={defaultStyles.error}>
                {t('Global.PrixUnitaireErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ),
    },
    {
      key: 'formule',
      component: (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <Button
              mode="contained"
              onPress={editingItem.id === '' ? handleSubmit : handleUpdate}>
              {editingItem.id === ''
                ? t('AddService.AddFormula')
                : t('AddService.EditFormula')}
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
        </View>
      ),
    },
    {
      key: 'description',
      component: (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <DescriptionProduct
              maxLength={200}
              productDescription={serviceDescription}
              setProductDescription={handleDescriptionChange}
              error={descriptionError}
            />
            {descriptionError && (
              <Text style={defaultStyles.error}>
                {t('Global.DescriptionErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ),
    },
    {
      key: 'conditions',
      component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Conditions')}</Text>
          <View style={defaultStyles.sectionStyle}>
            <WeekSchedule
              initialSchedule={serviceConditions}
              onScheduleChange={handleConditionsChange}
            />
            {conditionsError && (
              <Text style={defaultStyles.error}>
                {t('Global.ConditionsErrorEmpty')}
              </Text>
            )}
          </View>
        </View>
      ),
    },
    {
      key: 'image',
      component: (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <MultiImagePicker
              servicesImages={imagesUrl}
              setServiceImages={handleServicesImageschange}
            />
            {imageError && (
              <Text style={defaultStyles.error}>
                {t('Global.ImageErrorEmpty')}
              </Text>
            )}
          </View>
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
            {isEditing ? t('Global.Modify') : t('Global.Create')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
