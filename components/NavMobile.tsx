'use client';

import Link from 'next/link';
import { NavNode, SearchableProduct } from '../lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchOverlay from './SearchOverlay';

export default function NavMobile({ navTree, allProducts }: { navTree: NavNode[]; allProducts: SearchableProduct[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
    const [expandedChildSlug, setExpandedChildSlug] = useState<string | null>(null);

    const toggleSection = (slug: string) => {
        setExpandedSlug(prev => prev === slug ? null : slug);
        setExpandedChildSlug(null);
    };

    const toggleChild = (slug: string) => {
        setExpandedChildSlug(prev => prev === slug ? null : slug);
    };

    return (
        <>
            <header className="md:hidden fixed top-0 w-full z-50 bg-cream/90 backdrop-blur border-b border-sand h-16 flex items-center justify-between px-4">
                <Link href="/" className="font-cormorant text-2xl tracking-normal normal-case font-bold" onClick={() => setIsOpen(false)}>
                    The Gift Collective
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setSearchOpen(true); setIsOpen(false); }}
                        className="p-2 text-warm-dark"
                        title="Search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-warm-dark uppercase text-xs tracking-widest font-medium">
                        {isOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </header>

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} allProducts={allProducts} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden fixed inset-0 z-40 bg-cream pt-20 px-6 pb-6 overflow-y-auto"
                    >
                        <div className="flex flex-col space-y-6 mt-8">
                            {navTree.map((node) => (
                                <div key={node.slug} className="border-b border-sand pb-4">
                                    <button
                                        onClick={() => toggleSection(node.slug)}
                                        className="w-full text-left flex justify-between items-center text-lg uppercase tracking-widest font-medium text-warm-dark"
                                    >
                                        {node.name}
                                        <span>{expandedSlug === node.slug ? '−' : '+'}</span>
                                    </button>
                                    <AnimatePresence>
                                        {expandedSlug === node.slug && node.children.length > 0 && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden flex flex-col space-y-4 mt-4"
                                            >
                                                {node.children.map(child => (
                                                    <div key={child.slug}>
                                                        {child.children.length > 0 ? (
                                                            <>
                                                                <button
                                                                    onClick={() => toggleChild(child.slug)}
                                                                    className="w-full text-left flex justify-between items-center text-muted uppercase tracking-widest text-sm"
                                                                >
                                                                    {child.name}
                                                                    <span className="text-xs">{expandedChildSlug === child.slug ? '−' : '+'}</span>
                                                                </button>
                                                                <AnimatePresence>
                                                                    {expandedChildSlug === child.slug && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden flex flex-col space-y-3 mt-3 pl-4"
                                                                        >
                                                                            {child.children.map(grandchild => (
                                                                                <Link
                                                                                    key={grandchild.slug}
                                                                                    href={`/${grandchild.path}`}
                                                                                    className="text-muted/70 hover:text-gold uppercase tracking-widest text-xs"
                                                                                    onClick={() => setIsOpen(false)}
                                                                                >
                                                                                    {grandchild.name}
                                                                                </Link>
                                                                            ))}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </>
                                                        ) : (
                                                            <Link
                                                                href={`/${child.path}`}
                                                                className="text-muted hover:text-gold uppercase tracking-widest text-sm"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        )}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
