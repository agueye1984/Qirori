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

export const SearchBar = ({searchPlaceholder, onChangeText}: Props) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [contactName, setContactName] = useState('');

  const clear = () => {
    setContactName('');
    onChangeText('');
  };

  const handleContactName = (text: string) => {
    setContactName(text);
    onChangeText(text);
    setIsEmpty(text === '');
  };

  const getHasFocus = () => {
    setHasFocus(true);
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
      flex: hasFocus ? 1 : 0,
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
          <View style={styles.leftIconStyle}>
            <Text>🔍</Text>
          </View>
          <TextInput
            onChangeText={text => handleContactName(text)}
            placeholder={searchPlaceholder}
            style={styles.inputStyle}
            placeholderTextColor="#515151"
            autoCorrect={false}
            value={contactName}
            onFocus={getHasFocus}
          />
          <View style={styles.rightContainer}>
            {hasFocus ? (
              <ActivityIndicator
                key="loading"
                style={styles.activityIndicator}
                color="#515151"
              />
            ) : (
              <View />
            )}
            {hasFocus && !isEmpty ? (
              <TouchableOpacity onPress={clear}>
                <View style={styles.rightIconStyle}>
                  <Text>ⅹ</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
