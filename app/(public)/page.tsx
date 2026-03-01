import { getSheetData } from '../../lib/sheet';
import EditorialBanner from '../../components/EditorialBanner';
import PaginatedFrames from '../../components/PaginatedFrames';
import { notFound } from 'next/navigation';

export default async function Homepage() {
    const siteData = await getSheetData();

    if (!siteData.homepage) {
        return notFound();
    }

    // Find the menu section slug for the homepage collection
    const section = siteData.menuSections.find(s =>
        s.collections.some(c => c.slug === siteData.homepage!.slug)
    );

    if (!section) return notFound();

    return (
        <div>
            <EditorialBanner collection={siteData.homepage} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <PaginatedFrames
                    products={siteData.homepage.products}
                    collectionName={siteData.homepage.name}
                    menuSection={section.name}
                    baseUrl={`/${section.slug}/${siteData.homepage.slug}`}
                />
            </div>
        </div>
    );
}
