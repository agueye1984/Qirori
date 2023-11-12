import AsyncStorage from '@react-native-async-storage/async-storage'

import {LocalStorageKeys} from '../../constants'
import {Onboarding, Onboarding as OnboardingState, State, User, Event, Invitation, Contribution, Product, Service, Panier, Mail} from '../types'

enum OnboardingDispatchAction {
  DID_AGREE_TO_TERMS = 'onboarding/didAgreeToTerms',
}

enum UpdateSettingAction {
  UPDATE_LANGUAGE = 'language',
}

enum UserAction {
  ADD_USER = 'user',
  UPDATE_USER = 'update_user',
  SET_USERS= 'set_users',
}

enum EventAction {
  ADD_EVENT = 'add_event',
  UPDATE_EVENT='update_event',
  SET_EVENTS= 'set_events',
}

enum InviteAction {
  ADD_INVITE = 'add_invite',
  UPDATE_INVITE = 'update_invite',
  SET_INVITATIONS = 'set_invite',
}

enum DonationAction {
  ADD_DONATION = 'add_donation',
  UPDATE_DONATION = 'update_donation',
  SET_DONATIONS = 'set_donation',
}

enum VenteAction {
  ADD_PRODUCT = 'add_product',
  UPDATE_PRODUCT = 'update_product',
  DELETE_PRODUCT = 'delete_product',
  SET_PRODUCTS = 'set_products',
  ADD_SERVICE = 'add_service',
  UPDATE_SERVICE = 'update_service',
  DELETE_SERVICE = 'delete_service',
  SET_SERVICES = 'set_services',
}

enum CartAction {
  ADD_CART = 'add_cart',
  UPDATE_CART = 'update_cart',
  DELETE_CART = 'delete_cart',
  SET_CARTS = 'set_carts',
}

enum ContactUsAction {
  ADD_CONTACT_US = 'add_contact_us',
}




export type DispatchAction =
  | OnboardingDispatchAction
  | UpdateSettingAction
  | UserAction
  | EventAction
  | InviteAction
  | DonationAction
  | VenteAction
  | CartAction
  | ContactUsAction

export const DispatchAction = {
  ...OnboardingDispatchAction,
  ...UpdateSettingAction,
  ...UserAction,
  ...EventAction,
  ...InviteAction,
  ...DonationAction,
  ...VenteAction,
  ...CartAction,
  ...ContactUsAction,
}

export interface ReducerAction<R> {
  type: R
  payload?: Onboarding | string | User | Event | Invitation | Contribution | Product  | Service  | Panier | Mail | User[] | Event[] | Invitation[] | Contribution[] | Product[] | Service[] | Panier[] | Mail[]
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
    case UserAction.UPDATE_USER: {
      const user = action.payload as User
      const userIndex  = state.user.findIndex((req) => req.id === user.id)
      const newUser = [...state.user]
      newUser[userIndex] = user
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
      const newInvitation = [invitation, ...state.invitations]
      const newState = {
        ...state,
        invitations: newInvitation,
      }
      AsyncStorage.setItem(LocalStorageKeys.Invitations, JSON.stringify(newState.invitations))
      return newState
    }
    case InviteAction.UPDATE_INVITE: {
      const invitation = action.payload as Invitation
      const inviteIndex  = state.invitations.findIndex((req) => req.id === invitation.id)
      const newInvite = [...state.invitations]
      newInvite[inviteIndex] = invitation
      const newState = {
        ...state,
        invitations: newInvite,
      }
      AsyncStorage.setItem(LocalStorageKeys.Invitations, JSON.stringify(newState.invitations))
      return newState
    }
    case InviteAction.SET_INVITATIONS: {
      const invitations = action.payload
      const newState = {
        ...state,
        invitations,
      }
      return newState
    }
    case DonationAction.ADD_DONATION: {
      const donation = action.payload as Contribution
      const newDonattion = [donation, ...state.contributions]
      const newState = {
        ...state,
        contributions: newDonattion,
      }
      AsyncStorage.setItem(LocalStorageKeys.Contributions, JSON.stringify(newState.contributions))
      return newState
    }
    case DonationAction.SET_DONATIONS: {
      const contributions = action.payload
      const newState = {
        ...state,
        contributions,
      }
      return newState
    }
    case VenteAction.ADD_PRODUCT: {
      const product = action.payload as Product
      const newProduct = [product, ...state.products]
      const newState = {
        ...state,
        products: newProduct,
      }
      AsyncStorage.setItem(LocalStorageKeys.Products, JSON.stringify(newState.products))
      return newState
    }
    case VenteAction.SET_PRODUCTS: {
      const products = action.payload
      const newState = {
        ...state,
        products,
      }
      return newState
    }
    case VenteAction.ADD_SERVICE: {
      const service = action.payload as Service
      const newService = [service, ...state.services]
      const newState = {
        ...state,
        services: newService,
      }
      AsyncStorage.setItem(LocalStorageKeys.Services, JSON.stringify(newState.services))
      return newState
    }
    case VenteAction.SET_SERVICES: {
      const services = action.payload
      const newState = {
        ...state,
        services,
      }
      return newState
    }
    case CartAction.ADD_CART: {
      const cart = action.payload as Panier
      const newCart = [cart, ...state.carts]
      const newState = {
        ...state,
        carts: newCart,
      }
      AsyncStorage.setItem(LocalStorageKeys.Carts, JSON.stringify(newState.carts))
      return newState
    }
    case CartAction.UPDATE_CART: {
      const cart = action.payload as Panier
      const cartIndex  = state.carts.findIndex((req) => req.id === cart.id)
      const newCart = [...state.carts]
      newCart[cartIndex] = cart
      const newState = {
        ...state,
        carts: newCart,
      }
      AsyncStorage.setItem(LocalStorageKeys.Carts, JSON.stringify(newState.carts))
      return newState
    }
    case CartAction.DELETE_CART: {
      const cartId = action.payload
      const cartsFiltered: Panier[] = state.carts.filter((req) => req.id !== cartId)
      const newState = {
        ...state,
        carts: cartsFiltered,
      }
      AsyncStorage.setItem(LocalStorageKeys.Carts, JSON.stringify(newState.carts))
      return newState
    }
    case CartAction.SET_CARTS: {
      const carts = action.payload
      const newState = {
        ...state,
        carts,
      }
      return newState
    }
    case ContactUsAction.ADD_CONTACT_US: {
      const contactUs = action.payload as Mail
      const newContactUs = [contactUs, ...state.contactUs]
      const newState = {
        ...state,
        contactUs: newContactUs,
      }
      AsyncStorage.setItem(LocalStorageKeys.ContactUs, JSON.stringify(newState.contactUs))
      return newState
    }
    default:
      return state
  }
}
export default reducer
