import { getSheetData } from '@/lib/sheet';
import { redirect, notFound } from 'next/navigation';

export default async function MenuSectionPage(props: { params: Promise<{ menuSlug: string }> }) {
    const { menuSlug } = await props.params;
    const siteData = await getSheetData();

    const section = siteData.menuSections.find(s => s.slug === menuSlug);
    if (!section || section.collections.length === 0) return notFound();

    // Redirect to the first collection under this menu section
    redirect(`/${menuSlug}/${section.collections[0].slug}`);
}
