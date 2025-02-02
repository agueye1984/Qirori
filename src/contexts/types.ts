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
  userId: string
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
  AddEvent: {
    item: Event
    isEditing: boolean
  }
  EventDetails: {
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
    participantCount: number | null
  }
  AddProduct: {
    item: Product
    isEditing: boolean
  }
  AddService: {
    item: Service
    isEditing: boolean
  }
  CommandesEffectuees: {
    item: Commande
  }
  EditPanier: {
    item: Panier
  }
  AddTypeEvent: {
    item: TypeEvent
    isEditing: boolean
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
  AddCategory: {
    item: Category
    isEditing: boolean
  }
  AddTypeOffre: {
    item: TypeOffre
    isEditing: boolean
  }
  AddTypePrix: {
    item: TypePrix
    isEditing: boolean
  }
  AddProdServEvent:{
    id: string
    item?: ProdServEvent
    isEditing: boolean
  }
  ProdServEvents:{
    id: string
  }
}

export interface Invitation {
  id: string
  eventId: string
  reponse: string
  userId: string
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
  userId: string
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
  userId: string
  devise: string
  formules: any[]
  images: string[]
  actif: boolean
  formulesId: string[]
  conditions: string[]
  zone: string[]
}

export interface Service {
  id: string
  category: string
  name: string
  description: string
  userId: string
  images: string[]
  formules: any[]
  conditions: ScheduleState
  zone: string[]
  province: string
  region: string
  devise: string
  formulesId: string[]
}

export interface Panier {
  id: string
  qty: number
  name: string
  description: string
  prix: number
  devise: string
  tax: number
  formule: string
  totalPrice: number
  paid: boolean
  userId: string
  images: string
  vendorId: string
  dateDelivered: string
  statut: string
  commandeId: string
  type: string
}

export interface Mail {
  id: string
  subject: string
  message: string
  userId: string
}

export interface Commande {
  id: string
  paniers: Panier[]
  adresse: Adresse
  paymentId: string
  orderId: string
  statut: string
  dateDelivered: string
  userId: string
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
  userId: string
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

/* export interface Category {
  id: string
  name: string
} */

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
  category: string
  actif: boolean
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

export type Formula= {
  id: string;
  offers: string[];
  priceType: string;
  amount: string;
}

export interface Category {
  id: string
  nameFr: string
  nameEn: string
  actif: boolean
}

export interface TypePrix {
  id: string
  nameFr: string
  nameEn: string
  type: string
  actif: boolean
}

export interface Conditions {
  id: string
  nameFr: string
  nameEn: string
  category: string
  actif: boolean
}


export interface Vendeur {
  id: string
  name: string
  category: string
  adresse: Location
  province: string
  region: string
  zone: string[]
  idBusinessRegistre: string
  autreDocs: string
  confirme: boolean
  accepte: boolean
  userId: string
  actif: boolean
}

export interface ProdServEvent {
  id: string
  category: string
  formule: string
  eventId: string
  custom: string
  type: string
}

export interface Formule {
  id: string
  offer?: string
  offers?: string[]
  priceType: string
  quantity?: string
  amount: string
  category: string
  type: string
}

