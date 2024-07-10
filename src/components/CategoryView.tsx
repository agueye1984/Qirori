import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';


type Props = {
  name: string
  onPress: () => void
}

export const CategoryView = ({ name, onPress }: Props) => {

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
      //fontWeight: 'bold',
      
    },
    price: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    itemContainerForm: {
      height: 70,
      width:350,
      marginHorizontal: 5,
      borderWidth: 0.5,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
      alignContent:'center',
      alignItems:'center',
      alignSelf:'center',
      justifyContent:'center'
    },
    column: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return (
    <View>
      <View style={[styles.itemContainerForm, { flexDirection: 'row', marginVertical:15, marginHorizontal:15}]}>
      <TouchableOpacity onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}