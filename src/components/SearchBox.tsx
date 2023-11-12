import React, { useState } from 'react';
import {View, Pressable, TextInput} from 'react-native';
import {scale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import { theme } from '../core/theme';

type Props = {
    autoFocus?: boolean
    onFoucs?: () => void
    hideCamra?: boolean
    onRightIconPress?: () => void
    rightIcon?: string
  }

export const SearchBox = ({autoFocus,onFoucs, hideCamra, onRightIconPress,rightIcon}: Props) =>{
  const [search, setSearch] = useState('')
  return (
    <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems:'center',}}>
      <View
        style={{
          flex:1,
          paddingHorizontal: scale(20),
          borderRadius: scale(20),
          alignItems: 'center',
          backgroundColor: theme.colors.white,
          //width: '100%',
          flexDirection: 'row',
          height: scale(40),
        }}>
        <Feather name="search" size={scale(20)} color={theme.colors.black} />
        <TextInput 
        autoFocus={autoFocus}
          onFocus={onFoucs}
          style={{flex: 1, paddingLeft: scale(10)}}
          placeholder='Search'
          value={search}
          onChangeText={text => setSearch(text)}
        />
      </View>
      {!hideCamra && (
        <Pressable
          onPress={onRightIconPress}
          style={{
            borderRadius: scale(20),
            width: scale(40),
            height: scale(40),
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft:scale(20)
          }}>
          <Feather name={rightIcon ? rightIcon :"camera"} size={scale(18)} color={theme.colors.white} />
        </Pressable>
      )}
    </View>
  );
}
