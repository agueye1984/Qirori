import AsyncStorage from '@react-native-async-storage/async-storage'

import {LocalStorageKeys} from '../../constants'
import {Onboarding, Onboarding as OnboardingState, State, User, Event, Invitation} from '../types'

enum OnboardingDispatchAction {
  DID_AGREE_TO_TERMS = 'onboarding/didAgreeToTerms',
}

enum UpdateSettingAction {
  UPDATE_LANGUAGE = 'language',
}

enum UserAction {
  ADD_USER = 'user',
  SET_USERS= 'set_users',
}

enum EventAction {
  ADD_EVENT = 'add_event',
  UPDATE_EVENT='update_event',
  SET_EVENTS= 'set_events',
}

enum InviteAction {
  ADD_INVITE = 'add_invite',
}


export type DispatchAction =
  | OnboardingDispatchAction
  | UpdateSettingAction
  | UserAction
  | EventAction
  | InviteAction

export const DispatchAction = {
  ...OnboardingDispatchAction,
  ...UpdateSettingAction,
  ...UserAction,
  ...EventAction,
  ...InviteAction,
}

export interface ReducerAction<R> {
  type: R
  payload?: Onboarding | string | User | Event | Invitation | User[] | Event[]
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
    case UserAction.ADD_USER: {
      const user = action.payload as User
      const newUser = [user, ...state.user]
      const newState = {
        ...state,
        user: newUser,
      }
      AsyncStorage.setItem(LocalStorageKeys.User, JSON.stringify(newState.user))
      return newState
    }
    case UserAction.SET_USERS: {
      const user = action.payload
      const newState = {
        ...state,
        user,
      }
      return newState
    }
    case EventAction.ADD_EVENT: {
      const event = action.payload as Event
      const newEvent = [event, ...state.events]
      const newState = {
        ...state,
        events: newEvent,
      }
      AsyncStorage.setItem(LocalStorageKeys.Events, JSON.stringify(newState.events))
      return newState
    }
    case EventAction.SET_EVENTS: {
      const events = action.payload
      const newState = {
        ...state,
        events,
      }
      return newState
    }
    case EventAction.UPDATE_EVENT: {
      const event = action.payload as Event
      const eventIndex  = state.events.findIndex((req) => req.id === event.id)
      const newEvent = [...state.events]
      newEvent[eventIndex] = event
      const newState = {
        ...state,
        events: newEvent,
      }
      AsyncStorage.setItem(LocalStorageKeys.Events, JSON.stringify(newState.events))
      return newState
    }
    case InviteAction.ADD_INVITE: {
      const invitation = action.payload as Invitation
      const newInvitation = [invitation, ...state.events]
      const newState = {
        ...state,
        events: newInvitation,
      }
      AsyncStorage.setItem(LocalStorageKeys.Invitations, JSON.stringify(newState.events))
      console.log(newState)
      return newState
    }
    default:
      return state
  }
}

export default reducer
