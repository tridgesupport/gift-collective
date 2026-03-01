import { getSheetData } from '@/lib/sheet';
import ProductGallery from '@/components/ProductGallery';
import InquiryButton from '@/components/InquiryButton';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const siteData = await getSheetData();
    const params: { menuSlug: string; collectionSlug: string; productSlug: string }[] = [];

    siteData.menuSections.forEach(section => {
        section.collections.forEach(collection => {
            collection.products.forEach(product => {
                params.push({
                    menuSlug: section.slug,
                    collectionSlug: collection.slug,
                    productSlug: product.slug
                });
            });
        });
    });

    return params;
}

export default async function ProductPage(props: { params: Promise<{ menuSlug: string; collectionSlug: string; productSlug: string }> }) {
    const params = await props.params;
    const siteData = await getSheetData();

    const section = siteData.menuSections.find(s => s.slug === params.menuSlug);
    if (!section) return notFound();

    const collection = section.collections.find(c => c.slug === params.collectionSlug);
    if (!collection) return notFound();

    const product = collection.products.find(p => p.slug === params.productSlug);
    if (!product) return notFound();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 pt-20">
            <Link href={`/${section.slug}/${collection.slug}`} className="inline-block text-xs uppercase tracking-widest text-muted hover:text-gold transition-colors mb-8">
                ← Back
            </Link>

            <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted mb-12 border-b border-sand pb-4">
                {section.name} &nbsp; / &nbsp; {collection.name}
            </div>

            <div className="bg-cream border border-sand p-6 md:p-12 shadow-xl shadow-warm-dark/5">
                <ProductGallery assets={product.assets} priority />

                <div className="mt-12 text-center max-w-2xl mx-auto">
                    <h1 className="font-cormorant text-4xl md:text-6xl font-light mb-6">{product.name}</h1>
                    <p className="text-muted text-sm md:text-base leading-relaxed mb-8">
                        {product.description}
                    </p>

                    {product.priceVisible && product.price && (
                        <p className="text-xl font-medium tracking-wide mb-8">₹{product.price.toLocaleString('en-IN')}</p>
                    )}

                    <div className="flex justify-center mt-12">
                        <InquiryButton
                            product={product}
                            collectionName={collection.name}
                            menuSection={section.name}
                            variant="primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
