import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import {useTranslation} from 'react-i18next';
  import DefaultComponentsThemes from '../defaultComponentsThemes';
  import Header from '../components/Header';
  import React, { useEffect, useState } from 'react';
  import {Accueil, Product} from '../contexts/types';
  import {useNavigation} from '@react-navigation/native';
  import Icon from 'react-native-vector-icons/AntDesign';
  import {theme} from '../core/theme';
import { DashboardList } from '../components/DashboardList';
import { DashboardItem } from '../components/DashboardItem';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ProduitLists from '../components/ProduitLists';
  
  const ManageProducts = () => {
    const {t} = useTranslation();
    const defaultStyles = DefaultComponentsThemes();
    const navigation = useNavigation();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      firestore()
        .collection('products')
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) {
            setProducts([]);
          } else {
            const product: Product[] = [];
            querySnapshot.forEach(documentSnapshot => {
              product.push(documentSnapshot.data() as Product);
            });
            setProducts(product);
          }
        });
    }, [products]);
  

    const logout = () => {
        auth()
          .signOut()
          .then(() => navigation.navigate('LoginScreen' as never));
      };
  
    const styles = StyleSheet.create({
      img: {
        width: '30%',
        resizeMode: 'contain',
        paddingRight: 50,
      },
      row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    });
    return (
      <SafeAreaView>
        <View style={{padding: 20}}>
          <View style={styles.row}>
            <View style={defaultStyles.leftSectRowContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon1
                    name={'arrow-back-ios'}
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
            </View>
            <View style={defaultStyles.rightSectRowContainer}>
              <View style={{paddingRight: 5, paddingBottom: 7}}>
                <TouchableOpacity onPress={logout}>
                  <Icon
                    name={'logout'}
                    color={theme.colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </View>
          <Header>{t('DashboardList.Products')}</Header>
          <View style={{justifyContent: 'center', alignContent: 'center'}}>
       
        <ScrollView style={{padding: 10}} scrollEnabled>
        {products.map((item: Product, index: number) => {
            return (
              <ProduitLists
                key={index.toString()}
                product={item}
                color={theme.colors.black}
              />
            );
          })}
        </ScrollView>
      </View>
      </SafeAreaView>
    );
  };
  
  export default ManageProducts;
  