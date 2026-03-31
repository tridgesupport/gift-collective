'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WishlistItem } from '@/lib/wishlist';
import { toggleWishlist } from '@/actions/wishlist';
import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistDrawer({
    isOpen,
    onClose,
    wishlist,
    onWishlistChange,
}: {
    isOpen: boolean;
    onClose: () => void;
    wishlist: WishlistItem[];
    onWishlistChange: (wishlist: WishlistItem[]) => void;
}) {
    const [isPending, startTransition] = useTransition();

    const handleRemove = (item: WishlistItem) => {
        startTransition(async () => {
            const { wishlist: updated } = await toggleWishlist(item);
            onWishlistChange(updated);
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full max-w-sm bg-cream z-50 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
                            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-warm-dark">Wishlist ({wishlist.length})</h2>
                            <button onClick={onClose} className="text-muted hover:text-warm-dark transition-colors text-lg">✕</button>
                        </div>

                        {wishlist.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-muted text-xs uppercase tracking-widest">
                                Your wishlist is empty
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
                                {wishlist.map(item => (
                                    <div key={item.productSlug} className="flex gap-4 border-b border-sand pb-6">
                                        {item.imageUrl && (
                                            <div className="relative w-16 h-20 shrink-0 bg-sand overflow-hidden">
                                                <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {item.brand && <p className="text-[9px] uppercase tracking-widest text-muted mb-0.5">{item.brand}</p>}
                                            <Link
                                                href={`/${item.collectionPath}/${item.productSlug}`}
                                                onClick={onClose}
                                                className="font-cormorant text-lg font-medium text-warm-dark leading-tight hover:text-gold transition-colors block"
                                            >
                                                {item.name}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item)}
                                            disabled={isPending}
                                            className="text-muted hover:text-warm-dark transition-colors text-xs self-start mt-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
