export interface Onboarding {
  didAgreeToTerms: boolean
}

export interface State {
  onboarding: Onboarding
  language: String
  currency: String
  country: String
  didAgreeTermVendor: boolean
}

export interface User {
  id: string
  email: string
  phoneNumber: string
  password: string
  displayName: string
  profilId: string
  vendor: boolean
  actif: boolean
}

export interface Profil {
  id: string
  name: string
}

export interface Accueil {
  id: string
  title: string
  route: string
  images: string
}

export interface Event {
  id: string
  name: string
  description: string
  userId: string | null
  dateDebut: string
  heureDebut: string
  dateFin: string
  heureFin: string
  localisation: Location
}

export interface Location {
  placeId: string
  description: string
}

export type ManageEventsParamList = {
  ManageEvents: undefined
  AddEvent: undefined
  EventDetails: {
    item: Event
  }
  EditEvent: {
    item: Event
  }
  InvitationsContacts: {
    item: Event
  }
  Invitations: {
    item: Event
  }
  InvitationDetails: {
    item: Invitation
  }
  ContributionsDetails: {
    item: Invitation
  }
  ProductDetails: {
    item: Product
  }
  ResetPassword: {
    user: any
  }
  ContactsList: {
    item: Event
  }
  ServicesOffertsList: {
    item: string
  }
  ServiceDetails: {
    item: Service
  }
  EditProduct: {
    item: Product
  }
  EditService: {
    item: Service
  }
  CommandesEffectuees: {
    item: Commande
  }
  EditPanier: {
    item: Panier
  }
  EditTypeEvent: {
    item: TypeEvent
  }
  OTPAuthScreen: {
    code: string
  }
  OTPForgotPwdScreen: {
    confirmResult: any
  }
  RatingScreen: {
    item: Commande
  }
  PaymentScreen: {
    mnt: string
    item: any
    type: string
  }
}

export interface Invitation {
  id: string
  eventId: string
  reponse: string
  userId: string | null
  nbrAdultes: number
  numeroTelephone: string
  nbrEnfants?: number
  AgeEnfants?: AgeEnfant[]
  closeDonation: boolean
}

export interface AgeEnfant {
  age: number
}

export interface Contribution {
  id: string
  eventId: string
  nature?: string
  userId: string | null
  contribution: string
  Produits?: Product[]
  montant: number
  paymentId?: string
}

export interface Product {
  id: string
  category: string
  name: string
  description: string
  userId: string | null
  devise: string
  quantite: number
  prixUnitaire: number
  images: string
  actif: boolean
}

export interface Service {
  id: string
  category: string
  name: string
  description: string
  userId: string | null
  images: string[]
  offres: Offre[]
  conditions: ScheduleState
  zone: string[]
  province: string
  region: string
  typePrix: string
}

export interface Panier {
  id: string
  qty: number
  product: string
  name: string
  description: string
  prix: number
  devise: string
  tax: number
  offre: string
  totalPrice: number
  paid: boolean
  userId: string | null
  images: string
  vendorId: string
  dateDelivered: string
  statut: string
  commandeId: string
}

export interface Mail {
  id: string
  subject: string
  message: string
  userId: string | null
}

export interface Commande {
  id: string
  paniers: Panier[]
  adresse: Adresse
  paymentId: string
  orderId: string
  statut: string
  dateDelivered: string
  userId: string | null
  rating: number
  avis: string
}

export interface Adresse {
  id: string
  address_line_1: string
  address_line_2: string
  city: string
  province: string
  postalCode: string
  countryCode: string
  userId: string | null
}

export interface PredictionType {
  description: string
  place_id: string
  reference: string
  matched_substrings: any[]
  tructured_formatting: Object
  terms: Object[]
  types: string[]
}

export interface Offre {
  id: string
  typeOffre: string
  name: string
  typeMontant: string
  montant: number
  devise: string
  images: string
}

export interface Category {
  id: string
  name: string
}

export interface Select {
  key: string
  value: string
}

export interface TypeEvent {
  id: string
  nameFr: string
  nameEn: string
  userId: string
}

export interface TypeOffre {
  id: string
  nameFr: string
  nameEn: string
  userId: string
}
export interface TypeCondition {
  id: string
  nameFr: string
  nameEn: string
  userId: string
}

export type DaySchedule = {
  startTime: string;
  endTime: string;
  capacity: string;
};

export type ScheduleState = {
  [key: string]: DaySchedule;
};
