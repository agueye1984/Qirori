import AsyncStorage from '@react-native-async-storage/async-storage'

import {LocalStorageKeys} from '../../constants'
import {Onboarding, Onboarding as OnboardingState, State, User, Event} from '../types'

enum OnboardingDispatchAction {
  DID_AGREE_TO_TERMS = 'onboarding/didAgreeToTerms',
}

enum UpdateSettingAction {
  UPDATE_LANGUAGE = 'language',
}

enum AddUserAction {
  ADD_USER = 'user',
}

enum EventAction {
  ADD_EVENT = 'add_event',
  UPDATE_EVENT='update_event',
}


export type DispatchAction =
  | OnboardingDispatchAction
  | UpdateSettingAction
  | AddUserAction
  | EventAction

export const DispatchAction = {
  ...OnboardingDispatchAction,
  ...UpdateSettingAction,
  ...AddUserAction,
  ...EventAction,
}

export interface ReducerAction<R> {
  type: R
  payload?: Onboarding | string | User | Event
}

export const reducer = <S extends State>(state: S, action: ReducerAction<DispatchAction>): S => {
  switch (action.type) {
    case OnboardingDispatchAction.DID_AGREE_TO_TERMS: {
      const onboarding: OnboardingState = {
        ...state.onboarding,
        didAgreeToTerms: true,
      }
      const newState = {
        ...state,
        onboarding,
      }
      
      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(newState.onboarding))
      return newState
    }
    case UpdateSettingAction.UPDATE_LANGUAGE: {
      const language = action.payload
      const newState = {
        ...state,
        language: language,
      }
      AsyncStorage.setItem(LocalStorageKeys.Language, language?.toString() ?? '')
      return newState
    }
    case AddUserAction.ADD_USER: {
      const user = action.payload as User
      const userIndex  = state.user.findIndex((req) => req.email === user.email)
      const newUser = [...state.user]
      newUser[userIndex+1] = user
      const newState = {
        ...state,
        user: newUser,
      }
      AsyncStorage.setItem(LocalStorageKeys.User, JSON.stringify(newState.user))
      return newState
    }
    case EventAction.ADD_EVENT: {
      const event = action.payload as Event
      const eventIndex  = state.events.findIndex((req) => req.name === event.name)
      const newEvent = [...state.events]
      newEvent[eventIndex+1] = event
      console.log(newEvent)
      console.log(eventIndex)
      console.log(event)
      const newState = {
        ...state,
        events: newEvent,
      }
      AsyncStorage.setItem(LocalStorageKeys.Events, JSON.stringify(newState.events))
      console.log(newState)
      return newState
    }
    default:
      return state
  }
}

export default reducer
