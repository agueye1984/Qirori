import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Panier, Product} from '../contexts/types';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {Swipeable} from 'react-native-gesture-handler';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

type Props = {
  panier: Panier;
};

const CartItem = ({panier}: Props) => {
  const {ColorPallet} = useTheme();
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const getImages = async () => {
      const url = await storage().ref(panier.images).getDownloadURL();
        setImageUrl(url);
    };
    getImages();
  }, [panier.images]);

  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      flexDirection: 'row',
      borderBottomWidth: 1,
      paddingBottom: 10,
      borderColor: '#e6e6e6',
      width: widthToDp('90%'),
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    title: {
      fontSize: widthToDp(4),
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
      width: widthToDp(50),
    },
    description: {
      fontSize: widthToDp(3.5),
      color: '#8e8e93',
      marginTop: heightToDp(2),
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
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.error,
    },
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },

    phoneNumber: {
      color: '#888',
    },
    thumb: {
      height: 60,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      width: 60,
    },
    editContainer: {
      marginVertical: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 34,
      backgroundColor: ColorPallet.primary,
    },
    name: {
      fontSize: 16,
    },
  });

  const handleDelete = (panier: Panier) => {
    firestore()
      .collection('carts')
      .doc(panier.id)
      .delete()
      .then(() => {
        console.log('Paniers deleted!');
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

  return (
    <Swipeable renderRightActions={RightSwipeActions}>
      <View style={styles.contactCon}>
        <View style={{marginVertical: 25}}>
          <Image
            style={styles.thumb}
            source={
              imageUrl === ''
                ? require('../../assets/No_image_available.svg.png')
                : {uri: imageUrl}
            }
          />
        </View>
        <View style={styles.info}>
          <View>
            <Text style={styles.title}>{panier.name}</Text>
            <Text style={styles.description}>
              {panier.description} • {panier.prix} {panier.devise}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.price}>
              {panier.totalPrice} {panier.devise}
            </Text>
            <Text style={styles.quantity}>x{panier.qty}</Text>
          </View>
        </View>
      </View>
      
    </Swipeable>
  );
};

export default CartItem;
