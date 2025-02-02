import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {BacktoHome} from '../components/BacktoHome';
import {useNavigation} from '@react-navigation/native';
import {Location} from '../contexts/types';
import {useStore} from '../contexts/store';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useTheme} from '../contexts/theme';
import defaultComponentsThemes from '../defaultComponentsThemes';
import {theme} from '../core/theme';
import CheckBoxRow from '../components/CheckBoxRow';
import Button from '../components/Button';
import {NameProduct} from '../components/NameProduct';
import {CategoryService} from '../components/CategoryService';
import {EmplacementSection} from '../components/EmplacementSection';
import {SelectList} from 'react-native-dropdown-select-list';
import {ZoneService} from '../components/ZoneService';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import countryGeonameIds from '../services/countryGeonameIds.json';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import storage from '@react-native-firebase/storage';
import {
  accepteValidator,
  adresseValidator,
  categoryValidator,
  confirmeValidator,
  fileValidator,
  nameSectionValidator,
  provinceValidator,
  regionValidator,
  zoneValidator,
} from '../core/utils';

export const ValidationVendeur = () => {
  const currentUser = auth().currentUser;
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const [confirme, setConfirme] = useState(false);
  const [accepte, setAccepte] = useState(false);
  const {ColorPallet} = useTheme();
  const defaultStyle = defaultComponentsThemes();
  const [businessName, setBusinessName] = useState<string>('');
  const [nameError, setNameError] = useState('');
  const [businessError, setBusinessError] = useState('');
  const [businessCategory, setBusinessCategory] = useState<string>('');
  const [categoryError, setCategoryError] = useState('');
  const [businessAdresse, setBusinessAdresse] = useState<Location>({
    placeId: '',
    description: '',
  });
  const [state] = useStore();
  const [adresseError, setAdresseError] = useState('');
  const [zoneService, setZoneService] = useState<string[]>([]);
  const [zoneError, setZoneError] = useState('');
  const [provinces, setProvinces] = useState<{key: string; value: string}[]>(
    [],
  );
  const [province, setProvince] = useState<string>('');
  const [provinceError, setProvinceError] = useState<string>('');
  const [regions, setRegions] = useState<{key: string; value: string}[]>([]);
  const [region, setRegion] = useState<string>('');
  const [regionError, setRegionError] = useState<string>('');
  const [idRegistration, setIdRegistration] =
    useState<DocumentPickerResponse | null>(null);
  const [idRegistrationError, setIdRegistrationError] = useState<string>('');
  const [otherDocs, setOtherDocs] = useState<DocumentPickerResponse | null>(
    null,
  );
  const [otherDocsError, setOtherDocsError] = useState<string>('');
  const countryCode = state.country.toString();
  const selectedLanguageCode = i18n.language;
  const [confirmeError, setConfirmeError] = useState<string>('');
  const [accepteError, setAccepteError] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  const handleFileSelectionRegistration = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      setIdRegistration(file[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the file picker');
      } else {
        console.error('File selection error: ', err);
      }
    }
  };

  const handleFileSelectionOtherDocs = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      setOtherDocs(file[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled the file picker');
      } else {
        console.error('File selection error: ', err);
      }
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
    bodyText: {
      ...defaultStyle.text,
      flexShrink: 1,
    },
    titleText: {
      ...defaultStyle.text,
      textDecorationLine: 'underline',
    },
    title: {
      ...defaultStyle.subtitle,
    },
    controlsContainer: {
      marginTop: 'auto',
      marginBottom: 20,
    },
    paragraph: {
      flexDirection: 'row',
      marginTop: 20,
    },
    enumeration: {
      ...defaultStyle.text,
      marginRight: 25,
    },
    link: {
      ...defaultStyle.text,
      color: ColorPallet.link,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
    errorBorder: {
      borderColor: 'red', // Bordure rouge en cas d'erreur
      borderWidth: 1,
    },
    input: {
      backgroundColor: theme.colors.surface,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const geonameId = (countryGeonameIds as Record<string, number>)[
        countryCode
      ];
      if (geonameId) {
        const apiUrl = `http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=amadagueye&lang=${selectedLanguageCode}`;
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
    const unsubscribe = firestore()
      .collection('categories')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setCategories([]);
        } else {
          const newCat: string[] = [];
          querySnapshot.forEach(documentSnapshot => {
            newCat.push(documentSnapshot.id);
          });
          setCategories(newCat);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const handleNameChange = (value: string) => {
    setBusinessError('');
    setBusinessName(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryError('');
    setBusinessCategory(value);
  };

  const handleAdresseChange = (value: Location) => {
    setAdresseError('');
    setBusinessAdresse(value);
  };

  const handleProvinceChange = (value: string) => {
    setProvinceError('');
    setProvince(value);
  };

  const handleRegionChange = (value: string) => {
    setRegionError('');
    setRegion(value);
  };

  const handleZoneChange = (value: string[]) => {
    setZoneError('');
    setZoneService(value);
  };

  const handleConfirmeChange = (value: boolean) => {
    setConfirmeError('');
    setConfirme(!value);
  };

  const handleAccepteChange = (value: boolean) => {
    setAccepteError('');
    setAccepte(!value);
  };

  const handleSave = async () => {
    try {
      const nameEmpty = nameSectionValidator(businessName, t);
      const zoneEmpty = zoneValidator(zoneService, t);
      const categoryEmpty = categoryValidator(businessCategory, t);
      const provinceEmpty = provinceValidator(province, t);
      const regionEmpty = regionValidator(region, t);
      const idRegistrationEmpty = fileValidator(idRegistration, t);
      const otherDocsEmpty = fileValidator(otherDocs, t);
      const adressEmpty = adresseValidator(businessAdresse, t);
      const confirmeEmpty = confirmeValidator(confirme, t);
      const accepteEmpty = accepteValidator(accepte, t);

      if (
        nameEmpty ||
        categoryEmpty ||
        zoneEmpty ||
        provinceEmpty ||
        regionEmpty ||
        idRegistrationEmpty ||
        otherDocsEmpty
      ) {
        setNameError(nameEmpty);
        setCategoryError(categoryEmpty);
        setZoneError(zoneEmpty);
        setProvinceError(provinceEmpty);
        setRegionError(regionEmpty);
        setIdRegistrationError(idRegistrationEmpty);
        setOtherDocsError(otherDocsEmpty);
        setAdresseError(adressEmpty);
        setConfirmeError(confirmeEmpty);
        setAccepteError(accepteEmpty);
        setAccepte(false);
        setConfirme(false);
      } else {
        const uid = uuidv4();
        let idRegistrationDoc: string | null = '';
        if (idRegistration !== null) {
          try {
            const task = storage()
              .ref(`/${idRegistration.name}`)
              .putFile(idRegistration.uri);
            await task;
            idRegistrationDoc = idRegistration.name || '';
          } catch (e) {
            console.error('Erreur lors du téléchargement:', e);
            //setBoutonActif(false);
          }
        }
        let otherDoc: string | null = '';
        if (otherDocs !== null) {
          try {
            const task = storage()
              .ref(`/${otherDocs.name}`)
              .putFile(otherDocs.uri);
            await task;
            otherDoc = otherDocs.name || '';
          } catch (e) {
            console.error('Erreur lors du téléchargement:', e);
            //setBoutonActif(false);
          }
        }

        if (idRegistrationDoc.length >= 0 && otherDoc.length >= 0) {
          firestore()
            .collection('vendeurs')
            .doc(uid)
            .set({
              id: uid,
              name: businessName,
              category: businessCategory,
              adresse: businessAdresse,
              zone: zoneService,
              province: province,
              region: region,
              idBusinessRegistre: idRegistrationDoc,
              autreDocs: otherDoc,
              confirme: confirme,
              accepte: accepte,
              userId: currentUser?.uid,
              actif: false,
            })
            .then(() => {
              console.log('Service added!');
              navigation.navigate('HomeScreen' as never);
            });
        }
      }
    } catch (e: unknown) {}
  };

  const data = [
    {key: 'header', component: <Header>{t('Vendeur.title')}</Header>},
    {
      key: 'error',
      component: <Text style={defaultStyle.error}>{businessError}</Text>,
    },
    {
      key: 'name',
      component: (
        <View style={defaultStyle.section}>
          <View style={defaultStyle.sectionStyle}>
            <NameProduct
              productName={businessName}
              setProductName={handleNameChange}
              error={nameError}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'category',
      component: (
        <View style={defaultStyle.section}>
          <View style={defaultStyle.sectionStyle}>
            <CategoryService
              categoryService={businessCategory}
              setCategoryService={handleCategoryChange}
              error={categoryError}
              categoryVendeur={categories}
            />

            {categoryError ? (
              <Text style={defaultStyle.error}>{categoryError}</Text>
            ) : null}
          </View>
        </View>
      ),
    },
    {
      key: 'adresse',
      component: (
        <View style={defaultStyle.section}>
          <View style={defaultStyle.sectionStyle}>
            <EmplacementSection
              eventLocalisation={businessAdresse}
              setEventLocalisation={handleAdresseChange}
              error={adresseError}
              label={t('Vendeur.Adresse')}
            />
          </View>
        </View>
      ),
    },
    {
      key: 'zone',
      component: (
        <View style={defaultStyle.section}>
          <Text>{t('AddService.Zone')}</Text>
          <View style={defaultStyle.sectionStyle}>
            <SelectList
              boxStyles={
                provinceError
                  ? {...styles.container, ...styles.errorBorder}
                  : styles.container
              }
              setSelected={handleProvinceChange}
              data={provinces}
              search={true}
              save="key"
              placeholder={t('Dropdown.Province')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={
                provinceError
                  ? {...styles.input, color: 'red'} // Placeholder en rouge en cas d'erreur
                  : styles.input
              }
            />
            {provinceError ? (
              <Text style={defaultStyle.error}>{provinceError}</Text>
            ) : null}
          </View>
          <View style={defaultStyle.sectionStyle}>
            <SelectList
              boxStyles={
                regionError
                  ? {...styles.container, ...styles.errorBorder}
                  : styles.container
              }
              setSelected={handleRegionChange}
              data={regions}
              search={true}
              save="key"
              placeholder={t('Dropdown.Region')}
              dropdownTextStyles={{backgroundColor: theme.colors.surface}}
              inputStyles={
                regionError
                  ? {...styles.input, color: 'red'} // Placeholder en rouge en cas d'erreur
                  : styles.input
              }
            />
            {regionError ? (
              <Text style={defaultStyle.error}>{regionError}</Text>
            ) : null}
          </View>
          <View style={defaultStyle.sectionStyle}>
            <ZoneService
              region={region}
              setZoneService={handleZoneChange}
              defaultSelectedZones={zoneService}
              error={zoneError}
            />
          </View>
          {zoneError ? (
            <Text style={defaultStyle.error}>{zoneError}</Text>
          ) : null}
        </View>
      ),
    },
    {
      key: 'idRegistration',
      component: (
        <View style={defaultStyle.section}>
          <Text>{t('Vendeur.IdRegistration')}</Text>
          <View style={defaultStyle.sectionStyle}>
            <TouchableOpacity
              onPress={handleFileSelectionRegistration}
              style={defaultStyle.button}>
              <Text style={defaultStyle.buttonText}>
                {idRegistration ? idRegistration.name : t('Vendeur.SelectFile')}
              </Text>
            </TouchableOpacity>
            {idRegistrationError ? (
              <Text style={defaultStyle.error}>{idRegistrationError}</Text>
            ) : null}
          </View>
        </View>
      ),
    },
    {
      key: 'otherDocs',
      component: (
        <View style={defaultStyle.section}>
          <Text>{t('Vendeur.OtherDocs')}</Text>
          <View style={defaultStyle.sectionStyle}>
            <TouchableOpacity
              onPress={handleFileSelectionOtherDocs}
              style={defaultStyle.button}>
              <Text style={defaultStyle.buttonText}>
                {otherDocs ? otherDocs.name : t('Vendeur.SelectFile')}
              </Text>
            </TouchableOpacity>
            {otherDocsError ? (
              <Text style={defaultStyle.error}>{otherDocsError}</Text>
            ) : null}
          </View>
        </View>
      ),
    },
    {
      key: 'confirme',
      component: (
        <View style={defaultStyle.section}>
          <View style={defaultStyle.sectionStyle}>
            <CheckBoxRow
              title={t('Vendeur.Confirme')}
              accessibilityLabel={t('Vendeur.Confirme') || ''}
              checked={confirme}
              onPress={() => handleConfirmeChange(confirme)}
            />
            {confirmeError ? (
              <Text style={defaultStyle.error}>{confirmeError}</Text>
            ) : null}
          </View>
        </View>
      ),
    },
    {
      key: 'accepte',
      component: (
        <View style={defaultStyle.section}>
          <View style={defaultStyle.sectionStyle}>
            <CheckBoxRow
              title={t('Vendeur.Accepte')}
              accessibilityLabel={t('Vendeur.Accepte') || ''}
              checked={accepte}
              onPress={() => handleAccepteChange(accepte)}
            />
            {accepteError ? (
              <Text style={defaultStyle.error}>{accepteError}</Text>
            ) : null}
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, paddingTop: 20}}>
      <BacktoHome textRoute={t('HomeScreen.title')} />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          paddingBottom: 100,
        }}>
        <FlatList
          data={data}
          renderItem={({item}) => <View>{item.component}</View>}
          keyExtractor={item => item.key}
          contentContainerStyle={defaultStyle.scrollViewContent}
        />
      </View>

      <View style={defaultStyle.bottomButtonContainer}>
        <View style={defaultStyle.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('HomeScreen' as never)}
            style={defaultStyle.button}>
            {t('Global.Cancel')}
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={defaultStyle.button}>
            {t('Global.Submit')}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
