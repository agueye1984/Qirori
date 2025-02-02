import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import {ManageEventsParamList, Product, Service} from '../contexts/types';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import {Button} from 'react-native-paper';
import {ProductView} from '../components/ProductView';
import {ServiceView} from '../components/ServiceView';
import Filters from '../components/Filters';
import {getAllRecords, getFilteredRecords} from '../services/FirestoreServices';
import {fetchGeonameName} from '../services/ZonesServices';
import SearchBarQuery from '../components/SearchBarQuery';
import DefaultComponentsThemes from '../defaultComponentsThemes';

type productDetailsProp = StackNavigationProp<
  ManageEventsParamList,
  'ServiceDetails'
>;

type CombinedData =
  | {type: 'header'; title: string}
  | {type: 'filter'}
  | {type: 'sectionHeader'; title: string}
  | {type: 'product'; data: Product}
  | {type: 'service'; data: Service};

export const ServicesOffertsList = () => {
  const route =
    useRoute<RouteProp<ManageEventsParamList, 'ServicesOffertsList'>>();
  const categoryId = route.params.item;
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedFormula, setSelectedFormula] = useState<string>('All');
  const [participantCount, setParticipantCount] = useState<number>(1);
  const navigation = useNavigation<productDetailsProp>();
  const {t, i18n} = useTranslation();
  const [serviceCategory, setServiceCategory] = useState<string>(categoryId);
  const [zones, setZones] = useState<{key: string; value: string}[]>([
    {key: 'All', value: 'All'},
  ]);
  const [formulas, setFormulas] = useState<{key: string; value: string}[]>([
    {key: 'All', value: 'All'},
  ]);
  const selectedLanguageCode = i18n.language;
  const defaultStyles = DefaultComponentsThemes();

  useEffect(() => {
    const loadZonesAndFormulas = async () => {
      try {
        const serviceRecords = await getFilteredRecords(
          'services',
          'category',
          serviceCategory,
        );
        const zonesSet = new Set<string>();
        serviceRecords.forEach(record => {
          const service = record.data as Service;
          service.zone.forEach(zone => zonesSet.add(zone));
        });

        const formules = await getAllRecords('formules');
        const formattedFormulas: any[] = [];
        for (const record of formules) {
          const offre = {
            key: record.id,
            value: record.data.name,
          };
          formattedFormulas.push(offre);
        }

        const zonesWithNames = await Promise.all(
          Array.from(zonesSet).map(async geonameId => {
            const {key, value} = await fetchGeonameName(
              geonameId,
              selectedLanguageCode,
            );
            return {key, value};
          }),
        );

        // Mettre à jour l'état des zones
        setZones([{key: 'All', value: 'All'}, ...zonesWithNames]);
        setFormulas([{key: 'All', value: 'All'}, ...formattedFormulas]);
      } catch (error) {
        console.error('Error loading zones and formulas:', error);
      }
    };

    loadZonesAndFormulas();
  }, [serviceCategory]);

  const getProducts = async () => {
    const data = await getFilteredRecords(
      'products',
      'category',
      serviceCategory,
    );
    const newProd = data.map(record => record.data as Product);
    setProducts(newProd);
  };
  const getServices = async () => {
    const data = await getFilteredRecords(
      'services',
      'category',
      serviceCategory,
    );
    const newServ = data.map(record => record.data as Service);
    setServices(newServ);
  };

  useEffect(() => {
    getProducts();
  }, [serviceCategory]);

  useEffect(() => {
    getServices();
  }, [serviceCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearchQuery = product.name.includes(searchQuery);

    const matchesCategory = product.category.includes(serviceCategory);
    const matchesZone =
      selectedZone === 'All' || product.zone.includes(selectedZone);
    const matchesFormula =
      selectedFormula === 'All' ||
      Object.values(product.formules).some(
        formule => formule.formuleId === selectedFormula.toString(),
      ); //product.formulesId.includes(selectedFormula.toString());
    const matchesParticipantCount =
      participantCount === null ||
      Object.values(product.formules).some(
        formule => parseInt(formule.quantity) >= participantCount,
      );

    return (
      matchesSearchQuery &&
      matchesCategory &&
      matchesZone &&
      matchesFormula &&
      matchesParticipantCount
    );
  });

  const filteredServices = services.filter(service => {
    const matchesSearchQuery = service.name.includes(searchQuery);
    const matchesCategory = service.category.includes(serviceCategory);
    const matchesZone =
      selectedZone === 'All' || service.zone.includes(selectedZone);
    const matchesFormula =
      selectedFormula === 'All' ||
      Object.values(service.formules).some(
        formule => formule.formuleId === selectedFormula.toString(),
      );
    const matchesParticipantCount =
      participantCount === null ||
      Object.values(service.conditions).some(
        condition => parseInt(condition.capacity) >= participantCount,
      );

    return (
      matchesSearchQuery &&
      matchesCategory &&
      matchesZone &&
      matchesFormula &&
      matchesParticipantCount
    );
  });

  const handleCategoryChange = (value: string) => {
    setServiceCategory(value);
  };

  const combinedData: CombinedData[] = [
    {type: 'header', title: t('BuyProduct.title')},
    {type: 'filter'},
    /*  { type: 'sectionHeader', title: t('Products.title') }, */
    ...filteredProducts.map(
      product => ({type: 'product', data: product} as CombinedData),
    ),
    /* { type: 'sectionHeader', title: t('Services.title') }, */
    ...filteredServices.map(
      service => ({type: 'service', data: service} as CombinedData),
    ),
  ];

  const renderItem = ({item}: {item: CombinedData}) => {
    switch (item.type) {
      case 'header':
        return <Header>{item.title}</Header>;
      case 'filter':
        return (
          <>
            <SearchBarQuery setSearchQuery={setSearchQuery} />
            <Filters
              setSelectedZone={setSelectedZone}
              setSelectedFormula={setSelectedFormula}
              setParticipantCount={setParticipantCount}
              serviceCategory={serviceCategory}
              handleCategoryChange={handleCategoryChange}
              zones={zones}
              formulas={formulas}
            />
          </>
        );
      /* case 'sectionHeader':
        return <Text style={styles.header}>{item.title}</Text>; */
      case 'product':
        return (
          <ProductView
            product={item.data}
            image={item.data.images}
            onPress={() => {
              navigation.navigate('ProductDetails', {
                item: item.data,
              });
            }}
            participantCount={participantCount}
            selectFormule={selectedFormula.toString()}
          />
        );
      case 'service':
        return (
          <ServiceView
            service={item.data}
            images={item.data.images}
            participantCount={participantCount}
            onPress={() => {
              navigation.navigate('ServiceDetails', {
                item: item.data,
                participantCount: participantCount,
              });
            }}
            selectFormule={selectedFormula.toString()}
          />
        );
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    container1: {
      flex: 1,
      backgroundColor: '#fff',
      marginHorizontal: 15,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 10,
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      padding: 15,
      borderTopWidth: 1,
      borderColor: '#ccc',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });

  return (
    <SafeAreaView style={styles.container1}>
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}} // Adjust padding to ensure visibility of all items
      />
      <View style={styles.bottomButtonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Achats' as never)}
          style={defaultStyles.button}>
          {t('Global.Back')}
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Cart' as never)}
          style={defaultStyles.button}>
          {t('BuyProduct.Cart')}
        </Button>
      </View>
    </SafeAreaView>
  );
};
