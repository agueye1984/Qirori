import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Panier} from '../contexts/types';
import {
  widthPercentageToDP as widthToDp,
  heightPercentageToDP as heightToDp,
} from 'react-native-responsive-screen';
import {useTheme} from '../contexts/theme';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-snap-carousel';

type Props = {
  panier: Panier;
};

const CartItemOrder = ({panier}: Props) => {
  const {ColorPallet} = useTheme();
  const [imagesUrls, setImagesUrls] = useState<string[]>([]);

  useEffect(() => {
    const getImages = async () => {
      const tabUrl: string[] = [];
      for (const imageServ of panier.images) {
        // console.log(imageServ);
        const url = await storage().ref(imageServ).getDownloadURL();
        //console.log(url);
        tabUrl.push(url);
      }
      setImagesUrls(tabUrl);
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
    slide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

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
    <View style={styles.contactCon}>
      <View style={{marginVertical: 25}}>
        <Carousel
          data={imagesUrls}
          renderItem={renderItem}
          sliderWidth={widthToDp(15)}
          itemWidth={widthToDp(15)}
          autoplay={true}
          loop={true}
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
  );
};

export default CartItemOrder;
