import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
    View,
    TextInput,
    UIManager,
    LayoutAnimation,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    StyleSheet,
    ViewStyle
} from "react-native";
import BackgroundContents from "./BackgroundContents";
import { useStore } from "../contexts/store";
import DefaultComponentsThemes from "../defaultComponentsThemes";
import { useTheme } from "../contexts/theme";
import { useNavigation } from "@react-navigation/native";
import Header from "./Header";
import { useTranslation } from "react-i18next";

type Props = {
    searchPlaceholder: "Search",
    onChangeText: (text:any) => void,
}

export const SearchBar = ({ searchPlaceholder, onChangeText }: Props) => {
    const [, dispatch] = useStore()
    const defaultStyles = DefaultComponentsThemes()
    const { ColorPallet } = useTheme()
    const navigation = useNavigation()
    const { t } = useTranslation()
    const [hasFocus, setHasFocus] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [showLoader, setShowLoader] = useState(false)
    const [contactName, setContactName] = useState('')

    

    const getShowLoader = () => {
        setShowLoader(true);
    };

    const hideLoader = () => {
        setShowLoader(false);
    };

    const clear = () => {
        setContactName('');
        onChangeText('')
    };

    const handleContactName = (text: string) => {
        setContactName(text)
        onChangeText(text)
        setIsEmpty(text === "")
    };

    const getHasFocus = () => {
        setHasFocus(true);
    };


    const styles = StyleSheet.create({
        container: {
            height: 40,
            borderRadius: 5,
            backgroundColor: "#ddd",
            marginLeft: 10,
            marginRight: 10,
            marginBottom: 5,
            marginTop: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        },
        inputStyle: {
            alignSelf: "center",
            marginLeft: 5,
            height: 40,
            fontSize: 14,
            flex: hasFocus ? 1 : 0,
        },
        leftIconStyle: {
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8
        },
        rightContainer: {
            flexDirection: "row"
        },
        rightIconStyle: {
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8
        },
        activityIndicator: {
            marginRight: 5
        }
    });

    const inputStyleCollection = [styles.inputStyle];

    return (
        <BackgroundContents>
            <Header>{t('AddEvent.title')}</Header>
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
                        {hasFocus && showLoader ? (
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
        </BackgroundContents>
    )
}