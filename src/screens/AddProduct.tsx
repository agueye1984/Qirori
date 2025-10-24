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
import {NameProduct} from '../components/NameProduct';
import {DescriptionProduct} from '../components/DescriptionProduct';
import {QuantiteProduct} from '../components/QuantiteProduct';
import {PrixUnitaireProduct} from '../components/PrixUnitaireProduct';
import {useTranslation} from 'react-i18next';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  categoryValidator,
  conditionsProductValidator,
  conditionsValidator,
  descriptionValidator,
  formuleValidator,
  imagesValidator,
  nameSectionValidator,
  offresValidator,
  prixUnitaireValidator,
  quantiteValidator,
  typePrixValidator,
} from '../core/utils';
import {useStore} from '../contexts/store';
import {CategoryService} from '../components/CategoryService';
import {
  Conditions,
  ManageEventsParamList,
  TypePrix,
  Vendeur,
} from '../contexts/types';
import MultiImagePicker from '../components/MultiImagePicker';
import {SelectList} from 'react-native-dropdown-select-list';
import {useTheme} from '../contexts/theme';
import {theme} from '../core/theme';
import {
  addRecord,
  checkIfDocumentExists,
  getFilteredFieldsRecords,
  getFilteredRecords,
  getRecordById,
} from '../services/FirestoreServices';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Image} from 'react-native-compressor';
import MultiSelect from 'react-native-multiple-select';
import {TextInput as PaperTextInput} from 'react-native-paper';

export const AddProduct = () => {
  const route = useRoute<RouteProp<ManageEventsParamList, 'AddProduct'>>();
  const isEditing = route.params?.isEditing || false;
  const productToEdit = route.params?.item || null;
  const currentUser = auth().currentUser;
  const {t, i18n} = useTranslation();
  const defaultStyles = DefaultComponentsThemes();
  const navigation = useNavigation();
  const [productName, setProductName] = useState<string>(
    productToEdit?.name || '',
  );
  const [nameError, setNameError] = useState('');
  const [productDescription, setProductDescription] = useState<string>(
    productToEdit?.description || '',
  );
  const [descriptionError, setDescriptionError] = useState('');
  const [state] = useStore();
  const [imageError, setImageError] = useState('');
  const [productQuantite, setProductQuantite] = useState<string>('');
  const [quantiteError, setQuantiteError] = useState('');
  const productDevise = state.currency.toString();
  const [serviceCategory, setServiceCategory] = useState<string>(
    productToEdit?.category || '',
  );
  const [categoryError, setCategoryError] = useState('');
  const [productError, setProductError] = useState('');
  const [boutonActif, setBoutonActif] = useState(false);
  const [offre, setOffre] = useState<string>('');
  const [offreError, setOffreError] = useState('');
  const [typePrix, setTypePrix] = useState<string>('');
  const [typePrixError, setTypePrixError] = useState('');
  const {ColorPallet} = useTheme();
  const [montant, setMontant] = useState<string>('');
  const [montantError, setMontantError] = useState('');
  const [serviceImages, setServiceImages] = useState<string[]>(
    productToEdit?.images || [],
  );
  const [formulas, setFormulas] = useState<any[]>(
    productToEdit?.formules || [],
  );
  const [formulaIds, setFormulaIds] = useState<string[]>(
    productToEdit?.formulesId || [],
  );
  const [conditionsError, setConditionsError] = useState<string>('');
  const [categorieVendeur, setCategorieVendeur] = useState<string[]>([]);
  const devise = state.currency.toString();
  const selectedLanguageCode = i18n.language;
  const [loadedOffers, setLoadedOffers] = useState<{[key: string]: string[]}>(
    {},
  );
  const [editingItem, setEditingItem] = useState<any>({
    id: '',
    formuleId: '',
    quantity: '',
    amount: '',
  });
  const [typesPrix, setTypesPrix] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [showCustomTypePrixInput, setShowCustomTypePrixInput] =
    useState<boolean>(false);
  const [showCustomCondInput, setShowCustomCondInput] =
    useState<boolean>(false);
  const [customTypePrix, setCustomTypePrix] = useState<string>('');
  const [customCondition, setCustomCondition] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(true);
  const [dropdownVisibleCond, setDropdownVisibleCond] = useState<boolean>(true);
  const [condition, setCondition] = useState<string[]>(
    productToEdit?.conditions || [],
  );
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);

  const [formulasSelect, setFormulasSelect] = useState<any[]>([]);
  const [formuleError, setFormuleError] = useState<string>('');
  const [showNewFormule, setShowNewFormule] = useState<boolean>(false);
  const [formuleId, setFormuleId] = useState<string>('');

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const data = await getFilteredFieldsRecords(
          'formules',
          {
            type: 'products',
            category: serviceCategory,
          }
        );
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
    const loadOffers = async () => {
      const newLoadedOffers = {...loadedOffers};
      for (const formula of formulas) {
        if (!newLoadedOffers[formula.formuleId]) {
          const formule = await getRecordById('formules', formula.formuleId);
          newLoadedOffers[formula.formuleId] = formule?.name;
        }
      }
      setLoadedOffers(newLoadedOffers);
    };

    loadOffers();
  }, [formulas]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('type_prix')
      .where('actif', '==', true)
      .where('type', '==', '1')
      .onSnapshot(querySnapshot => {
        const newTypePrix: any[] = [];
        const prixList = {
          key: '-1',
          value: t('Dropdown.Autre'),
        };
        newTypePrix.push(prixList);
        if (querySnapshot.empty) {
          setTypesPrix(newTypePrix);
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const typePrixData = documentSnapshot.data() as TypePrix;
            typePrixData.id = documentSnapshot.id; // ajouter l'id du document

            const newprixList = {
              key: typePrixData.id,
              value:
                selectedLanguageCode === 'fr'
                  ? typePrixData.nameFr
                  : typePrixData.nameEn,
            };
            if (selectedLanguageCode === 'fr' && typePrixData.nameFr !== '') {
              newTypePrix.push(newprixList);
            }
            if (selectedLanguageCode === 'en' && typePrixData.nameEn !== '') {
              newTypePrix.push(newprixList);
            }
          });
          setTypesPrix(newTypePrix);
        }
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('conditions')
      .where('actif', '==', true)
      .where('category', '==', serviceCategory)
      .onSnapshot(querySnapshot => {
        const newCond: any[] = [];
        const cond = {
          key: '-1',
          value: t('Dropdown.Autre'),
        };
        newCond.push(cond);

        if (querySnapshot.empty) {
          setConditions(newCond);
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const condData = documentSnapshot.data() as Conditions;
            condData.id = documentSnapshot.id; // ajouter l'id du document
            const newCondi = {
              key: condData.id,
              value:
                selectedLanguageCode === 'fr'
                  ? condData.nameFr
                  : condData.nameEn,
            };
            if (selectedLanguageCode === 'fr' && condData.nameFr !== '') {
              newCond.push(newCondi);
            }
            if (selectedLanguageCode === 'en' && condData.nameEn !== '') {
              newCond.push(newCondi);
            }
          });
          setConditions(newCond);
        }
      });
    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, [serviceCategory]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('vendeurs')
      .where('actif', '==', true)
      .where('userId', '==', currentUser?.uid)
      .onSnapshot(querySnapshot => {
        const cat: string[] = [];
        if (querySnapshot.empty) {
          setCategorieVendeur(cat);
        } else {
          querySnapshot.forEach(documentSnapshot => {
            const vendeur = documentSnapshot.data() as Vendeur;
            cat.push(...vendeur.category);
          });
          setCategorieVendeur(cat);
        }
      });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of productToEdit?.images) {
        const url = await storage().ref(imageServ).getDownloadURL();
        tabUrl.push(url);
      }
      setImagesUrl(tabUrl);
    };
    if (productToEdit != undefined) {
      getImages();
    }
  }, [productToEdit?.images]);

  const handleNameChange = (value: string) => {
    setNameError('');
    setProductName(value);
  };
  const handleDescriptionChange = (value: string) => {
    setDescriptionError('');
    setProductDescription(value);
  };

  const handleServicesImageschange = (value: string[]) => {
    setImageError('');
    setServiceImages(value);
  };

  const handleQuantiteChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '0');
    const val = parseInt(numericValue);
    setQuantiteError('');
    setProductQuantite(val.toString());
  };

  const handleCategoryChange = (value: string) => {
    setCategoryError('');
    setServiceCategory(value);
  };

  const handleOffreChange = (value: string) => {
    setOffreError('');
    setOffre(value);
  };

  const handleTypePrixChange = (value: string) => {
    if (value === '-1') {
      setShowCustomTypePrixInput(true);
      setDropdownVisible(false);
    } else {
      setShowCustomTypePrixInput(false);
      setDropdownVisible(true);
    }
    setTypePrixError('');
    setTypePrix(value);
  };

  const handleConditions = (values: string[]) => {
    if (Array.isArray(values)) {
      if (values.includes('-1')) {
        setShowCustomCondInput(true);
        setDropdownVisibleCond(false);
      } else {
        setShowCustomCondInput(false);
        setDropdownVisibleCond(true);
      }
      setCondition(values);
    } else {
      console.warn('Expected array but got:', values);
    }
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

  const handleAddCustomCond = async () => {
    try {
      const nameEmpty = conditionsValidator(customCondition, t);
      const categoryEmpty = categoryValidator(serviceCategory, t);
      if (nameEmpty || categoryEmpty) {
        setConditionsError(nameEmpty);
        setCategoryError(categoryEmpty);
      } else {
        const conditionExists = await checkIfDocumentExists('conditions', {
          [`name${selectedLanguageCode.toUpperCase()}`]: customCondition,
        });

        if (conditionExists) {
          console.log('Un condition avec ce nom existe déjà.');
          return; // Arrêtez si le type de prix existe déjà
        }
        // Add the new offer to Firestore
        const uid = uuidv4();
        const newCondData = {
          id: uid,
          nameFr: selectedLanguageCode === 'fr' ? customCondition : '',
          nameEn: selectedLanguageCode === 'en' ? customCondition : '',
          category: serviceCategory,
          actif: true,
        };
        await addRecord('conditions', newCondData, uid);
        const newCondId = uid; // Get the new document ID

        const newCond = {key: newCondId, value: customCondition};
        setConditions([...conditions, newCond]);

        // Deselect "Autre" and select the new offer
        const updatedConds = condition
          .filter(cond => cond !== '-1')
          .concat(newCondId);
        setCondition(updatedConds);

        setCustomCondition('');
        setShowCustomCondInput(false);
        setDropdownVisibleCond(true);
      }
    } catch (error) {
      console.error('Error adding custom region:', error);
    }
  };

  const handleMontanthange = (value: string) => {
    setMontantError('');
    setMontant(value);
  };

  const handleSubmit = async () => {
    // Validation des champs
    const montantEmpty = prixUnitaireValidator(montant, t);
    const quantiteEmpty = quantiteValidator(productQuantite, t);
    const formuleEmpty = formuleValidator(formuleId, t);
    let offreEmpty = '';
    let typePrixEmpty = '';

    if (formuleId === '-1') {
      offreEmpty = offresValidator(offre, t);
      typePrixEmpty = typePrixValidator(typePrix, t);
    }

    if (
      montantEmpty ||
      quantiteEmpty ||
      formuleEmpty ||
      offreEmpty ||
      typePrixEmpty
    ) {
      setMontantError(montantEmpty);
      setQuantiteError(quantiteEmpty);
      setFormuleError(formuleEmpty);
      setOffreError(offreEmpty);
      setTypePrixError(typePrixEmpty);
      return;
    }

    try {
      let uid = formuleId;

      // Vérification et ajout d'une nouvelle formule
      if (formuleId === '-1') {
        uid = uuidv4();

        // Récupérer le nom de typePrix
        const typPrix = (await getRecordById(
          'type_prix',
          typePrix,
        )) as TypePrix;
        const name =
          selectedLanguageCode === 'fr' ? typPrix.nameFr : typPrix.nameEn;

        // Vérification d'existence
        const formuleExists = await checkIfDocumentExists('formules', {
          name: name + ' : ' + offre,
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
          name: name + ' : ' + offre,
          category: serviceCategory,
          type: 'products',
        };
        await addRecord('formules', newFormule, uid);
        const updatedFormulasSelect = [
          ...formulasSelect,
          { key: uid, value: newFormule.name },
        ];
        setFormulasSelect(updatedFormulasSelect);
        setShowNewFormule(false)
      }

      // Ajout de la formule à l'état local
      const idFormule = uuidv4();
      const newFormula = {
        id: idFormule,
        formuleId: uid,
        quantity: productQuantite,
        amount: montant,
      };

      setFormulaIds(prev => [...prev, idFormule.toString()]);
      setFormulas(prev => [...prev, newFormula]);

      // **Mettez à jour `formulasSelect` ici**
   
      // Réinitialisation des champs
      setOffre('');
      setTypePrix('');
      setMontant('');
      setProductQuantite('');
      setFormuleId('');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleUpdate = async () => {
    if (editingItem) {
      const formuleEmpty = formuleValidator(formuleId, t);
      const montantEmpty = prixUnitaireValidator(montant, t);
      const quantiteEmpty = quantiteValidator(productQuantite, t);
      if (formuleEmpty || montantEmpty || quantiteEmpty) {
        setFormuleError(formuleEmpty);
        setMontantError(montantEmpty);
        setQuantiteError(quantiteEmpty);
        return;
      }
      const updatedFormulas = formulas.map(formula =>
        formula.id === editingItem.id
          ? {
              ...formula,
              formuleId: formuleId,
              quantity: productQuantite,
              amount: montant,
            }
          : formula,
      );
      setFormulas(updatedFormulas);
      setEditingItem({
        id: '',
        formuleId: '',
        quantity: '',
        amount: '',
      });
      setOffre('');
      setTypePrix('');
      setMontant('');
      setProductQuantite('');
      setFormuleId('');
    }
  };

  const handleSaveProducts = async () => {
    setBoutonActif(true);
    try {
      const categoryEmpty = categoryValidator(serviceCategory, t);
      const nameEmpty = nameSectionValidator(productName, t);
      const descriptionEmpty = descriptionValidator(productDescription, t);
      const imageEmpty = imagesValidator(serviceImages, t);
      const conditionEmpty = conditionsProductValidator(condition, t);
      let offreEmpty = '';
      let typePrixEmpty = '';
      let montantEmpty = '';
      let quantiteEmpty = '';
      let formuleEmpty = '';
      if (formulas.length === 0) {
        formuleEmpty = formuleValidator(formuleId, t);
        if (formuleId === '-1') {
          offreEmpty = offresValidator(offre, t);
          typePrixEmpty = typePrixValidator(typePrix, t);
        }
        montantEmpty = prixUnitaireValidator(montant, t);
        quantiteEmpty = quantiteValidator(productQuantite, t);
      }

      if (
        categoryEmpty ||
        nameEmpty ||
        descriptionEmpty ||
        imageEmpty ||
        conditionEmpty ||
        offreEmpty ||
        typePrixEmpty ||
        formuleEmpty ||
        montantEmpty ||
        quantiteEmpty
      ) {
        setCategoryError(categoryEmpty);
        setNameError(nameEmpty);
        setDescriptionError(descriptionEmpty);
        setConditionsError(conditionEmpty);
        setTypePrixError(typePrixEmpty);
        setOffreError(offreEmpty);
        setMontantError(montantEmpty);
        setQuantiteError(quantiteEmpty);
        setImageError(imageEmpty);
        setFormuleError(formuleEmpty);
        setBoutonActif(false);
        return;
      } else {
        let imagesServices: string[] = [];
        for (const image of serviceImages) {
          try {
            let existingImage = undefined;
            if (productToEdit != undefined) {
              existingImage = productToEdit?.images.find(img => img === image);
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
            return;
          }
        }
        if (imagesServices.length === serviceImages.length) {
          const updatedProduct = {
            category: serviceCategory,
            name: productName,
            description: productDescription,
            devise: productDevise,
            images: imagesServices,
            actif: true,
            conditions: condition,
            formules: formulas,
            zone: [''],
            formulesId: formulaIds,
          };
          if (isEditing && productToEdit?.id) {
            await firestore()
              .collection('products')
              .doc(productToEdit.id)
              .update(updatedProduct);
            console.log('Product updated!');
            setBoutonActif(false);
          } else {
            const data = await getFilteredRecords(
              'products',
              'name',
              productName,
            );
            if (data.length === 0) {
              const uid = uuidv4();
              await firestore()
                .collection('products')
                .doc(uid)
                .set({
                  id: uid,
                  ...updatedProduct,
                  userId: currentUser?.uid,
                });
              console.log('Product created!');
            } else {
              setBoutonActif(false);
              setProductError(t('AddProduct.ProductExistError'));
              return;
            }
          }
          setBoutonActif(false);
          navigation.navigate('Ventes' as never);
        }
      }
    } catch (e: unknown) {
      setBoutonActif(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    customRegionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginRight: 10,
      flex: 1,
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
    multiSelectContainer: {
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
    multiSelectMainWrapper: {
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 5,
    },
    multiSelectInputGroup: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    multiSelectText: {
      textAlign: 'center',
    },
    inputError: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });

  const handleAddCustomTypePrix = async () => {
    try {
      const typePrixExists = await checkIfDocumentExists('type_prix', {
        [`name${selectedLanguageCode.toUpperCase()}`]: customTypePrix,
      });

      if (typePrixExists) {
        console.log('Un type de prix avec ce nom existe déjà.');
        return; // Arrêtez si le type de prix existe déjà
      }
      // Add the new offer to Firestore
      const uid = uuidv4();
      const newTypePrixData = {
        id: uid,
        nameFr: selectedLanguageCode === 'fr' ? customTypePrix : '',
        nameEn: selectedLanguageCode === 'en' ? customTypePrix : '',
        type: '1',
        actif: true,
      };

      await addRecord('type_prix', newTypePrixData, uid);
      const newPrixId = uid; // Get the new document ID

      const newTypePrix = {key: newPrixId, value: customTypePrix};
      setTypesPrix([...typesPrix, newTypePrix]);
      setTypePrix(newPrixId);

      setCustomTypePrix('');
      setShowCustomTypePrixInput(false);
      setDropdownVisible(true);
    } catch (error) {
      console.error('Error adding custom region:', error);
    }
  };

  const handleDelete = (id: string) => {
    const newFormulas = formulas.filter(formula => formula.id !== id);
    setFormulas(newFormulas);
    const idFormules = formulaIds.filter(item => item !== id);
    setFormulaIds(idFormules);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormuleId(item.formuleId); 
    setMontant(item.amount); 
    setProductQuantite(item.quantity);
    setFormuleError('');
    setMontantError('');
    setQuantiteError('');
  };

  const renderItem = ({item}: {item: any}) => {
    const tabOffer = loadedOffers[item.formuleId] || [];

    //console.log(tabOffer)
    return (
      <View style={styles.formulaItem}>
        <Text style={styles.formulaText}>{tabOffer}</Text>
        <Text style={styles.formulaText}>
          {t('AddProduct.PrixUnitaire')}: {item.amount} {devise}
        </Text>
        <Text style={styles.formulaText}>
          {t('AddProduct.Quantite')}: {item.quantity}
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
          {isEditing ? t('AddProduct.Modify') : t('AddProduct.title')}
        </Header>
      ),
    },
    {
      key: 'error',
      component: <Text style={defaultStyles.error}>{productError}</Text>,
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
            productName={productName}
            setProductName={handleNameChange}
            error={nameError}
          />
        </View>
      ),
    },
    {
      key: 'formules_select',
      component: (
        <View style={defaultStyles.section}>
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
      key: 'type_prix',
      component: showNewFormule ? (
        <View style={defaultStyles.section}>
          <Text style={{fontSize: 20, marginBottom: 10}}>
            {t('AddService.AddFormulas')}
          </Text>
          {dropdownVisible && (
            <View style={defaultStyles.sectionStyle}>
              <SelectList
                key={typePrix}
                boxStyles={StyleSheet.flatten([
                  styles.container1,
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
                  typePrix
                    ? typesPrix.find(typ => typ.key === typePrix)
                    : undefined
                }
              />
            </View>
          )}
          {showCustomTypePrixInput && (
            <View style={defaultStyles.sectionStyle}>
              <PaperTextInput
                placeholder={t('Global.TypePrix')}
                value={customTypePrix}
                onChangeText={setCustomTypePrix}
                returnKeyType="done"
                style={
                  typePrixError
                    ? [styles.input, styles.inputError]
                    : styles.input
                }
              />
              <Button
                mode="contained"
                onPress={handleAddCustomTypePrix}
                style={{marginLeft: 10}}>
                {t('Global.Add')}
              </Button>
            </View>
          )}
          {typePrixError && (
            <Text style={defaultStyles.error}>
              {t('Global.TypePrixErrorEmpty')}
            </Text>
          )}
        </View>
      ) : null, // Si `showNewFormule` est faux, n'affiche rien
    },
    {
      key: 'offre',
      component: showNewFormule ? (
        <View style={defaultStyles.section}>
          <View style={defaultStyles.sectionStyle}>
            <PaperTextInput
              label={t('AddService.Offre')}
              returnKeyType="done"
              // style={styles.textInput}
              // placeholder={t('AddService.Offre')}
              value={offre}
              onChangeText={handleOffreChange}
              style={
                offreError ? [styles.input, styles.inputError] : styles.input
              }
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
      key: 'prix_unitaire',
      component: (
        <View style={defaultStyles.section}>
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
      ),
    },
    {
      key: 'quantite',
      component: (
        <View style={defaultStyles.section}>
          <QuantiteProduct
            productQuantite={productQuantite}
            setProductQuantite={handleQuantiteChange}
            error={quantiteError}
          />
          {quantiteError != '' && (
            <Text style={defaultStyles.error}>{quantiteError}</Text>
          )}
        </View>
      ),
    },
    {
      key: 'formule',
      component: (
        <View style={defaultStyles.section}>
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
      ),
    },
    {
      key: 'description',
      component: (
        <View style={defaultStyles.section}>
          <DescriptionProduct
            maxLength={200}
            productDescription={productDescription}
            setProductDescription={handleDescriptionChange}
            error={quantiteError}
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
      key: 'conditions',
      component: (
        <View style={defaultStyles.section}>
          <Text>{t('AddService.Conditions')}</Text>
          <View style={defaultStyles.sectionStyle}>
            {dropdownVisibleCond && (
              <MultiSelect
                items={conditions}
                uniqueKey="key"
                onSelectedItemsChange={handleConditions}
                selectedItems={condition}
                selectText={t('Dropdown.Conditions')}
                searchInputPlaceholderText={t('Dropdown.Search')}
                displayKey="value"
                hideSubmitButton={true}
                styleDropdownMenuSubsection={StyleSheet.flatten([
                  styles.multiSelectContainer,
                  conditionsError ? styles.inputError : null, // Ajoute un style pour les erreurs
                ])}
                //styleDropdownMenuSubsection={styles.multiSelectContainer} // Appliquez des styles personnalisés ici
                //styleInputGroup={styles.multiSelectInputGroup} // Pour centrer le placeholder
                styleInputGroup={StyleSheet.flatten([
                  styles.multiSelectInputGroup,
                  conditionsError ? styles.inputError : null,
                ])} // Centrer le placeholder et gérer les erreurs
                styleTextDropdown={styles.multiSelectText}
              />
            )}
            {showCustomCondInput && (
              <View>
                <View>
                  <PaperTextInput
                    placeholder={t('Global.Condition')}
                    value={customCondition}
                    returnKeyType="done"
                    onChangeText={setCustomCondition}
                    style={
                      conditionsError
                        ? [styles.input, styles.inputError]
                        : styles.input
                    }
                  />
                </View>
                <Button
                  mode="contained"
                  onPress={handleAddCustomCond}
                  style={{marginLeft: 10}}>
                  {t('Global.Add')}
                </Button>
              </View>
            )}
          </View>
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
    <SafeAreaView style={styles.container}>
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
