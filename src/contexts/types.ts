export interface Onboarding {
  didAgreeToTerms: boolean
}

export interface State {
  onboarding: Onboarding
  user: User[]
  language: String
  events: Event[]
  invitations: Invitation[]
}

export interface User{
  id: string
  email: string
  telephone: string
  password: string
  name: string
}

export interface Accueil{
  id: string
  title: string
  route: string
  images: string
}

export interface Event{
  id: string
  name: string
  description: string
  userId: string | null
  dateDebut: string
  heureDebut: string
  dateFin: string
  heureFin: string
  localisation: string
}

export type ManageEventsParamList = {
  ManageEvents: undefined
  AddEvent: undefined
  EventDetails: {
    item: Event
  }
  EditEvent: {
    itemId: string
  }
  InvitationsContacts: {
    item: Event
  }
  Invitations: {
    item: Event
  }
}

export interface Invitation{
  id: string
  eventId: string
  reponse: string
  userId: string | null
  nbrAdultes: number
  numeroTelephone: string
  nbrEnfants?: number
  AgeEnfants?: number
}