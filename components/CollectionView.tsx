'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import FilterBar, { Filters, PriceRange } from './FilterBar';
import PaginatedFrames from './PaginatedFrames';

function matchesPrice(price: number | undefined, range: PriceRange): boolean {
    if (price === undefined) return true;
    switch (range) {
        case '0-2500': return price <= 2500;
        case '2500-5000': return price > 2500 && price <= 5000;
        case '5000-10000': return price > 5000 && price <= 10000;
        case '10000-20000': return price > 10000 && price <= 20000;
        case '20000+': return price > 20000;
    }
}

export default function CollectionView({
    products,
    collectionName,
    menuSection,
    baseUrl,
}: {
    products: Product[];
    collectionName: string;
    menuSection: string;
    baseUrl: string;
}) {
    const [filters, setFilters] = useState<Filters>({ brands: [], priceRanges: [] });

    const availableBrands = useMemo(() => {
        const brands = products.map(p => p.brand).filter(Boolean);
        return [...new Set(brands)].sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
            if (filters.priceRanges.length > 0 && !filters.priceRanges.some(r => matchesPrice(p.price, r))) return false;
            return true;
        });
    }, [products, filters]);

    return (
        <>
            <FilterBar
                availableBrands={availableBrands}
                filters={filters}
                onChange={setFilters}
                totalCount={products.length}
                filteredCount={filteredProducts.length}
            />
            {filteredProducts.length === 0 ? (
                <div className="py-24 text-center text-muted text-xs uppercase tracking-widest">
                    No products match the selected filters
                </div>
            ) : (
                <PaginatedFrames
                    products={filteredProducts}
                    collectionName={collectionName}
                    menuSection={menuSection}
                    baseUrl={baseUrl}
                />
            )}
        </>
    );
}
