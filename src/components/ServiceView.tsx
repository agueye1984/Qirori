import React, {useState} from 'react';
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '../contexts/theme';
import {Offre, Panier, Product, Service} from '../contexts/types';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LocalStorageKeys} from '../constants';
import {useStore} from '../contexts/store';
import {DispatchAction} from '../contexts/reducers/store';
import {NumericFormat} from 'react-number-format';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {theme} from '../core/theme';
import Icon2 from 'react-native-vector-icons/Fontisto';
import defaultComponentsThemes from '../defaultComponentsThemes';

type Props = {
  service: Service;
  onPress: () => void;
  image: string;
};

export const ServiceView = ({service, image, onPress}: Props) => {
  const {ColorPallet} = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [state, dispatch] = useStore();
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  const {t} = useTranslation();
  const defaultStyles = defaultComponentsThemes();

  AsyncStorage.getItem(LocalStorageKeys.UserId)
    .then(result => {
      if (result != null) {
        setUserId(result);
      }
    })
    .catch(error => console.log(error));

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      shadowColor: 'black',
      shadowOffset: {
        height: 0,
        width: 0,
      },
      elevation: 1,
      marginVertical: 20,
    },
    thumb: {
      height: 300,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: 300,
    },
    infoContainer: {
      padding: 16,
    },
    name: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    itemContainerForm: {
      height: 70,
      marginHorizontal: 5,
      borderWidth: 0.5,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    column: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Image style={styles.thumb} source={{uri: image}} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{service.category}</Text>
          <Text style={styles.price}>{service.name}</Text>
        </View>
        <View style={styles.infoContainer}>
        {service.offres.map((offer: any, index: number) => {
           return (
          <TouchableOpacity style={defaultStyles.itemContainer} >
            {offer.checked ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon2
                name={'radio-btn-active'}
                size={20}
                color={ColorPallet.primary}
              />
              <Text
                style={[
                  defaultStyles.text,
                  {paddingLeft: 5, fontWeight: 'bold'},
                ]}
              >{offer.name} : {offer.montant} {offer.devise}</Text>
            </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon2 name={'radio-btn-passive'} size={20} color={ColorPallet.primary} />
              <Text style={[defaultStyles.text, { paddingLeft: 5 }]}>{offer.name} : {offer.montant} {offer.devise}</Text>
            </View>
            )}
          </TouchableOpacity>
          );
        })}
        </View>
      </View>
      <View style={[styles.itemContainerForm, {flexDirection: 'row'}]}>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginHorizontal: 10, marginVertical: 25}}>
            <Text>{t('BuyProduct.Quantity')}</Text>
          </View>
          <View style={{marginHorizontal: 10, marginLeft: 50}}>
            <TouchableOpacity>
              <Icon1
                name="angle-up"
                size={20}
                color={theme.colors.primaryText}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 15, color: 'black'}}>{quantity}</Text>
            <TouchableOpacity>
              <Icon1
                name="angle-down"
                size={20}
                color={theme.colors.primaryText}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 100}}>
          <TouchableOpacity style={styles.card}>
            <Icon
              name={'shoppingcart'}
              color={theme.colors.primary}
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
