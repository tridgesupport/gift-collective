'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { addToCart } from '@/actions/cart';
import { toggleWishlist } from '@/actions/wishlist';
import AuthModal from './AuthModal';
import InquiryButton from './InquiryButton';
import { Product } from '@/lib/types';
import { useCartWishlist } from './CartWishlistProvider';
import toast from 'react-hot-toast';

export default function ProductActions({
    product,
    collectionName,
    menuSection,
    collectionPath,
    variant = 'card',
}: {
    product: Product;
    collectionName: string;
    menuSection: string;
    collectionPath: string;
    variant?: 'card' | 'detail';
}) {
    const { data: session } = useSession();
    const [authOpen, setAuthOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<'cart' | 'wishlist' | null>(null);
    const [isPending, startTransition] = useTransition();
    const { cart, wishlist, setCart, setWishlist } = useCartWishlist();

    const imageUrl = product.assets?.[0]?.url;
    const inWishlist = wishlist.some(i => i.productSlug === product.slug);
    const cartItem = cart.find(i => i.productSlug === product.slug);
    const cartQty = cartItem?.quantity || 0;

    const requiresAuth = (action: 'cart' | 'wishlist') => {
        setPendingAction(action);
        setAuthOpen(true);
    };

    const handleAuthClose = () => {
        setAuthOpen(false);
        setPendingAction(null);
    };

    const handleCart = () => {
        if (!session) { requiresAuth('cart'); return; }
        startTransition(async () => {
            try {
                const result = await addToCart({
                    productSlug: product.slug,
                    collectionPath,
                    name: product.name,
                    brand: product.brand,
                    imageUrl,
                });
                if (result.requiresInquiry) {
                    toast('You\'ve reached the max of 5. Please place an enquiry for larger quantities.', { icon: '📋' });
                } else {
                    setCart(result.cart);
                    toast.success('Added to cart');
                }
            } catch {
                toast.error('Failed to add to cart');
            }
        });
    };

    const handleWishlist = () => {
        if (!session) { requiresAuth('wishlist'); return; }
        startTransition(async () => {
            try {
                const result = await toggleWishlist({
                    productSlug: product.slug,
                    collectionPath,
                    name: product.name,
                    brand: product.brand,
                    imageUrl,
                });
                setWishlist(result.wishlist);
                toast.success(result.inWishlist ? 'Added to wishlist' : 'Removed from wishlist');
            } catch {
                toast.error('Failed to update wishlist');
            }
        });
    };

    const btnBase = variant === 'detail'
        ? 'flex items-center gap-2 px-5 py-3 border text-xs uppercase tracking-[0.15em] font-medium transition-all'
        : 'flex items-center justify-center gap-1.5 px-3 py-2 border text-[10px] uppercase tracking-[0.12em] font-medium transition-all';

    return (
        <>
            <div className={`flex items-center gap-2 ${variant === 'detail' ? 'justify-center flex-wrap' : 'justify-center'}`}>
                {/* Cart / Sold Out */}
                {product.priceVisible ? (
                    <button
                        onClick={handleCart}
                        disabled={isPending}
                        className={`${btnBase} border-warm-dark/40 text-warm-dark hover:border-warm-dark hover:bg-warm-dark hover:text-white disabled:opacity-50 relative`}
                        title="Add to cart"
                    >
                        <CartIcon />
                        {variant === 'detail' && <span>Add to Cart</span>}
                        {cartQty > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                                {cartQty}
                            </span>
                        )}
                    </button>
                ) : (
                    <span className={`${btnBase} border-sand text-muted cursor-default`}>
                        <span>Sold Out</span>
                    </span>
                )}

                {/* Wishlist */}
                <button
                    onClick={handleWishlist}
                    disabled={isPending}
                    className={`${btnBase} ${inWishlist ? 'border-gold text-gold' : 'border-warm-dark/40 text-warm-dark hover:border-gold hover:text-gold'} disabled:opacity-50`}
                    title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon filled={inWishlist} />
                    {variant === 'detail' && <span>{inWishlist ? 'Wishlisted' : 'Wishlist'}</span>}
                </button>

                {/* Inquiry */}
                <InquiryButton
                    product={product}
                    collectionName={collectionName}
                    menuSection={menuSection}
                    variant={variant === 'detail' ? 'primary' : 'icon'}
                />
            </div>

            <AuthModal isOpen={authOpen} onClose={handleAuthClose} />
        </>
    );
}

function CartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    return filled ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
}
