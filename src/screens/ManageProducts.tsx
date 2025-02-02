import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from '../components/Header';
import React, {useEffect, useState} from 'react';
import {Product} from '../contexts/types';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {theme} from '../core/theme';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ProduitLists from '../components/ProduitLists';

const ManageProducts = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          setProducts([]);
        } else {
          const product: Product[] = [];
          querySnapshot.forEach(documentSnapshot => {
            const prodData = documentSnapshot.data() as Product;
            prodData.id = documentSnapshot.id; // ajouter l'id du document
            product.push(prodData);
          });
          setProducts(product);
        }
      });

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('LoginScreen' as never));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Prend tout l'espace disponible
      paddingTop: 20,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      padding: 20,
    },
    addEventButtonContainer: {
      alignItems: 'center',
      marginVertical: 15,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1
            name={'arrow-back-ios'}
            color={theme.colors.primary}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Icon name="logout" color={theme.colors.primary} size={30} />
        </TouchableOpacity>
      </View>
      <Header>{t('DashboardList.Products')}</Header>
      <FlatList
        data={products}
        renderItem={({item}) => (
          <ProduitLists product={item} color={theme.colors.black} />
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

export default ManageProducts;
