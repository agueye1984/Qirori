import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';


type Props = {
  name: string
  onPress: () => void
}

export const CategoryView = ({ name, onPress }: Props) => {

  const { width } = Dimensions.get('window'); // Récupère la largeur de l'écran

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3, // Ombres pour Android
      marginVertical: 16,
      width: '90%', // Largeur relative
      alignSelf: 'center',
    },
    thumb: {
      height: width * 0.5, // Largeur et hauteur basées sur la taille de l'écran
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      width: '100%',
    },
    infoContainer: {
      padding: 16,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      color: '#666',
      marginBottom: 8,
      textAlign: 'center',
    },
    itemContainerForm: {
      height: 70,
      width: '90%', // Largeur relative pour s'adapter aux tailles d'écran
      marginHorizontal: 16,
      borderWidth: 0.5,
      borderRadius: 10,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
    },
    column: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  });

  return (
    <View>
    <View style={[styles.itemContainerForm, { flexDirection: 'row', marginVertical: 15 }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}