import AsyncStorage from '@react-native-async-storage/async-storage';

import {LocalStorageKeys} from '../../constants';
import {
  Onboarding,
  Onboarding as OnboardingState,
  State,
} from '../types';

enum OnboardingDispatchAction {
  DID_AGREE_TO_TERMS = 'onboarding/didAgreeToTerms',
}

enum UpdateSettingAction {
  UPDATE_LANGUAGE = 'language',
  UPDATE_CURRENCY='currency',
  UPDATE_COUNTRY='country',
}

enum AgreeTermsVendor {
  DID_AGREE_TERMS_VENDOR = 'termsVendor',
}




export type DispatchAction =
  | OnboardingDispatchAction
  | AgreeTermsVendor
  | UpdateSettingAction;

export const DispatchAction = {
  ...OnboardingDispatchAction,
  ...AgreeTermsVendor,
  ...UpdateSettingAction,
};

export interface ReducerAction<R> {
  type: R;
  payload?:
    | Onboarding
    | string
    | string
    | string
    | boolean;
}

export const reducer = <S extends State>(
  state: S,
  action: ReducerAction<DispatchAction>,
): S => {
  switch (action.type) {
    case OnboardingDispatchAction.DID_AGREE_TO_TERMS: {
      const onboarding: OnboardingState = {
        ...state.onboarding,
        didAgreeToTerms: true,
      };
      const newState = {
        ...state,
        onboarding,
      };

      AsyncStorage.setItem(
        LocalStorageKeys.Onboarding,
        JSON.stringify(newState.onboarding),
      );
      return newState;
    }
    case UpdateSettingAction.UPDATE_LANGUAGE: {
      const language = action.payload;
      const newState = {
        ...state,
        language: language,
      };
      AsyncStorage.setItem(
        LocalStorageKeys.Language,
        language?.toString() ?? '',
      );
      return newState;
    }

    case UpdateSettingAction.UPDATE_CURRENCY: {
      const currency = action.payload;
      const newState = {
        ...state,
        currency: currency,
      };
      AsyncStorage.setItem(
        LocalStorageKeys.Currency,
        currency?.toString() ?? '',
      );
      return newState;
    }
    case UpdateSettingAction.UPDATE_COUNTRY: {
      const country = action.payload;
      const newState = {
        ...state,
        country: country,
      };
      AsyncStorage.setItem(
        LocalStorageKeys.Country,
        country?.toString() ?? '',
      );
      return newState;
    }

      case AgreeTermsVendor.DID_AGREE_TERMS_VENDOR: {
      const newState = {
        ...state,
        didAgreeTermVendor: true,
      };
      AsyncStorage.setItem(
        LocalStorageKeys.AgreeTermVendor,
        JSON.stringify(newState.didAgreeTermVendor),
      );
      return newState;
    }  
  
    default:
      return state;
  }
};
export default reducer;
