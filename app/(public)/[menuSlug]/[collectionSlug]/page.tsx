import { getSheetData } from '@/lib/sheet';
import EditorialBanner from '@/components/EditorialBanner';
import PaginatedFrames from '@/components/PaginatedFrames';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const siteData = await getSheetData();
    const params: { menuSlug: string; collectionSlug: string }[] = [];

    siteData.menuSections.forEach(section => {
        section.collections.forEach(collection => {
            params.push({
                menuSlug: section.slug,
                collectionSlug: collection.slug
            });
        });
    });

    return params;
}

export default async function CollectionPage(props: { params: Promise<{ menuSlug: string; collectionSlug: string }> }) {
    const params = await props.params;
    const siteData = await getSheetData();

    const section = siteData.menuSections.find(s => s.slug === params.menuSlug);
    if (!section) return notFound();

    const collection = section.collections.find(c => c.slug === params.collectionSlug);
    if (!collection) return notFound();

    return (
        <div>
            <EditorialBanner collection={collection} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <PaginatedFrames
                    products={collection.products}
                    collectionName={collection.name}
                    menuSection={section.name}
                    baseUrl={`/${section.slug}/${collection.slug}`}
                />
            </div>
        </div>
    );
}
