const translation = {
  Global: {
    Continue: 'Continue',
    Back: 'Back',
    GoBackHome: 'Go back to home',
    Modify: 'Modify',
    from: 'from',
    to: 'to',
    Yes: 'Yes',
    No: 'No',
    Search: 'Search',
    Create: 'Create',
    Cancel: 'Cancel',
    Save: 'Save',
    None: 'None',
    Nature: 'In nature',
    Argent: 'In money',
    Add: 'Add',
    Send: 'Send',
    Message: 'Message',
    ChooseImage: 'Choose from galery',
    EmailErrorEmpty: 'Email cannot be empty.',
    PhoneErrorEmpty: 'Phone cannot be empty.',
    NameErrorEmpty: 'Name cannot be empty.',
    NameSectionErrorEmpty: 'Name cannot be empty.',
    PasswordErrorEmpty: 'Password cannot be empty.',
    RetapePasswordErrorEmpty: 'RetapePassword cannot be empty.',
    DescriptionErrorEmpty: 'Description cannot be empty.',
    DeviseErrorEmpty: 'Currency cannot be empty.',
    ImageErrorEmpty: 'Image cannot be empty.',
    PrixUnitaireErrorEmpty: 'Unit Price cannot be empty.',
    LocalisationErrorEmpty: 'Localisation cannot be empty.',
    QuantiteErrorEmpty: 'Quantity cannot be empty.',
    CategoryErrorEmpty: 'Category cannot be empty.',
    OffreErrorEmpty: 'Offer cannot be empty.',
    ConditionsErrorEmpty: 'Condition cannot be empty.',
    EmailNotExist: 'No users found for this email',
    RestorePassword: 'Restore Password',
    VerifyEmail: 'Verify Email',
    BackTologin: 'Back to Login',
    EmailError: 'Ooops! We need a valid email.',
    PhoneError: 'Ooops! We need a valid phone number.',
    PasswordError:
      'Ooops! We need a valid password.The password must have at least 8 characters, an upper case, a lower case, a special character, a number.',
    RetapePasswordError:
      'Ooops! We need a valid confirm password.The password must have at least 8 characters, an upper case, a lower case, a special character, a number.',
    PasswordNotConfirm: 'Oops, the two passwords do not match.',
    AccountExists: 'This email have already an account',
    AllSelect: 'Select all',
    Delete: 'Delete',
    EmptyList: 'No result found',
    OfferChoose: 'Must choose an offer',
    DateDGTDateF: 'Start Date must not be greater than End Date',
    EmailExisting: "An account already exists with this email",
    PhoneExisting: "An account already exists with this phone number",
    Resend: "Re-send code",
    ConfirmCode: "Confirm Code",
    Submit: "Submit",
    Paid: "Paid",
    Confirm: "Confirm",
    ZoneErrorEmpty: 'Area cannot be empty.',
  },
  LoginScreen: {
    title: 'Login',
    paragraph: 'Login to access your space',
    Email: 'Email',
    Password: 'Password',
    Forgotpassword: 'Forgot your password ?',
    Login: 'Login',
    DontHaveAccount: 'Don’t have an account ?',
    SignUp: 'Sign up',
    LoginError: 'Oops, Email and/or password are wrong',
    LoginActifError: 'Oops, This account with this email/password is deactivated',
  },
  RegisterScreen: {
    title: 'Create Account',
    paragraph: 'Sign up to access your space',
    Name: 'Name',
    Email: 'Email',
    Phone: 'Phone',
    Password: 'Password',
    RetapePassword: 'Re-type the password',
    Login: 'Login',
    AlreadyHaveAccount: 'Already have an account ?',
    SignUp: 'Sign up',
  },
  Screens: {
    Home: 'Home',
    Events: 'Events',
    Invitations: 'Invitations',
    Contributions: 'Donations',
    Achats: 'Buy',
    Settings: 'More',
  },
  HomeScreen: {
    title: 'Home Page',
  },
  AccueilList: {
    Evenements: 'Events',
    Invitations: 'Invitations',
    Contributions: 'Donations',
    Ventes: 'Become Vendor',
    Achats: 'Buy',
  },
  Events: {
    title: 'Events',
    EmptyList: 'No event for the moment',
    AddButtonText: 'Create an Event',
    addToCalendar: 'Add to calendar',
    Invite: 'Invite',
    Invited: 'Invited',
    Maybe: 'Maybe',
    AmountDonation: 'Total Amount',
    CloseDonation: 'Close Donation',
  },
  AddEvent: {
    title: 'Create an event',
    Name: 'Name of Event',
    Description: 'Description',
    DateHeure: 'Date and Time',
    DateDebut: 'Start Date',
    DateFin: 'End Date',
    Emplacement: 'Location',
    CharacterCount: 'characters',
    titleModify: 'Modify an event',
  },
  InvitationsContacts: {
    title: 'Invite your contacts',
    Share: 'Share',
    Everyone: 'Everyone with the link',
    Limit: '+1 Limit',
    Nos: 'No +1s',
    Invite: 'Invite a new user',
    FromContacts: 'From Contacts',
    PhoneNumber: 'Phone number',
    Invitee: 'Invite',
  },
  Invitations: {
    title: 'Invitations',
    EmptyList: 'No invitation for the moment',
  },
  InvitationsDetails: {
    title: 'Invitations Details',
    Presence: 'Presence at the event?',
    nbrPersons: 'Number of people present',
    Adults: 'Adults',
    KidsOver17: 'Children from 0 to 17 years old',
    KidsAge: 'Age of child',
  },
  Contributions: {
    title: 'Donations',
    EmptyList: 'No invitation for donation for the moment',
  },
  ContributionsDetails: {
    title: 'Make a donation',
    Contribution: 'Do you want to contribute to this event?',
    Nature: 'Type of contribution',
    Produits: 'Products',
    Paypal: 'Pay Using PayPal',
    Montant: 'Contribution amount',
    AddProduct: 'Add a Product',
  },
  Ventes: {
    title: 'Become Vendor',
  },
  VentesList: {
    AddProduct: 'Add a product',
    ListProducts: 'List of Products',
    AddService: 'Add a service',
    ListServices: 'List of Services',
  },
  AddProduct: {
    title: 'Add a product',
    Name: 'Name',
    Description: 'Description',
    Quantite: 'Quantity',
    PrixUnitaire: 'Unit Price',
    Devise: 'Currency',
    ProductExistError: 'The product has already been added',
  },
  AddService: {
    title: 'Add a service',
    AddOffre: 'Add an offer',
    Offre: 'Offer',
    Zone: 'Area to serve',
    Category: 'Category',
    Conditions: 'Conditions',
    Capacites: 'Capacity',
    Calendrier: 'Calendar',
  },
  Achats: {
    title: 'Buy',
  },
  BuyProduct: {
    title: 'Buy a product',
    Products: 'Products',
    Quantity: 'Quantity',
    AddToCart: 'Add To Cart',
    Cart: 'See cart',
    Stock: 'In stock',
    NoStock: 'Out of stock',
  },
  Cart: {
    title: 'Cart',
    items: 'Items',
    tax: 'Tax',
    Subtotal: 'Subtotal',
    Total: 'Total',
    Checkout: 'Proceed to payment',
    EmptyCart: 'Empty Cart',
  },
  Dropdown: {
    Select: 'Select a currency',
    Category: 'Select a category',
    Product: ' Select a product',
    Event: 'Select an event',
    Autre:'Others',
    Zone:'Choose an area to serve',
    Offre:'Choose an offer',
    Province: 'Select a province',
    Region: 'Select a region',
    TypePrix: 'Select a type of price',
    Search: 'Search',
  },
  Products: {
    title: 'List of Products',
    EmptyList: 'No Product Added',
  },
  Services: {
    title: 'List of Services',
    EmptyList: 'No Service Added',
  },
  Settings: {
    title: 'More Options',
  },
  SettingsList: {
    Settings: 'Settings',
    ContributionsList: 'Contributions List',
    InvitationsList: 'Invitations List',
    ProductOrderings: 'My orders',
    ProductDelivering: 'Orders to be delivered',
  },
  Setting: {
    title: 'Settings',
    Name: 'Your Name',
    LanguageSetting: 'Language Setting',
    ContactUs: 'Contact Us',
    Logout: 'Logout',
    Email: 'Email',
    Phone: 'Phone',
    Version: 'Version',
    DeviseSetting: 'Currency Setting',
    CountrySetting: 'Country Setting',
    TypeEvents: 'Type Event',
  },
  LanguageList: {
    French: 'French',
    English: 'English',
  },
  Checkout: {
    title:'Checkout',
    Name: 'Name',
    Email: 'Email',
    AdresseLine1: 'Address Line 1',
    AdresseLine2: 'Address Line 2',
    City: 'City',
    Province: 'Province',
    PostalCode: 'Postal Code',
    Phone: 'Phone',
    InfoPersonal: 'Information personal',
    ShippingAddress: 'Shipping Address',
    Payment: 'Payment',
    AmountToPay: 'Amount To Pay',
    PlaceOrder: 'Place Order',
  },
  CategoryList: {
    Music: 'Music & DJs',
    Photos: 'Photos & Camera',
    Meals: 'Meals',
    Drink: 'Drinks',
    Dress: 'Dress',
    Transport: 'Transport',
  },
  StatusList: {
    Paid: 'Paid',
    BeingProcessed: 'Being Processed',
    ReadyToShip: 'Ready To Ship',
    Shipped: 'Shipped',
    Livery: 'Delivered',
    Closed: 'Closed',
  },
  RequestService: {
    title: 'Request a service',
  },
  ProductOrderings: {
    title: 'My orders',
    nbItems: 'Number of Items',
    TotalAmount: 'Total Amount',
    DateDelivered: 'Estimated delivery date',
    Status: 'Status',
  },
  ProductDelivering: {
    title: 'Orders to be delivered',
    Statut: 'Status',
    DateDelivered: 'Date delivered',
  },
  ContributionsList: {
    title: 'Contributions List',
    eventTitle: 'Event',
    userTitle: 'Donator',
    natureTitle: 'Type Donation',
    montantTitle: 'Amount',
  },
  InvitationsList: {
    title: 'Invitations List',
    eventTitle: 'Event',
    userTitle: 'Invite',
    presenceTitle: 'Presence',
    nbrPersonTitle: 'Number of Persons',
  },
  Order: {
    title: 'Orders passed',
    paragraph: 'Items will be delivered within the next 72 hours',
  },
  ServiceOffer: {
    title: 'Service Offered',
    DateDelivered: 'Date delivered',
  },
  TypeEvents: {
    title: "Type Events",
    EmptyList: 'Type Event Added',
    List: "List Type Events",
    AddButtonText: "Add a new type event",
  },
  AddTypeEvent: {
    title: "Add Type Events",
    NameFr: "Name of FR",
    NameEn: "Name of EN",
  },
  EditTypeEvent: {
    title: "Modify Type Events",
  },
  OTPAuthScreen: {
    title: "Confirmation Code",
    paragraph: "Enter a verification code to login in the app",
    confirmCode: "Confirmation Code",
    enterConfirmCode: "Enter confirmation code",
    CodeError: "The confirmation code is incorrect. Try again",
  },
  DashboardList: {
    Dashboards: "Dashboards",
    Administrators: "Manage Administrators",
    Users: "Manage Users",
    Products: "Manage Products",
  },
  Administrators:{
    AddButtonText: "Add a new Administrator",
    Name: "Name",
    Phone: "Phone",
    Email: "Email",
    Modify: "Modify an Administrator",
  },
  Dashboards:{
    NbrEvents: "Number Of Events",
    NbrInviteEvents: "Number of invitations per event",
    NbrDonationsEvents: "Number of contributions per event",
    MntDonationsEvents: "Overall amount of contributions per event",
    NbrOrderDone: "Number of orders placed",
    NbrOrderBeing: "Number of orders being delivered",
    NbrOrderDeliver: "Number of orders delivered",
    NbrProducts: "Number of products",
    NbrServices: "Number of services",
  },
  RatingScreen:{
    title: "Rate the Supplier",
    avis: "Writing an opinion",
  },
  PaymentList:{
    Paypal: "Paypal",
    Card: "Visa / MasterCard",
  },
  ResetPassword:{
    title: "Restore Password",
    Reset: "Restore",
  },
  TypePrix:{
    Unit: "Per unit",
    Person: "Per Person",
  },
  
  TermsV2: {
    title: 'Terms and Conditions',
    IAgree: 'I Agree',
    Credential: {
      Body: 'I have read, understand and accept the terms of this EULA.',
      Error: 'Please check the box above to continue.',
    },
    Consent: {
      title: 'Consent',
      body: 'Please read the general conditions for the use of the Qirori Application.',
      PersonalUse: {
        title: 'Exclusive Personal Use',
        body:
          'You are responsible for the confidentiality of your Qirori application. You must use it exclusively for your own purposes. Do not divulge your access code to anyone and protect your mobile phone adequately.\n' +
          'You will find recommendations in the Security section.',
        subsection: {
          title: 'Acceptable Use',
          body:
            'In connection with your use of the Licensed Application, you shall not take any action that may jeopardise the security, integrity and/or availability of the Licensed Application, including, without limitation:  \n' +
            '\n' +
            'Using the Licensed Application for illegal or improper purposes;  \n' +
            '\n' +
            'Tampering with any part of the Licensed Application;  \n' +
            '\n' +
            'Using the Licensed Application to transmit any virus or other harmful or destructive computer code, files or programs, or to conduct hacking and/or intrusive activities;  \n' +
            '\n' +
            'Attempt to circumvent or subvert any security measures associated with the Licensed Application;  \n' +
            '\n' +
            'Take any action that could reasonably be construed to adversely affect other users of the Licensed Application;  \n' +
            '\n' +
            'Where  \n' +
            '\n' +
            'Remove or alter any proprietary symbols or notices, including any copyright, trademark or logo notices, displayed in connection with the Licensed Application.  ',
        },
      },
      IdentityTheft: {
        title: 'In case of identity theft',
        body: 'If you suspect that the security of your wallet and its contents has been compromised, you must contact *the Qiroi Customer Relations Centre* immediately. You will not be held responsible for identity theft as long as you comply with these terms and conditions',
        subsection: {
          title: 'Indemnification',
          body:
            'You agree to indemnify, defend and hold harmless the Province and all of its respective officers, employees and agents from and against any and all claims, demands, obligations, losses, liabilities, costs or debts and expenses (including, without limitation, reasonable legal fees).\n' +
            '\n' +
            ' Arising out of:\n' +
            '\n' +
            ' (a) your use of the Licensed Application;\n' +
            '\n' +
            ' Where\n' +
            '\n' +
            ' (b) your breach of any provision of this EULA',
        },
      },
      Privacy: {
        title: 'Protection and privacy',
        body: "Qiroi is concerned about the protection of your privacy and the personal and confidential information contained in this application. You are responsible for consulting the 'Privacy Policy' to learn about the Qirori's practices in this regard",
        subsection: {
          title: 'Personal Information Protection',
          body: 'including accessing the Help Function for the licensed application or certain information will be provided to you in accordance with the Province\'s Privacy Statement for Government Websites. Certain information is also collected as part of the licence application as set out in the Qirori App Privacy Policy (the "Privacy Policy"), which is incorporated by reference into and forms part of this EULA. You consent to the collection by the Licensed App of such information which, together with your Content, is stored locally on your device and is not accessible to the Province, except in cases where you choose to provide information to the Province as set forth in the Privacy Policy. Any information you provide to the Province that is "personal information", as defined in the Quebec Freedom of Information and Protection of Privacy Act ("the Act"), is collected by the Province pursuant to section 26c of the Act, for the purposes set out in the Privacy Policy. Any questions regarding the collection of this information may be directed to the contact person identified in Section 11. The consents you have provided pursuant to this section will continue until you revoke them in writing to the contact person identified in section 11, at which time this EULA will terminate immediately in accordance with section 9.',
        },
      },
      AppAccess: {
        title: 'Right of access to the application',
        body: 'Qirori may suspend access to this application if you fail to comply with these terms of use. It may also do so for these terms of use. It may also do so for security or administrative purposes',
        subsection: {
          title: 'Limitation of liability',
          body:
            'To the extent permitted by applicable law, in no event shall the Province be liable to any person or entity for any direct, indirect, special, incidental or consequential loss, claim, injury or damage, or for any other loss, claim, injury or damage.  \n' +
            '\n' +
            'If foreseeable or unforeseeable (including claims for limitation of damages for loss of profits or business opportunities, use or misuse of, or inability to use, the Licensed Application, interruptions, deletion or corruption of files, loss of programs or information, errors, defects or delays) arising out of or in any way connected with your use of the Licensed Application, whether based on contract, tort, strict liability or any other legal theory. The preceding sentence shall apply even if the Province has been expressly advised of the possibility of such loss, claim, injury or damage. The parties acknowledge that Apple is not responsible for: \n' +
            '\n' +
            '(a) dealing with any claim you or any third party may have in connection with the Authorized Application;  \n' +
            '\n' +
            'b) your possession and/or use of the Permitted Application.',
        },
      },
      More: {
        body: 'Learn more about *these terms and conditions(*)*',
      },
    },
  },
};

export default translation;
