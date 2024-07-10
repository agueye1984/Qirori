import {StyleSheet} from 'react-native'
import {useTheme} from './contexts/theme'
import {widthPercentageToDP as widthToDp, heightPercentageToDP as heightToDp} from 'react-native-responsive-screen'
import { theme } from './core/theme'

const DefaultComponentsThemes = () => {
  const {ColorPallet} = useTheme()
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    text: {
      color: ColorPallet.primaryText,
      fontSize: 16,
    },
    requestDetailsTitle: {
      color: ColorPallet.primaryText,
      fontWeight: '700',
      fontSize: 18,
    },
    requestDetailsBody: {
      color: ColorPallet.primaryText,
      fontWeight: '400',
      fontSize: 16,
    },
    attributePredicate: {
      fontWeight: '600',
    },
    note: {
      color: ColorPallet.primaryText,
      fontWeight: '400',
      fontSize: 14,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    link: {
      color: ColorPallet.link,
      fontWeight: '600',
      fontSize: 14,
    },
    tabBarActive: {
      borderTopWidth: 2,
      borderTopColor: ColorPallet.primary,
    },
    tabBarIcone: {
      padding: 8,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemContainer: {
      marginHorizontal: 15,
      borderBottomWidth: 0.2,
      borderBottomStyle: 'solid',
      paddingBottom: 10,
    },
    touchableStyle: {
      flex: 1,
      height: '100%',
      paddingTop: 10,
      flexDirection: 'row',
    },
    rightSectRowContainer: {
      flex: 2,
      alignItems: 'flex-start',
      flexDirection: 'row-reverse',
    },
    leftSectRowContainer: {
      flex: 1,
      alignItems: 'flex-end',
      flexDirection: 'row',
    },
    buttonsContainer: {
      paddingBottom: 10,
      paddingTop: 24,
    },
    section: {
      marginHorizontal: 10,
      paddingVertical: 5,
    },
    row: {
      flexDirection: 'row',
      marginTop: 4,
    },
    error: {
      color: 'red',
      marginTop: 5,
    },
    phoneInputContainer: {
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
    },
    phoneInputTextContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
    button: {
      flex: 1,
      marginHorizontal: 10,
    },
    bottomButtonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff', // Adjust background color as needed
      padding: 15,
      borderTopWidth: 1,
      borderColor: '#ccc', // Optional: Add a border color
    },
    itemContainerForm: {
      height: 50,
      marginHorizontal: 5,
      borderWidth: 0.3,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    buttonContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%'
    },
    rowCart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthToDp(90),
      marginTop: 10,
    },
    total: {
      borderTopWidth: 1,
      paddingTop: 10,
      borderTopColor: '#E5E5E5',
      marginBottom: 10,
    },
    cartTotalText: {
      fontSize: widthToDp(4.5),
      color: '#989899',
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 80, // Add padding to the bottom to make space for the fixed button
    },
    address: {
      marginHorizontal: widthToDp(5),
    },
    payment: {
      marginHorizontal: widthToDp(5),
      marginTop: heightToDp(2),
      marginBottom: heightToDp(1),
    },
    shipping: {
      marginHorizontal: widthToDp(5),
    },
    titleCheckout: {
      fontSize: widthToDp(4.5),
    },
    shippingOption: {
      marginTop: heightToDp(2),
    },
    itemContainerFormCheckout: {
      height: 100,
      marginHorizontal: 5,
      borderWidth: 0.4,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    itemContainerForm1: {
      height: 200,
      marginHorizontal: 5,
      borderWidth: 0.4,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    spinner: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    rowContact: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: widthToDp(90),
      marginTop: 10,
    },
    switchContainer: {
      width: 120,
      height: 40,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
    },
    switchEnabled: {
      backgroundColor: '#33F3FF', // Vert pour Oui
    },
    switchDisabled: {
      backgroundColor: '#FF9333', // Rouge pour Non
    },
    iconTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    switchText: {
      color: '#ffffff',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    switchArgent: {
      backgroundColor: 'yellow', // Vert pour Oui
    },
    switchNature: {
      backgroundColor: 'blue', // Rouge pour Non
    },
    switchContainerType: {
      width: 120,
      height: 40,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
    },
    switchTextDark: {
      color: '#000000',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    labelContainer: {
      width: 100, // Ajustez cette valeur pour correspondre à la longueur de vos textes
    },
    containerStyleName: {
      borderColor: ColorPallet.lightGray,
      borderWidth: 1,
    },
    itemContainerDateEvent: {
      height: 70,
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      backgroundColor: 'white',
    },
    contactCon: {
      flex: 1,
      flexDirection: 'row',
      padding: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: '#d9d9d9',
    },
    contactDat: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 5,
    },
    txt: {
      fontSize: 16,
      color: theme.colors.black,
    },
    name: {
      fontSize: 16,
      color: ColorPallet.primary,
      fontWeight: 'bold',
    },
    containerPieChart: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    icon: {
      margin: 2,
      marginVertical: 20,
    },
    center: {
      flexDirection: 'row',
      padding: 7,
      paddingHorizontal: 10,
      borderRadius: 20,
    },
    input: {
      width: 50,
      backgroundColor: theme.colors.surface,
    },
    itemContainerFormInvite: {
      height: '100%',
      marginHorizontal: 5,
      borderWidth: 0.3,
      flex: 1,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
  })
}

export default DefaultComponentsThemes
