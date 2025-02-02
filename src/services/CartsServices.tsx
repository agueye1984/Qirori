import {
  addOrUpdateRecord,
  deleteRecord,
  getFilteredRecords,
} from '../services/FirestoreServices';
import {v4 as uuidv4} from 'uuid';
import {Panier, Product, Formula, Service} from '../contexts/types';
import {NavigationProp} from '@react-navigation/native';

/**
 * Récupère le nombre total de produits dans les paniers et met à jour l'état du stock.
 * @param {Object} item - Les détails du produit.
 * @param {React.Dispatch<React.SetStateAction<number>>} setStock - Fonction pour mettre à jour l'état du stock.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setIsStock - Fonction pour indiquer si le produit est en stock.
 * @param {React.Dispatch<React.SetStateAction<number>>} setNbreProduct - Fonction pour mettre à jour le nombre total de produits.
 */
export const getNbrProducts = async (
  item: any,
  setStock: React.Dispatch<React.SetStateAction<number>>,
  setIsStock: React.Dispatch<React.SetStateAction<boolean>>,
  setNbreProduct: React.Dispatch<React.SetStateAction<number>>,
): Promise<void> => {
  try {
    const data = await getFilteredRecords('carts', 'product', item.id);
    let nbr = 0;
    data.forEach(record => {
      const cart = record.data as Panier;
      nbr += cart.qty;
    });

    const nbRestant = item.quantite - nbr;
    setIsStock(nbRestant > 0);
    setStock(nbRestant);
    setNbreProduct(nbr);
  } catch (error) {
    console.error('Error fetching number of products:', error);
  }
};

/**
 * Ajoute ou met à jour un service dans le panier de l'utilisateur.
 * @param {Object} item - Les détails du service.
 * @param {string} quantity - La quantité du service à ajouter.
 * @param {Object} currentUser - Les informations de l'utilisateur actuel.
 * @param {NavigationProp} navigation - La fonction de navigation pour rediriger après l'ajout ou la mise à jour.
 */
export async function addToCartService(
  formuleId: string,
  item: any,
  quantity: string,
  currentUser: any,
  navigation: NavigationProp<any> | null,
  type: string,
): Promise<void> {
  try {
    const userId = currentUser?.uid;
    const quantityInt = parseInt(quantity.toString());

    const filteredRecords = await getFilteredRecords('carts', 'userId', userId);
    console.log(filteredRecords);
    console.log(item);
    const formule = item.formules.find((f: any) => f.id === formuleId);
    const offreMontant = formule ? parseInt(formule.amount) : 0;
    const totalPrice = quantityInt * offreMontant;
    const tax = offreMontant * 0.14975;

    const existingCart = filteredRecords.find(
      record => record.data.formule === formuleId && record.data.paid === false,
    );
    console.log(existingCart);
    if (!existingCart) {
      const idCart = uuidv4();
      const newCartData = {
        id: idCart,
        formule: formuleId,
        qty: quantity,
        totalPrice: parseInt(quantity) * offreMontant,
        paid: false,
        userId: currentUser?.uid,
        name: item.name,
        description: item.description,
        prix: offreMontant,
        devise: item.devise,
        tax: offreMontant * 0.14975,
        images: item.images,
        vendorId: item.userId,
        dateDelivered: '',
        statut: '',
        commandeId: '',
        type: type,
      };
      console.log(newCartData);
      await addOrUpdateRecord('carts', idCart, newCartData, true);
    } else {
      const updatedCartData = {
        qty: quantityInt,
        totalPrice: totalPrice,
        tax: tax,
      };
      console.log(existingCart);
      await addOrUpdateRecord('carts', existingCart.id, updatedCartData, false);
    }
    if (navigation !== null) {
      // Redirection après ajout ou mise à jour du panier
      navigation.navigate('ServicesOffertsList', {
        item: item.category,
      });
    }
  } catch (error) {
    console.error('Error adding to cart: ', error);
  }
}

export async function deleteFromCartService(
  produitId: string,
  userId: string
): Promise<void> {
  try {
    // Rechercher les enregistrements correspondants dans la collection "carts"
    const querySnapshot = await getFilteredRecords('carts', 'userId', userId);

    const matchingCart = querySnapshot.find(
      record => record.data.formule === produitId && record.data.paid === false
    );

    if (matchingCart) {
      // Supprimer le document correspondant
      await deleteRecord('carts', matchingCart.id);
      console.log(`Produit avec ID ${produitId} supprimé du panier pour l'utilisateur ${userId}`);
    } else {
      console.warn(`Aucun produit trouvé dans le panier avec l'ID ${produitId} pour l'utilisateur ${userId}.`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du produit du panier :', error);
  }
}



