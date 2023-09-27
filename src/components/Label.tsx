import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { scale } from 'react-native-size-matters'
import { TextStyle } from 'react-native'
import { theme } from '../core/theme';

type Props = {
    text?: string
    style?: TextStyle
  }

export const Label = ({text,style}: Props) => {
    return (
    <Text style={[styles.label,style]}>{text}</Text>
    )
}

const styles = StyleSheet.create({
    label:{
        fontSize:scale(16),
        color:theme.colors.black,
        
    }
})