import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {defaultLanguage, LocalStorageKeys} from '../constants';

import _defaultReducer, {DispatchAction, ReducerAction} from './reducers/store';
import {
  State,
} from './types';

type Reducer = <S extends State>(state: S, action: ReducerAction<any>) => S;

interface StoreProviderProps {
  children: React.ReactNode;
  initialState?: State;
  reducer?: Reducer;
}

export const defaultState: State = {
  onboarding: {
    didAgreeToTerms: false,
  },
  language: defaultLanguage,
  currency: 'CAD',
  country: 'CA',
  didAgreeTermVendor: false,

};

export const StoreContext = createContext<
  [State, Dispatch<ReducerAction<any>>]
>([
  defaultState,
  () => {
    return;
  },
]);

export const defaultReducer = _defaultReducer;

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  initialState,
  reducer,
}) => {
  const _reducer = reducer ?? defaultReducer;
  const _state = initialState ?? defaultState;
  const [state, dispatch] = useReducer(_reducer, _state);

  useEffect(() => {
    const getAgreeTerms = async () => {
      const onboarding = await AsyncStorage.getItem(
        LocalStorageKeys.Onboarding,
      );
      if (onboarding) {
        dispatch({
          type: DispatchAction.DID_AGREE_TO_TERMS,
        });
      }
    };
    getAgreeTerms();
  }, []);

  useEffect(() => {
    const getLanguage = async () => {
      const language = await AsyncStorage.getItem(LocalStorageKeys.Language);
      if (language) {
        dispatch({
          type: DispatchAction.UPDATE_LANGUAGE,
          payload: language,
        });
      }
    };
    getLanguage();
  }, []);

  useEffect(() => {
    const getCurrency = async () => {
      const currency = await AsyncStorage.getItem(LocalStorageKeys.Currency);
      if (currency) {
        dispatch({
          type: DispatchAction.UPDATE_CURRENCY,
          payload: currency,
        });
      }
    };
    getCurrency();
  }, []);

  useEffect(() => {
    const getCountry = async () => {
      const country = await AsyncStorage.getItem(LocalStorageKeys.Country);
      if (country) {
        dispatch({
          type: DispatchAction.UPDATE_COUNTRY,
          payload: country,
        });
      }
    };
    getCountry();
  }, []);

    useEffect(() => {
    const getAgreeTermsVendor = async () => {
      const didAgree = await AsyncStorage.getItem(
        LocalStorageKeys.AgreeTermVendor,
      );
      if (didAgree) {
        dispatch({
          type: DispatchAction.DID_AGREE_TERMS_VENDOR,
        });
      } 
    };
    getAgreeTermsVendor();
  }, []);  

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = <S extends State>(): [
  S,
  Dispatch<ReducerAction<any>>,
] => {
  const context = useContext(StoreContext);

  return context as unknown as [S, Dispatch<ReducerAction<any>>];
};
