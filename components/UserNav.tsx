'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import AuthModal from './AuthModal';
import { useCartWishlist } from './CartWishlistProvider';

export default function UserNav() {
    const { data: session } = useSession();
    const [authOpen, setAuthOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { cart, openCart, openWishlist } = useCartWishlist();

    const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button
                onClick={openWishlist}
                className="text-warm-dark hover:text-gold transition-colors"
                title="Wishlist"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </button>

            {/* Cart */}
            <button
                onClick={openCart}
                className="relative text-warm-dark hover:text-gold transition-colors"
                title="Cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                    </span>
                )}
            </button>

            {/* User */}
            {session ? (
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(v => !v)}
                        className="w-7 h-7 rounded-full bg-warm-dark text-white text-[10px] font-semibold flex items-center justify-center hover:bg-gold transition-colors uppercase"
                        title={session.user?.email || ''}
                    >
                        {session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </button>
                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                            <div className="absolute right-0 top-9 bg-cream border border-sand shadow-lg z-50 min-w-48 py-2">
                                <p className="px-4 py-2 text-[10px] text-muted uppercase tracking-widest truncate border-b border-sand mb-1">
                                    {session.user?.email}
                                </p>
                                <button
                                    onClick={() => { signOut(); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-warm-dark hover:text-gold transition-colors"
                                >
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => setAuthOpen(true)}
                    className="text-[10px] uppercase tracking-[0.15em] font-semibold text-warm-dark hover:text-gold transition-colors"
                >
                    Sign in
                </button>
            )}

            <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        </div>
    );
}
