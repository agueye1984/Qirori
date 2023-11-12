export interface Onboarding {
  didAgreeToTerms: boolean
}

export interface State {
  onboarding: Onboarding
  user: User[]
  language: String
  events: Event[]
  invitations: Invitation[]
  contributions: Contribution[]
  products: Product[]
  services: Service[]
  carts: Panier[]
  contactUs: Mail[]
}

export interface User {
  id: string
  email: string
  phone: string
  password: string
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

export type Location = {
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
  },
  ResetPassword: {
    userId: string
  },
  ContactsList: {
    item: Event
  },
  ServicesOffertsList: {
    item: string
  },
  ServiceDetails: {
    item: Service
  },
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
}

export interface Product {
  id: string
  name: string
  description: string
  userId: string | null 
  devise: string
  quantite: number
  prixUnitaire: number
  images: string
}

export interface Service {
  id: string
  category: string
  name: string
  description: string
  userId: string | null 
  images: string
  offres: Offre[]
}

export interface Panier {
  id:string,
  qty: number,
  product: string,
  totalPrice: number,
  paid: boolean,
  userId: string | null
}

export interface Mail {
  id: string,
  subject: string,
  message: string,
  userId: string | null
}

export interface Commande {
  id: string,
  paniers: Panier[],
  adresse: Adresse,
  paymentId: string,
  orderId: string,
  userId: string | null
}

export interface Adresse {
  id: string,
  adresse: string,
  city: string,
  province: string,
  postalCode: string,
  userId: string | null
}

export type PredictionType = {
  description: string
  place_id: string
  reference: string
  matched_substrings: any[]
  tructured_formatting: Object
  terms: Object[]
  types: string[]
}

export type Offre= {
  name: string
  montant: number
  devise: string
}

export interface Category {
  id: string
  name: string
}