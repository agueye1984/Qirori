import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Panier} from '../contexts/types';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {
  getFilteredArrayRecords,
  getRecordById,
} from '../services/FirestoreServices';
import Carousel from 'react-native-snap-carousel';
import {useNavigation} from '@react-navigation/native';

type Props = {
  panier: Panier;
};

const CartItemOffre = ({panier}: Props) => {
  const {ColorPallet} = useTheme();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [offre, setOffre] = useState<string>('');
  const [devise, setDevise] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [montant, setMontant] = useState<string>('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getFilteredArrayRecords(
          panier.type,
          'formulesId',
          panier.formule.toString(),
        );
        const newServ = data.map(record => record.data as any);
        // console.log(data.data)
        for (const serv of newServ) {
          const tabUrl: string[] = [];
          for (const imageServ of serv.images) {
            const url = await storage().ref(imageServ).getDownloadURL();
            tabUrl.push(url);
          }
          const formule = serv.formules.find(
            (f: any) => f.id === panier.formule,
          );

          const form = await getRecordById('formules',formule.formuleId);
          setOffre(form?.name);

          const offreMontant = formule ? parseInt(formule.amount) : 0;
          setImageUrls(tabUrl);
          setName(serv.name);
          setDescription(serv.description);
          setDevise(serv.devise);
          setMontant(offreMontant.toString());
          //setOffre(serv.name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [panier]);

  //console.log(offre)

  const styles = StyleSheet.create({
    container: {
      marginTop: heightToDp(2),
      flexDirection: 'row',
      borderBottomWidth: 1,
      paddingBottom: heightToDp(2),
      borderColor: '#e6e6e6',
      width: widthToDp('90%'),
    },
    image: {
      width: widthToDp(15), // Ajustement de la largeur de l'image pour la rendre réactive
      height: heightToDp(10), // Ajustement de la hauteur de l'image pour la rendre réactive
      borderRadius: 10,
    },
    title: {
      fontSize: widthToDp(4.5),
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      marginLeft: widthToDp(3),
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginVertical: heightToDp(2),
      width: widthToDp(60), // Ajustement de la largeur de l'information pour qu'elle soit réactive
      flex: 1,
    },
    description: {
      fontSize: widthToDp(3.5),
      color: '#8e8e93',
      marginTop: heightToDp(1),
    },
    price: {
      fontSize: widthToDp(4),
    },
    quantity: {
      fontSize: widthToDp(4),
    },
    deleteContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: widthToDp(10), // Ajout de padding dynamique
      backgroundColor: ColorPallet.error,
    },
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      //marginBottom: 10,
      width: 100,
      height: 30,
      flexDirection: 'row', // Aligner les icônes en ligne
      alignItems: 'center', // Centrer verticalement les icônes
    },
    buttonContainer: {
      position: 'absolute',
      top: 5,
      left: 0,
      right: 0,
      flexDirection: 'row', // Aligner les boutons horizontalement
      justifyContent: 'space-between', // Espacer les boutons uniformément
    },
    removeButton: {
      backgroundColor: 'rgba(255, 0, 0, 0.7)',
      padding: 5,
      borderRadius: 15,
      zIndex: 1,
    },
  });

  const handleDelete = (panier: Panier) => {
    firestore()
      .collection('carts')
      .doc(panier.id)
      .delete()
      .then(() => {
        console.log('Paniers deleted!');
        navigation.navigate('Cart' as never);
      });
  };

  const RightSwipeActions = () => {
    return (
      <Pressable
        onPress={() => handleDelete(panier)}
        style={({pressed}) => [
          styles.deleteContainer,
          pressed && {opacity: 0.8},
        ]}>
        <FontAwesomeIcon name="trash" size={24} color={ColorPallet.white} />
      </Pressable>
    );
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.slide}>
        <Image
          source={
            item === ''
              ? require('../../assets/No_image_available.svg.png')
              : {uri: item}
          }
          style={styles.image}
        />
      </View>
    );
  };

  return (
      <View style={styles.container}>
        <View style={{}}>
          <Carousel
            data={imageUrls}
            renderItem={renderItem}
            sliderWidth={widthToDp(15)}
            itemWidth={widthToDp(15)}
            autoplay={true}
            loop={true}
          />
        </View>
        <View style={styles.info}>
          <View>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.title}>{offre}</Text>
            <Text style={styles.description}>
              {description} • {montant} {devise}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.price}>
              {panier.totalPrice} {devise}
            </Text>
            <Text style={styles.quantity}>x{panier.qty}</Text>
          </View>
        </View>
        <View style={styles.imageWrapper}>
        <View style={styles.buttonContainer}>
        <Pressable
                onPress={() => handleDelete(panier)}
                style={styles.removeButton}>
                <FontAwesomeIcon name="trash" size={20} color="white" />
              </Pressable>
        </View>
        </View>
      </View>
  );
};

export default CartItemOffre;
