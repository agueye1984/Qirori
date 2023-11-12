import { useStore } from "../contexts/store";


export function getProducts() {
    const [state] = useStore();
    const products = state.products;
    return products;
}
export function getProduct(id: string) {
    const [state] = useStore();
    return state.products.find((product) => (product.id == id));
}