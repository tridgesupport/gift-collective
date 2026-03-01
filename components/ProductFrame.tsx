'use client';

import { Product } from '../lib/types';
import ProductGallery from './ProductGallery';
import InquiryButton from './InquiryButton';
import Link from 'next/link';

export default function ProductFrame({ product, collectionName, menuSection, baseUrl, priority = false }: { product: Product, collectionName: string, menuSection: string, baseUrl: string, priority?: boolean }) {
    return (
        <div className="w-full flex flex-col items-center group">
            <Link href={`${baseUrl}/${product.slug}`} className="block w-full cursor-pointer mb-8 group">
                <div className="border border-warm-dark/30 p-4 md:p-6 bg-cream shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full relative bg-cream">
                        <ProductGallery assets={product.assets} priority={priority} />
                    </div>
                </div>
            </Link>

            <div className="text-center w-full flex flex-col items-center">
                <h3 className="font-cormorant text-2xl md:text-3xl font-semibold text-warm-dark mb-1">{product.name}</h3>
                <p className="text-muted text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6">
                    {product.description}
                </p>
                {product.priceVisible && product.price && (
                    <p className="text-sm font-medium tracking-wide mb-6">₹{product.price.toLocaleString('en-IN')}</p>
                )}
                <InquiryButton
                    product={product}
                    collectionName={collectionName}
                    menuSection={menuSection}
                    variant="secondary"
                />
            </div>
        </div>
    );
}
