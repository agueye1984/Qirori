import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {createContext, Dispatch, useContext, useEffect, useReducer} from 'react'

import { defaultLanguage, LocalStorageKeys} from '../constants'

import _defaultReducer, {DispatchAction, ReducerAction} from './reducers/store'
import {State, User, Event} from './types'

type Reducer = <S extends State>(state: S, action: ReducerAction<any>) => S

interface StoreProviderProps {
  children: React.ReactNode
  initialState?: State
  reducer?: Reducer
}

export const UserList: User[] = [];
export const EventList: Event[] = [];

export const defaultState: State = {
  onboarding: {
    didAgreeToTerms: false,
  },
  language: defaultLanguage,
  user: UserList,
  events: EventList,
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

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>
}

export const useStore = <S extends State>(): [S, Dispatch<ReducerAction<any>>] => {
  const context = useContext(StoreContext)

  return context as unknown as [S, Dispatch<ReducerAction<any>>]
}
