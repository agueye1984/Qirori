
import React, {useEffect} from 'react'
import {Image, StyleSheet} from 'react-native'
import Background from '../components/Background';
import {useNavigation} from '@react-navigation/native'
import { useStore } from '../contexts/store';

const SplashScreen = () => {
  const [state] = useStore()
  const navigation = useNavigation()

  const styles = StyleSheet.create({
    img: {
      width: '51.5%',
      resizeMode: 'contain',
    },
  })

  useEffect(() => {
    setTimeout(() => {
    if (state.onboarding.didAgreeToTerms) {
      navigation.navigate('LoginScreen' as never)
     } else {
      navigation.navigate('TermsScreen' as never)
    }
  }, 5000);
  }, []);

  return (
    <Background>
      <Image source={require('../assets/logo.png')} style={styles.img} />
    </Background>
  )
};

export default SplashScreen;
