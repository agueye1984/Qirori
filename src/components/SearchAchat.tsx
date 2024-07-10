import React, {useState} from 'react';
import {
  View,
  TextInput,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type Props = {
  searchPlaceholder: string;
  onChangeText: (text: any) => void;
};

export const SearchAchat = ({searchPlaceholder, onChangeText}: Props) => {
  const [name, setName] = useState('');


  const handleName = (text: string) => {
    setName(text);
    onChangeText(text);
  };

  const styles = StyleSheet.create({
    container: {
      height: 40,
      borderRadius: 5,
      backgroundColor: '#ddd',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 5,
      marginTop: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputStyle: {
      alignSelf: 'center',
      marginLeft: 5,
      height: 40,
      fontSize: 14,
      width:250,
    },
    leftIconStyle: {
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    rightContainer: {
      flexDirection: 'row',
      width:250,
    },
    rightIconStyle: {
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    activityIndicator: {
      marginRight: 5,
    },
  });

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback>
        <Animated.View style={styles.container}>
          <TextInput
            onChangeText={text => handleName(text)}
            placeholder={searchPlaceholder}
            style={styles.inputStyle}
            placeholderTextColor="#515151"
            //autoCorrect={false}
            value={name}
            onChange={onChangeText}
          />
         
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
