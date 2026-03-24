'use client';

import { useState } from 'react';
import { Product } from '../lib/types';
import InquiryModal from './InquiryModal';

type Props = {
    product: Product;
    collectionName: string;
    menuSection: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'icon';
};

export default function InquiryButton({ product, collectionName, menuSection, className = '', variant = 'secondary' }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    let buttonContent: React.ReactNode;
    let buttonClass: string;

    if (variant === 'icon') {
        buttonClass = `flex items-center justify-center gap-1.5 px-3 py-2 border border-warm-dark/40 text-warm-dark hover:border-warm-dark hover:bg-warm-dark hover:text-white text-[10px] uppercase tracking-[0.12em] font-medium transition-all ${className}`;
        buttonContent = (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        );
    } else if (variant === 'primary') {
        buttonClass = `block text-center uppercase tracking-[0.2em] text-[10px] font-semibold py-3 px-8 transition-colors rounded-none bg-warm-dark text-white border border-warm-dark hover:bg-gold hover:border-gold ${className}`;
        buttonContent = 'Place Enquiry';
    } else {
        buttonClass = `block text-center uppercase tracking-[0.2em] text-[10px] font-semibold py-3 px-8 transition-colors rounded-none bg-transparent border border-warm-dark/40 text-warm-dark hover:border-warm-dark ${className}`;
        buttonContent = 'Place Enquiry';
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className={buttonClass}
                title="Place Enquiry"
            >
                {buttonContent}
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
