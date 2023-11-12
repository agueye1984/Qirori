import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {createContext, Dispatch, useContext, useEffect, useReducer} from 'react'

import { defaultLanguage, LocalStorageKeys} from '../constants'

import _defaultReducer, {DispatchAction, ReducerAction} from './reducers/store'
import {State, User, Event, Invitation, Contribution, Product, Service, Panier, Mail} from './types'

type Reducer = <S extends State>(state: S, action: ReducerAction<any>) => S

interface StoreProviderProps {
  children: React.ReactNode
  initialState?: State
  reducer?: Reducer
}

export const UserList: User[] = [];
export const EventList: Event[] = [];
export const InvitationList: Invitation[] = [];
export const ContributionList: Contribution[]= [];
export const ProductList: Product[]= [];
export const ServiceList: Service[]= [];
export const CartList: Panier[]= [];
export const ContactUsList: Mail[]=[];


export const defaultState: State = {
  onboarding: {
    didAgreeToTerms: false,
  },
  language: defaultLanguage,
  user: UserList,
  events: EventList,
  invitations: InvitationList,
  contributions: ContributionList,
  products: ProductList,
  services: ServiceList,
  carts: CartList,
  contactUs: ContactUsList,
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

  useEffect(() => {
    const getInvitations = async () => {
      const invitesJSON = await AsyncStorage.getItem(LocalStorageKeys.Invitations)
      if (invitesJSON) {
        const invitations: Invitation[] = JSON.parse(invitesJSON)
        dispatch({
          type: DispatchAction.SET_INVITATIONS,
          payload: invitations,
        })
      }
    }
    getInvitations()
  }, [])

  useEffect(() => {
    const getContributions = async () => {
      const donationJSON = await AsyncStorage.getItem(LocalStorageKeys.Contributions)
      if (donationJSON) {
        const contributions: Contribution[] = JSON.parse(donationJSON)
        dispatch({
          type: DispatchAction.SET_DONATIONS,
          payload: contributions,
        })
      }
    }
    getContributions()
  }, [])

  useEffect(() => {
    const getProducts = async () => {
      const productJSON = await AsyncStorage.getItem(LocalStorageKeys.Products)
      if (productJSON) {
        const products: Product[] = JSON.parse(productJSON)
        dispatch({
          type: DispatchAction.SET_PRODUCTS,
          payload: products,
        })
      }
    }
    getProducts()
  }, [])

  useEffect(() => {
    const getServices = async () => {
      const serviceJSON = await AsyncStorage.getItem(LocalStorageKeys.Services)
      if (serviceJSON) {
        const services: Service[] = JSON.parse(serviceJSON)
        dispatch({
          type: DispatchAction.SET_SERVICES,
          payload: services,
        })
      }
    }
    getServices()
  }, [])

  useEffect(() => {
    const getCarts = async () => {
      const cartJSON = await AsyncStorage.getItem(LocalStorageKeys.Carts)
      if (cartJSON) {
        const carts: Panier[] = JSON.parse(cartJSON)
        dispatch({
          type: DispatchAction.SET_CARTS,
          payload: carts,
        })
      }
    }
    getCarts()
  }, [])

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>
}

export const useStore = <S extends State>(): [S, Dispatch<ReducerAction<any>>] => {
  const context = useContext(StoreContext)

  return context as unknown as [S, Dispatch<ReducerAction<any>>]
}
