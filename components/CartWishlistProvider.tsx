'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem } from '@/lib/cart';
import { WishlistItem } from '@/lib/wishlist';
import { getCart } from '@/actions/cart';
import { getWishlist } from '@/actions/wishlist';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';

type CartWishlistCtx = {
    cart: CartItem[];
    wishlist: WishlistItem[];
    setCart: (cart: CartItem[]) => void;
    setWishlist: (wishlist: WishlistItem[]) => void;
    cartOpen: boolean;
    wishlistOpen: boolean;
    openCart: () => void;
    openWishlist: () => void;
    closeCart: () => void;
    closeWishlist: () => void;
};

const Ctx = createContext<CartWishlistCtx | null>(null);

export function useCartWishlist() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useCartWishlist must be used within CartWishlistProvider');
    return ctx;
}

export default function CartWishlistProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);

    useEffect(() => {
        if (session?.user?.email) {
            getCart().then(setCart);
            getWishlist().then(setWishlist);
        } else {
            setCart([]);
            setWishlist([]);
        }
    }, [session?.user?.email]);

    return (
        <Ctx.Provider value={{
            cart, wishlist, setCart, setWishlist,
            cartOpen, wishlistOpen,
            openCart: () => setCartOpen(true),
            openWishlist: () => setWishlistOpen(true),
            closeCart: () => setCartOpen(false),
            closeWishlist: () => setWishlistOpen(false),
        }}>
            {children}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} onCartChange={setCart} />
            <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} wishlist={wishlist} onWishlistChange={setWishlist} />
        </Ctx.Provider>
    );
}
