'use server';

import { auth } from '@/auth';
import { redis } from '@/lib/redis';
import { WishlistItem } from '@/lib/wishlist';

function wishlistKey(email: string) {
    return `wishlist:${email}`;
}

export async function getWishlist(): Promise<WishlistItem[]> {
    const session = await auth();
    if (!session?.user?.email) return [];
    const data = await redis.get<WishlistItem[]>(wishlistKey(session.user.email));
    return data || [];
}

export async function toggleWishlist(item: WishlistItem): Promise<{ inWishlist: boolean; wishlist: WishlistItem[] }> {
    const session = await auth();
    if (!session?.user?.email) throw new Error('NOT_AUTHENTICATED');

    const key = wishlistKey(session.user.email);
    const wishlist = await redis.get<WishlistItem[]>(key) || [];
    const isIn = wishlist.some(i => i.productSlug === item.productSlug);

    const newWishlist = isIn
        ? wishlist.filter(i => i.productSlug !== item.productSlug)
        : [...wishlist, item];

    await redis.set(key, newWishlist);
    return { inWishlist: !isIn, wishlist: newWishlist };
}
