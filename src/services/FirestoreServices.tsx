import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Récupère un document à partir de son ID dans une collection spécifiée.
 * @param {string} collectionName - Le nom de la collection Firestore.
 * @param {string} documentId - L'ID du document à récupérer.
 * @returns {Promise<Object|null>} - Les données du document ou null s'il n'existe pas.
 */
export async function getRecordById(collectionName: string, documentId: string | undefined) {
  try {
    const documentSnapshot = await firestore()
      .collection(collectionName)
      .doc(documentId)
      .get();

    if (documentSnapshot.exists) {
    //  console.log('Document data:', documentSnapshot.data());
      return documentSnapshot.data();
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

/**
 * Récupère tous les documents d'une collection spécifiée.
 * @param {string} collectionName - Le nom de la collection Firestore.
 * @returns {Promise<Array<Object>>} - Une liste des données des documents.
 */
export async function getAllRecords(collectionName: string) {
  try {
    const collectionSnapshot = await firestore()
      .collection(collectionName)
      .get();

    const records = collectionSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    //console.log('All records:', records);
    return records;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
}

/**
 * Récupère tous les documents d'une collection spécifiée en fonction d'un filtre.
 * @param {string} collectionName - Le nom de la collection Firestore.
 * @param {string} fieldName - Le nom du champ à filtrer.
 * @param {any} fieldValue - La valeur du champ à filtrer.
 * @returns {Promise<Array<Object>>} - Une liste des données des documents filtrés.
 */
export async function getFilteredRecords(collectionName: string, fieldName: string | number | FirebaseFirestoreTypes.FieldPath, fieldValue: any) {
  try {
    let operator: any = '=='
    if (fieldValue === '') {
      operator = '!='
    }
    const collectionSnapshot = await firestore()
      .collection(collectionName)
      .where(fieldName, operator, fieldValue)
      .get();

    const records = collectionSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    //console.log('Filtered records:', records);
    return records;
  } catch (error) {
    console.error('Error getting filtered documents:', error);
    throw error;
  }
}


export const addRecord = async (collection: string, data: object,id: string) => {
  try {
    const newDocRef = await firestore().collection(collection).doc(id).set(data);
    console.log('Record added successfully');
    //return newDocRef;
  } catch (error) {
    console.error('Error adding record: ', error);
    throw error;
  }
};

/**
 * Ajoute ou met à jour un article dans la collection spécifiée.
 * @param {string} collectionName - Le nom de la collection Firestore.
 * @param {string} documentId - L'ID du document à mettre à jour ou créer.
 * @param {Object} data - Les données à définir ou mettre à jour.
 * @param {boolean} isNew - Indique si c'est un nouvel article ou une mise à jour.
 */
export async function addOrUpdateRecord(collectionName: string, documentId: string, data: Object, isNew: boolean) {
  try {
    const collectionRef = firestore().collection(collectionName);
    if (isNew) {
      await collectionRef.doc(documentId).set(data);
    } else {
      await collectionRef.doc(documentId).update(data);
    }
    console.log(isNew ? 'Record added!' : 'Record updated!');
  } catch (error) {
    console.error(isNew ? 'Error adding record:' : 'Error updating record:', error);
    throw error;
  }
}

/**
 * Récupère tous les documents d'une collection spécifiée en fonction d'un filtre.
 * @param {string} collectionName - Le nom de la collection Firestore.
 * @param {string} fieldName - Le nom du champ à filtrer.
 * @param {any} fieldValue - La valeur du champ à filtrer.
 * @returns {Promise<Array<Object>>} - Une liste des données des documents filtrés.
 */
export async function getFilteredArrayRecords(collectionName: string, fieldName: string | number | FirebaseFirestoreTypes.FieldPath, fieldValue: any) {
  try {
    const collectionSnapshot = await firestore()
      .collection(collectionName)
      .where(fieldName, 'array-contains', fieldValue)
      .get();

    const records = collectionSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    return records;
  } catch (error) {
    console.error('Error getting filtered documents:', error);
    throw error;
  }
}

export const getNbrProductsByFormule = async (formuleId: string): Promise<number> => {
  try {

    // Étape 2 : Calculer la quantité utilisée dans les paniers
    const panierSnap = await firestore()
      .collection('carts')
      .where('formule', '==', formuleId)
      .get();
    
    let totalUsed = 0;
    panierSnap.forEach(doc => {
      const data = doc.data();
      totalUsed += data.qty;  // Ajouter la quantité de chaque ligne du panier
    });

    return totalUsed;
  } catch (error) {
    console.error('Erreur lors de la récupération du stock:', error);
    return 0; // Retourner 0 en cas d'erreur
  }
};

export async function getFilteredByInRecords(collectionName: string, fieldName: string | number | FirebaseFirestoreTypes.FieldPath, fieldValue: any[]) {
  try {
  
    const collectionSnapshot = await firestore()
      .collection(collectionName)
      .where(fieldName, 'in', fieldValue)
      .where('actif', '==', true)
      .get();

    const records = collectionSnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    //console.log('Filtered records:', records);
    return records;
  } catch (error) {
    console.error('Error getting filtered documents:', error);
    throw error;
  }
}

/**
 * Vérifie si un document existe dans une collection donnée avec des champs spécifiques.
 *
 * @param collectionName - Le nom de la collection Firestore.
 * @param conditions - Un objet représentant les champs et leurs valeurs à comparer.
 * @returns Un booléen indiquant si un document correspondant existe.
 */
export const checkIfDocumentExists = async (
  collectionName: string,
  conditions: Record<string, any>
): Promise<boolean> => {
  try {
    let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection(collectionName);

    // Ajouter chaque condition à la requête
    for (const [field, value] of Object.entries(conditions)) {
      query = query.where(field, '==', value);
    }

    const snapshot = await query.get();

    // Si un document est trouvé, il existe
    return !snapshot.empty;
  } catch (error) {
    console.error(
      `Erreur lors de la vérification dans la collection ${collectionName}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère tous les documents d'une collection spécifiée en fonction d'un filtre.
 * @param collectionName - Le nom de la collection Firestore.
 * @param conditions - Un objet représentant les champs et leurs valeurs à comparer.
 * @returns {Promise<Array<Object>>} - Une liste des données des documents filtrés.
 */
export async function getFilteredFieldsRecords(collectionName: string, conditions: Record<string, any>) {
  try {
    let query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData> = firestore().collection(collectionName);

    // Ajouter chaque condition à la requête
    for (const [field, value] of Object.entries(conditions)) {
      query = query.where(field, '==', value);
    }

    const snapshot = await query.get();

    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));

    //console.log('Filtered records:', records);
    return records;
  } catch (error) {
    console.error('Error getting filtered documents:', error);
    throw error;
  }
}

export async function deleteRecord(collectionName: string, documentId: string): Promise<void> {
  try {
    const collectionRef = firestore().collection(collectionName);
    await collectionRef.doc(documentId).delete();
    console.log(`Document avec ID ${documentId} supprimé de la collection ${collectionName}.`);
  } catch (error) {
    console.error(`Erreur lors de la suppression du document ${documentId} :`, error);
  }
}


