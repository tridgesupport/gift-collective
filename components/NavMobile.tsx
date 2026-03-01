'use client';

import Link from 'next/link';
import { MenuSection } from '../lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavMobile({ menuSections }: { menuSections: MenuSection[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (slug: string) => {
        setExpandedSection(prev => prev === slug ? null : slug);
    };

    return (
        <>
            <header className="md:hidden fixed top-0 w-full z-50 bg-cream/90 backdrop-blur border-b border-sand h-16 flex items-center justify-between px-4">
                <Link href="/" className="font-cormorant text-2xl tracking-normal normal-case font-bold" onClick={() => setIsOpen(false)}>
                    The Gift Collective
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-warm-dark uppercase text-xs tracking-widest font-medium">
                    {isOpen ? 'Close' : 'Menu'}
                </button>
            </header>

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
                            {menuSections.map((section) => (
                                <div key={section.slug} className="border-b border-sand pb-4">
                                    <button
                                        onClick={() => toggleSection(section.slug)}
                                        className="w-full text-left flex justify-between items-center text-lg uppercase tracking-widest font-medium text-warm-dark"
                                    >
                                        {section.name}
                                        <span>{expandedSection === section.slug ? '−' : '+'}</span>
                                    </button>
                                    <AnimatePresence>
                                        {expandedSection === section.slug && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden flex flex-col space-y-4 mt-4"
                                            >
                                                {section.collections.map(col => (
                                                    <Link
                                                        key={col.slug}
                                                        href={`/${section.slug}/${col.slug}`}
                                                        className="text-muted hover:text-gold uppercase tracking-widest text-sm"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {col.name}
                                                    </Link>
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
