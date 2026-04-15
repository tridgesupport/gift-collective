'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SearchableProduct } from '@/lib/types';

export default function SearchOverlay({
    isOpen,
    onClose,
    allProducts,
}: {
    isOpen: boolean;
    onClose: () => void;
    allProducts: SearchableProduct[];
}) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const results = query.trim().length < 2 ? [] : allProducts.filter(p => {
        const q = query.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    });

    const handleSelect = (url: string) => {
        router.push(url);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex flex-col">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-warm-dark/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 bg-cream w-full max-h-[80vh] flex flex-col shadow-2xl">
                {/* Search input */}
                <div className="flex items-center gap-4 px-6 md:px-12 py-5 border-b border-sand">
                    <SearchIcon />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search products, brands…"
                        className="flex-1 bg-transparent outline-none font-cormorant text-2xl md:text-3xl text-warm-dark placeholder:text-muted/50 font-light"
                    />
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-warm-dark transition-colors text-[10px] uppercase tracking-widest font-semibold shrink-0"
                    >
                        Close
                    </button>
                </div>

                {/* Results */}
                <div className="overflow-y-auto">
                    {query.trim().length >= 2 && results.length === 0 && (
                        <p className="px-6 md:px-12 py-10 text-muted text-xs uppercase tracking-widest text-center">
                            No products found for &ldquo;{query}&rdquo;
                        </p>
                    )}

                    {results.length > 0 && (
                        <ul>
                            {results.map(product => (
                                <li key={product.productUrl}>
                                    <button
                                        onClick={() => handleSelect(product.productUrl)}
                                        className="w-full flex items-center gap-5 px-6 md:px-12 py-4 hover:bg-sand/30 transition-colors text-left border-b border-sand/50"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-12 h-16 shrink-0 bg-sand/30">
                                            {product.imageUrl && (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            {product.brand && (
                                                <p className="text-[9px] uppercase tracking-widest text-muted mb-0.5">
                                                    {product.brand}
                                                </p>
                                            )}
                                            <p className="font-cormorant text-xl text-warm-dark font-semibold truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-[10px] text-muted uppercase tracking-widest truncate">
                                                {product.collectionName}
                                            </p>
                                        </div>

                                        <ChevronIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {query.trim().length < 2 && (
                        <p className="px-6 md:px-12 py-8 text-muted text-[10px] uppercase tracking-widest text-center">
                            Type at least 2 characters to search
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}
