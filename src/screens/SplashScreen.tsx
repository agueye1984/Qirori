import React, {useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useStore} from '../contexts/store';

const SplashScreen = () => {
  const [state] = useStore();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    img: {
      width: '51.5%',
      resizeMode: 'contain',
    },
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      maxWidth: 340,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  useEffect(() => {
    setTimeout(() => {
      if (state.onboarding.didAgreeToTerms) {
        navigation.navigate('LoginScreen' as never);
      } else {
        navigation.navigate('TermsScreen' as never);
      }
    }, 5000);
  }, [state.onboarding.didAgreeToTerms]);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.img} />
    </SafeAreaView>
  );
};

export default SplashScreen;
