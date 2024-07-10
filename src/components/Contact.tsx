import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Props = {
  contact: any;
  color: string;
};

const Contact = ({contact, color}: Props) => {
  const styles = StyleSheet.create({
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    imgCon: {},
    placeholder: {
      width: 55,
      height: 55,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: '#d9d9d9',
      alignItems: 'center',
      justifyContent: 'center',
      color: color,
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 18,
      color: color,
    },
    name: {
      fontSize: 16,
      color: color,
    },
    phoneNumber: {
      color: '#888',
    },
  });

  return (
    <View style={styles.contactCon}>
      <View style={styles.imgCon}>
        <View style={styles.placeholder}>
          <Text style={styles.txt}>
            {contact == null ? '' : contact.givenName[0]}
          </Text>
        </View>
      </View>
      <View style={styles.contactDat}>
        <Text style={styles.name}>
          {contact == null ? '' : contact.givenName}{' '}
          {contact == null
            ? ''
            : contact.middleName && contact.middleName + ' '}
          {contact == null ? '' : contact.familyName}
        </Text>
        <Text style={styles.phoneNumber}>
          {contact.phoneNumbers[0] == null
            ? ''
            : contact.phoneNumbers[0].number}
        </Text>
      </View>
    </View>
  );
};

export default Contact;
