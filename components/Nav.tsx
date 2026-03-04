'use client';

import Link from 'next/link';
import { NavNode } from '@/lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Nav({ navTree }: { navTree: NavNode[] }) {
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    return (
        <header className="hidden md:block fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-sm border-b border-sand text-[10px] tracking-[0.15em] uppercase font-semibold h-20 shadow-sm">
            <div className="max-w-[1600px] mx-auto px-8 h-full flex items-center justify-between">

                {/* Left: Logo */}
                <Link href="/" className="font-jost text-lg tracking-widest uppercase font-bold flex items-center gap-3 text-warm-dark shrink-0">
                    <span className="text-[22px] leading-none mb-0.5">◆</span> THE GIFT COLLECTIVE
                </Link>

                {/* Center: Dynamic Links */}
                <nav className="flex items-center space-x-12 h-full absolute left-1/2 -translate-x-1/2">
                    {navTree.map((node) => {
                        // Link target: first child's path if node has children, else node's own path
                        const href = node.children.length > 0
                            ? `/${node.children[0].path}`
                            : `/${node.path}`;
                        const dropdownItems = node.children;

                        return (
                            <div
                                key={node.slug}
                                className="h-full flex items-center relative"
                                onMouseEnter={() => setHoveredSlug(node.slug)}
                                onMouseLeave={() => setHoveredSlug(null)}
                            >
                                <Link href={href} className="hover:text-gold transition-colors py-5 text-warm-dark">
                                    {node.name}
                                </Link>
                                <AnimatePresence>
                                    {hoveredSlug === node.slug && dropdownItems.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-20 left-1/2 -translate-x-1/2 bg-cream border border-sand p-6 min-w-48 shadow-lg"
                                        >
                                            <div className="flex flex-col space-y-5 text-center">
                                                {dropdownItems.map(child => (
                                                    <Link key={child.slug} href={`/${child.path}`} className="hover:text-gold transition-colors whitespace-nowrap text-warm-dark">
                                                        {child.name}
                                                    </Link>
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

                {/* Right: Search + Bag */}
                <div className="flex items-center space-x-8 shrink-0">
                    <div className="flex items-center space-x-3 border-b border-warm-dark/30 pb-1 w-32 relative">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 text-warm-dark absolute left-0 bottom-1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent focus:outline-none w-full text-[10px] placeholder:text-warm-dark/60 pl-6 text-warm-dark"
                        />
                    </div>
                    <button className="text-warm-dark hover:text-gold transition-colors">
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                    </button>
                </div>

            </div>
        </header>
    );
}
