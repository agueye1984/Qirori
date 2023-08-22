import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {createContext, Dispatch, useContext, useEffect, useReducer} from 'react'

import { defaultLanguage, LocalStorageKeys} from '../constants'

import _defaultReducer, {DispatchAction, ReducerAction} from './reducers/store'
import {State, User, Event, Invitation} from './types'

type Reducer = <S extends State>(state: S, action: ReducerAction<any>) => S

interface StoreProviderProps {
  children: React.ReactNode
  initialState?: State
  reducer?: Reducer
}

export const UserList: User[] = [];
export const EventList: Event[] = [];
export const InvitationList: Invitation[] = [];

export const defaultState: State = {
  onboarding: {
    didAgreeToTerms: false,
  },
  language: defaultLanguage,
  user: UserList,
  events: EventList,
  invitations: InvitationList,
}

export const StoreContext = createContext<[State, Dispatch<ReducerAction<any>>]>([
  defaultState,
  () => {
    return
  },
])

export const defaultReducer = _defaultReducer

export const StoreProvider: React.FC<StoreProviderProps> = ({children, initialState, reducer}) => {
  const _reducer = reducer ?? defaultReducer
  const _state = initialState ?? defaultState
  const [state, dispatch] = useReducer(_reducer, _state)

  useEffect(() => {
    const getAgreeTerms = async () => {
      const onboarding = await AsyncStorage.getItem(LocalStorageKeys.Onboarding)
      if (onboarding) {
        dispatch({
          type: DispatchAction.DID_AGREE_TO_TERMS,
        })
      }
    }
    getAgreeTerms()
  }, [])

  useEffect(() => {
    const getLanguage = async () => {
      const language = await AsyncStorage.getItem(LocalStorageKeys.Language)
      if (language) {
        dispatch({
          type: DispatchAction.UPDATE_LANGUAGE,
          payload: language,
        })
      }
    }
    getLanguage()
  }, [])

  useEffect(() => {
    const getUsers = async () => {
      const usersJSON = await AsyncStorage.getItem(LocalStorageKeys.User)
      if (usersJSON) {
        const users: User[] = JSON.parse(usersJSON)
        dispatch({
          type: DispatchAction.SET_USERS,
          payload: users,
        })
      }
    }
    getUsers()
  }, [])

  useEffect(() => {
    const getEvents = async () => {
      const eventsJSON = await AsyncStorage.getItem(LocalStorageKeys.Events)
      if (eventsJSON) {
        const events: Event[] = JSON.parse(eventsJSON)
        dispatch({
          type: DispatchAction.SET_EVENTS,
          payload: events,
        })
      }
    }
    getEvents()
  }, [])

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>
}

export const useStore = <S extends State>(): [S, Dispatch<ReducerAction<any>>] => {
  const context = useContext(StoreContext)

  return context as unknown as [S, Dispatch<ReducerAction<any>>]
}
