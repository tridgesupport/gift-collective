'use client';

export type PriceRange = '0-2500' | '2500-5000' | '5000-10000' | '10000-20000' | '20000+';

export type Filters = {
    brands: string[];
    priceRange: PriceRange | null;
};

const PRICE_LABELS: Record<PriceRange, string> = {
    '0-2500': '₹0 – ₹2,500',
    '2500-5000': '₹2,500 – ₹5,000',
    '5000-10000': '₹5,000 – ₹10,000',
    '10000-20000': '₹10,000 – ₹20,000',
    '20000+': '₹20,000+',
};

const PRICE_RANGES: PriceRange[] = ['0-2500', '2500-5000', '5000-10000', '10000-20000', '20000+'];

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
    const activeCount = filters.brands.length + (filters.priceRange ? 1 : 0);

    const toggleBrand = (brand: string) => {
        const next = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        onChange({ ...filters, brands: next });
    };

    const togglePrice = (range: PriceRange) => {
        onChange({ ...filters, priceRange: filters.priceRange === range ? null : range });
    };

    const clearAll = () => onChange({ brands: [], priceRange: null });

    if (availableBrands.length === 0) return null;

    return (
        <div className="w-full border-b border-sand pb-6 mb-8">
            <div className="flex flex-wrap gap-6 items-start">
                {/* Brand filter */}
                {availableBrands.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-semibold">Brand</span>
                        <div className="flex flex-wrap gap-2">
                            {availableBrands.map(brand => {
                                const active = filters.brands.includes(brand);
                                return (
                                    <button
                                        key={brand}
                                        onClick={() => toggleBrand(brand)}
                                        className={`px-3 py-1 text-[10px] uppercase tracking-[0.12em] font-medium border transition-all ${
                                            active
                                                ? 'bg-warm-dark text-white border-warm-dark'
                                                : 'bg-transparent text-warm-dark border-warm-dark/30 hover:border-warm-dark'
                                        }`}
                                    >
                                        {brand}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Price range filter */}
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-semibold">Price</span>
                    <div className="flex flex-wrap gap-2">
                        {PRICE_RANGES.map(range => {
                            const active = filters.priceRange === range;
                            return (
                                <button
                                    key={range}
                                    onClick={() => togglePrice(range)}
                                    className={`px-3 py-1 text-[10px] uppercase tracking-[0.12em] font-medium border transition-all ${
                                        active
                                            ? 'bg-warm-dark text-white border-warm-dark'
                                            : 'bg-transparent text-warm-dark border-warm-dark/30 hover:border-warm-dark'
                                    }`}
                                >
                                    {PRICE_LABELS[range]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Active filter summary */}
            {activeCount > 0 && (
                <div className="flex items-center gap-4 mt-4">
                    <span className="text-[10px] text-muted">
                        Showing {filteredCount} of {totalCount} products
                    </span>
                    <button
                        onClick={clearAll}
                        className="text-[10px] uppercase tracking-[0.15em] text-warm-dark underline underline-offset-2 hover:text-gold transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}
