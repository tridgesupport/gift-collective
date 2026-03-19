'use client';

import { Product } from '../lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductFrame from './ProductFrame';

export default function PaginatedFrames({
    products,
    collectionName,
    menuSection,
    baseUrl
}: {
    products: Product[],
    collectionName: string,
    menuSection: string,
    baseUrl: string
}) {
    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? '50%' : '-50%', opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? '50%' : '-50%', opacity: 0 })
    };

    const currentProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setPage(prev => prev + newDirection);
    };

    if (products.length === 0) return null;

    return (
        <div className="w-full flex flex-col pt-8">
            <div className="relative overflow-hidden w-full min-h-[500px] mb-8">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}
                        className={`grid gap-8 lg:gap-14 ${currentProducts.length === 1 ? 'grid-cols-1 md:w-1/4 mx-auto' : 'grid-cols-2 md:grid-cols-4'}`}
                    >
                        {currentProducts.map((p, idx) => (
                            <ProductFrame
                                key={p.slug}
                                product={p}
                                collectionName={collectionName}
                                menuSection={menuSection}
                                baseUrl={baseUrl}
                                priority={idx === 0 && page === 0}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-6 text-xs md:text-sm tracking-[0.2em] font-semibold text-muted/70 pb-16 border-b border-sand/40">
                    <button
                        onClick={() => paginate(-1)}
                        disabled={page === 0}
                        className="hover:text-warm-dark transition-colors disabled:opacity-30 p-2"
                    >
                        &lt;
                    </button>

                    <div className="flex space-x-4">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setDirection(idx > page ? 1 : -1);
                                    setPage(idx);
                                }}
                                className={`relative pb-1 uppercase transition-colors ${page === idx ? 'text-warm-dark' : 'hover:text-warm-dark'}`}
                            >
                                {String(idx + 1).padStart(2, '0')}
                                {page === idx && (
                                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-warm-dark" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => paginate(1)}
                        disabled={page === totalPages - 1}
                        className="hover:text-warm-dark transition-colors disabled:opacity-30 p-2"
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}
