'use client';

import Link from 'next/link';
import { NavNode, SearchableProduct } from '@/lib/types';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserNav from './UserNav';
import SearchOverlay from './SearchOverlay';

export default function Nav({ navTree, allProducts }: { navTree: NavNode[]; allProducts: SearchableProduct[] }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [hoveredChildSlug, setHoveredChildSlug] = useState<string | null>(null);

    const closeTopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeChildTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openTop = (slug: string) => {
        if (closeTopTimer.current) clearTimeout(closeTopTimer.current);
        setHoveredSlug(slug);
    };
    const closeTop = () => {
        closeTopTimer.current = setTimeout(() => {
            setHoveredSlug(null);
            setHoveredChildSlug(null);
        }, 150);
    };
    const openChild = (slug: string) => {
        if (closeChildTimer.current) clearTimeout(closeChildTimer.current);
        setHoveredChildSlug(slug);
    };
    const closeChild = () => {
        closeChildTimer.current = setTimeout(() => setHoveredChildSlug(null), 150);
    };

    return (
        <>
        <header className="hidden md:block fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-sm border-b border-sand text-[10px] tracking-[0.15em] uppercase font-semibold h-20 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">

                {/* Left: Logo */}
                <Link href="/" className="font-jost text-lg tracking-widest uppercase font-bold flex items-center gap-3 text-warm-dark shrink-0">
                    <span className="text-[22px] leading-none mb-0.5">◆</span> THE GIFT COLLECTIVE
                </Link>

                {/* Center: Dynamic Links */}
                <nav className="flex items-center space-x-12 h-full absolute left-1/2 -translate-x-1/2">
                    {navTree.map((node) => {
                        const href = node.children.length > 0
                            ? `/${node.children[0].path}`
                            : `/${node.path}`;

                        return (
                            <div
                                key={node.slug}
                                className="h-full flex items-center relative"
                                onMouseEnter={() => openTop(node.slug)}
                                onMouseLeave={closeTop}
                            >
                                <Link href={href} className="hover:text-gold transition-colors py-5 text-warm-dark">
                                    {node.name}
                                </Link>
                                <AnimatePresence>
                                    {hoveredSlug === node.slug && node.children.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            onMouseEnter={() => { if (closeTopTimer.current) clearTimeout(closeTopTimer.current); }}
                                            className="absolute top-20 left-1/2 -translate-x-1/2 bg-cream border border-sand p-6 min-w-48 shadow-lg"
                                        >
                                            <div className="flex flex-col space-y-5 text-center">
                                                {node.children.map(child => (
                                                    <div
                                                        key={child.slug}
                                                        className="relative"
                                                        onMouseEnter={() => openChild(child.slug)}
                                                        onMouseLeave={closeChild}
                                                    >
                                                        <Link
                                                            href={`/${child.path}`}
                                                            className="hover:text-gold transition-colors whitespace-nowrap text-warm-dark flex items-center justify-center gap-1"
                                                        >
                                                            {child.name}
                                                            {child.children.length > 0 && <span className="opacity-50">›</span>}
                                                        </Link>
                                                        {hoveredChildSlug === child.slug && child.children.length > 0 && (
                                                            <div
                                                                className="absolute left-full top-1/2 -translate-y-1/2 bg-cream border border-sand p-6 min-w-40 shadow-lg"
                                                                onMouseEnter={() => { if (closeChildTimer.current) clearTimeout(closeChildTimer.current); }}
                                                            >
                                                                <div className="flex flex-col space-y-5 text-center">
                                                                    {child.children.map(grandchild => (
                                                                        <Link
                                                                            key={grandchild.slug}
                                                                            href={`/${grandchild.path}`}
                                                                            className="hover:text-gold transition-colors whitespace-nowrap text-warm-dark"
                                                                        >
                                                                            {grandchild.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                    {/* Static placeholders matching design */}
                    <Link href="#" className="hover:text-gold transition-colors py-5 text-warm-dark">BESPOKE</Link>
                    <Link href="#" className="hover:text-gold transition-colors py-5 text-warm-dark">ABOUT</Link>
                </nav>

                {/* Right: Search + User Nav */}
                <div className="shrink-0 flex items-center gap-4">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="text-warm-dark hover:text-gold transition-colors"
                        title="Search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                    <UserNav />
                </div>

            </div>
        </header>

        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} allProducts={allProducts} />
        </>
    );
}
