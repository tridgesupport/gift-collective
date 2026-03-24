export type CartItem = {
    productSlug: string;
    collectionPath: string;
    name: string;
    brand?: string;
    imageUrl?: string;
    quantity: number;
};

export const MAX_CART_QTY = 5;
