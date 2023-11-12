import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Button from "./Button";
import { Product } from "../contexts/types";

type Props = {
  product: Product
}

export const ProductCard = ({ product }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/No_image_available.svg.png')}
        style={styles.image}
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.category}>{product.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          ${product.prixUnitaire / 100}
        </Text>
        <Button mode="contained">
          "BUY"
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    borderRadius: 10,
    marginBottom: 4,
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    padding: 10,
    width: 42,
    backgroundColor: "#fff",
  },
  image: {
    height: 40,
    borderRadius: 7,
    marginBottom: 2,
  },
  title: {
    fontSize: 3.7,
    fontWeight: "bold",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 3,
  },
  category: {
    fontSize: 3.4,
    color: "#828282",
    marginTop: 3,
  },
  price: {
    fontSize: 4,
    fontWeight: "bold",
  },
});