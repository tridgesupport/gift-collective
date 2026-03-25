'use client';

import { useState, useRef, useEffect } from 'react';

export type PriceRange = '0-2500' | '2500-5000' | '5000-10000' | '10000-20000' | '20000+';

export type Filters = {
    brands: string[];
    priceRanges: PriceRange[];
};

const PRICE_LABELS: Record<PriceRange, string> = {
    '0-2500': '₹0 – ₹2,500',
    '2500-5000': '₹2,500 – ₹5,000',
    '5000-10000': '₹5,000 – ₹10,000',
    '10000-20000': '₹10,000 – ₹20,000',
    '20000+': '₹20,000+',
};

const PRICE_RANGES: PriceRange[] = ['0-2500', '2500-5000', '5000-10000', '10000-20000', '20000+'];

function Dropdown({
    label,
    activeCount,
    children,
}: {
    label: string;
    activeCount: number;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 border text-[10px] uppercase tracking-[0.15em] font-semibold transition-all ${
                    activeCount > 0
                        ? 'border-warm-dark bg-warm-dark text-white'
                        : 'border-warm-dark/30 text-warm-dark hover:border-warm-dark'
                }`}
            >
                {label}
                {activeCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-gold text-white text-[9px] flex items-center justify-center font-bold">
                        {activeCount}
                    </span>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
                >
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 bg-cream border border-sand shadow-lg z-20 min-w-48 py-2">
                    {children}
                </div>
            )}
        </div>
    );
}

function Checkbox({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-sand/40 transition-colors text-left"
        >
            <span className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-all ${
                checked ? 'bg-warm-dark border-warm-dark' : 'border-warm-dark/40'
            }`}>
                {checked && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="none" className="w-2 h-2">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] font-medium text-warm-dark">{label}</span>
        </button>
    );
}

export default function FilterBar({
    availableBrands,
    filters,
    onChange,
    totalCount,
    filteredCount,
}: {
    availableBrands: string[];
    filters: Filters;
    onChange: (filters: Filters) => void;
    totalCount: number;
    filteredCount: number;
}) {
    const activeCount = filters.brands.length + filters.priceRanges.length;

    const toggleBrand = (brand: string) => {
        const next = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        onChange({ ...filters, brands: next });
    };

    const togglePrice = (range: PriceRange) => {
        const next = filters.priceRanges.includes(range)
            ? filters.priceRanges.filter(r => r !== range)
            : [...filters.priceRanges, range];
        onChange({ ...filters, priceRanges: next });
    };

    const clearAll = () => onChange({ brands: [], priceRanges: [] });

    if (availableBrands.length === 0) return null;

    return (
        <div className="w-full border-b border-sand pb-5 mb-8">
            <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-semibold mr-1">Filter</span>

                <Dropdown label="Brand" activeCount={filters.brands.length}>
                    {availableBrands.map(brand => (
                        <Checkbox
                            key={brand}
                            checked={filters.brands.includes(brand)}
                            label={brand}
                            onChange={() => toggleBrand(brand)}
                        />
                    ))}
                </Dropdown>

                <Dropdown label="Price" activeCount={filters.priceRanges.length}>
                    {PRICE_RANGES.map(range => (
                        <Checkbox
                            key={range}
                            checked={filters.priceRanges.includes(range)}
                            label={PRICE_LABELS[range]}
                            onChange={() => togglePrice(range)}
                        />
                    ))}
                </Dropdown>

                {activeCount > 0 && (
                    <>
                        <span className="text-[10px] text-muted">
                            {filteredCount} of {totalCount} products
                        </span>
                        <button
                            onClick={clearAll}
                            className="text-[10px] uppercase tracking-[0.15em] text-muted hover:text-warm-dark underline underline-offset-2 transition-colors"
                        >
                            Clear all
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
