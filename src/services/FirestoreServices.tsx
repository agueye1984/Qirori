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
    if(fieldValue===''){
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

export const addRecord = async (collection: string, data: object) => {
  try {
    const newDocRef = await firestore().collection(collection).add(data);
    console.log('Record added successfully');
    return newDocRef;
  } catch (error) {
    console.error('Error adding record: ', error);
    throw error;
  }
};
