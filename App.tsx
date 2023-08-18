import React, { useMemo } from 'react';
import { Provider } from 'react-native-paper';
import { theme } from './src/core/theme';
import {initStoredLanguage, translationResources, initLanguages} from './src/localization';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigators/RootStack';
import { StoreProvider } from './src/contexts/store';

initLanguages(translationResources)

const Main = () => {
  useMemo(() => {
    initStoredLanguage().then()
  }, [])

  return (
    <StoreProvider>
      <Provider theme={theme}>
      <NavigationContainer>
            <RootStack />
      </NavigationContainer>
    </Provider>
  </StoreProvider>
  )
};

export default Main;
