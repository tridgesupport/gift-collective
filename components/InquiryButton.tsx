'use client';

import { useState } from 'react';
import { Product } from '../lib/types';
import InquiryModal from './InquiryModal';

type Props = {
    product: Product;
    collectionName: string;
    menuSection: string;
    className?: string;
    variant?: 'primary' | 'secondary';
};

export default function InquiryButton({ product, collectionName, menuSection, className = '', variant = 'secondary' }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const baseClasses = "block text-center uppercase tracking-[0.2em] text-[10px] font-semibold py-3 px-8 transition-colors rounded-none";
    let variantClasses = "";

    if (variant === 'primary') {
        variantClasses = "bg-warm-dark text-white border border-warm-dark hover:bg-gold hover:border-gold";
    } else {
        variantClasses = "bg-transparent border border-warm-dark/40 text-warm-dark hover:border-warm-dark";
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={`${baseClasses} ${variantClasses} ${className}`}
            >
                Place Enquiry
            </button>

            {isOpen && (
                <InquiryModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    product={product}
                    collectionName={collectionName}
                    menuSection={menuSection}
                />
            )}
        </>
    );
}
