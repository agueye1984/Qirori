import React from 'react'
import { ScrollView, StyleSheet, Text, View,SafeAreaView, ViewStyle } from 'react-native'
import { scale } from 'react-native-size-matters'

type Props = {
    children?: React.ReactNode
    isScrollable?: boolean
    style?: ViewStyle
}

export const Container = ({children,isScrollable,style}: Props) =>{
    return (
        <SafeAreaView  style={styles.container}>
            {
                isScrollable? <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
                    <View style={[styles.innerView,style]}>
                        {children}
                    </View>
                </ScrollView>
                :
                <View style={[styles.innerView,style]}>{children}</View>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    innerView:{
        flex:1,
        paddingHorizontal:scale(20)
    }
})
