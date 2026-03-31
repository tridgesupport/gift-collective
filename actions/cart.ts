'use server';

import { auth } from '@/auth';
import { redis } from '@/lib/redis';
import { CartItem, MAX_CART_QTY } from '@/lib/cart';

function cartKey(email: string) {
    return `cart:${email}`;
}

export async function getCart(): Promise<CartItem[]> {
    const session = await auth();
    if (!session?.user?.email) return [];
    const data = await redis.get<CartItem[]>(cartKey(session.user.email));
    return data || [];
}

export async function addToCart(item: Omit<CartItem, 'quantity'>): Promise<{ success: boolean; requiresInquiry: boolean; cart: CartItem[] }> {
    const session = await auth();
    if (!session?.user?.email) throw new Error('NOT_AUTHENTICATED');

    const key = cartKey(session.user.email);
    const cart = await redis.get<CartItem[]>(key) || [];
    const existing = cart.find(i => i.productSlug === item.productSlug);
    const currentQty = existing?.quantity || 0;

    if (currentQty >= MAX_CART_QTY) {
        return { success: false, requiresInquiry: true, cart };
    }

    let newCart: CartItem[];
    if (existing) {
        newCart = cart.map(i =>
            i.productSlug === item.productSlug
                ? { ...i, quantity: i.quantity + 1 }
                : i
        );
    } else {
        newCart = [...cart, { ...item, quantity: 1 }];
    }

    await redis.set(key, newCart);
    return { success: true, requiresInquiry: false, cart: newCart };
}

export async function removeFromCart(productSlug: string): Promise<CartItem[]> {
    const session = await auth();
    if (!session?.user?.email) throw new Error('NOT_AUTHENTICATED');

    const key = cartKey(session.user.email);
    const cart = await redis.get<CartItem[]>(key) || [];
    const newCart = cart.filter(i => i.productSlug !== productSlug);
    await redis.set(key, newCart);
    return newCart;
}

export async function updateCartQuantity(productSlug: string, quantity: number): Promise<CartItem[]> {
    const session = await auth();
    if (!session?.user?.email) throw new Error('NOT_AUTHENTICATED');

    const key = cartKey(session.user.email);
    const cart = await redis.get<CartItem[]>(key) || [];

    let newCart: CartItem[];
    if (quantity <= 0) {
        newCart = cart.filter(i => i.productSlug !== productSlug);
    } else {
        const capped = Math.min(quantity, MAX_CART_QTY);
        newCart = cart.map(i =>
            i.productSlug === productSlug ? { ...i, quantity: capped } : i
        );
    }

    await redis.set(key, newCart);
    return newCart;
}
