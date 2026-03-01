import Papa from 'papaparse';
import { slugify } from './slugify';
import { Asset, Product, Collection, MenuSection, SiteData } from './types';

function formatUrl(url: string): string {
    if (!url) return '';

    let targetUrl = url;

    // Convert Google Drive share URLs to the direct download endpoint
    const drivePatterns = [
        /\/d\/([a-zA-Z0-9_-]+)/,     // /file/d/ID or /d/ID
        /[?&]id=([a-zA-Z0-9_-]+)/,   // ?id=ID or &id=ID
    ];
    for (const pattern of drivePatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            targetUrl = `https://drive.usercontent.google.com/download?id=${match[1]}&export=download&authuser=0`;
            break;
        }
    }

    // Proxy any public URL through our API so assets are served from our
    // domain, bypassing CORS/referrer restrictions and caching at Vercel's edge
    return `/api/image?url=${encodeURIComponent(targetUrl)}`;
}

export async function getSheetData(): Promise<SiteData> {
    const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;
    if (!sheetUrl) {
        throw new Error('GOOGLE_SHEET_CSV_URL is missing in environment variables.');
    }

    const revalidateSeconds = Number(process.env.SHEET_REVALIDATE_SECONDS) || 300;

    const response = await fetch(sheetUrl, {
        next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();

    const { data } = Papa.parse<any>(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    const menuSectionsMap = new Map<string, MenuSection>();
    let homepage: Collection | null = null;

    for (const row of data) {
        const menuSectionName = (row.menu_section || '').trim();
        const collectionName = (row.collection_name || '').trim();
        const productName = (row.product_name || '').trim();

        if (!menuSectionName || !collectionName || !productName) {
            console.warn('Skipping row due to missing section, collection, or product name', row);
            continue;
        }

        const menuSectionSlug = slugify(menuSectionName);
        const collectionSlug = slugify(collectionName);
        const productSlug = slugify(productName);

        if (!menuSectionsMap.has(menuSectionSlug)) {
            menuSectionsMap.set(menuSectionSlug, {
                name: menuSectionName,
                slug: menuSectionSlug,
                collections: []
            });
        }

        const section = menuSectionsMap.get(menuSectionSlug)!;
        let collection = section.collections.find(c => c.slug === collectionSlug);

        if (!collection) {
            const isHomepage = row.is_homepage?.toString().trim().toLowerCase() === 'true';
            collection = {
                name: collectionName,
                slug: collectionSlug,
                description: row.collection_description?.trim() || '',
                editorialUrl: formatUrl(row.collection_editorial_url?.trim() || ''),
                editorialType: row.collection_editorial_type?.trim().toLowerCase() === 'video' ? 'video' : 'image',
                isHomepage,
                products: []
            };
            section.collections.push(collection);

            if (isHomepage && !homepage) {
                homepage = collection;
            }
        }

        const assets: Asset[] = [];
        for (let i = 1; i <= 4; i++) {
            const urlRaw = row[`asset_${i}_url`];
            if (urlRaw) {
                const url = formatUrl(urlRaw.trim());
                const typeRaw = row[`asset_${i}_type`];
                const type = typeRaw?.trim().toLowerCase() === 'video' ? 'video' : 'image';
                if (url) {
                    assets.push({ url, type });
                }
            }
        }

        const priceVisible = row.price_visible?.toString().trim().toLowerCase() === 'true';
        let minOrderQty = parseInt(row.min_order_qty?.toString().trim() || '20', 10);
        if (isNaN(minOrderQty)) minOrderQty = 20;

        const product: Product = {
            name: productName,
            slug: productSlug,
            description: row.product_description?.trim() || '',
            price: row.price ? parseFloat(row.price) : undefined,
            priceVisible,
            minOrderQty,
            assets
        };

        collection.products.push(product);
    }

    const siteData: SiteData = {
        menuSections: Array.from(menuSectionsMap.values()),
        homepage
    };

    if (!siteData.homepage && siteData.menuSections.length > 0 && siteData.menuSections[0].collections.length > 0) {
        siteData.homepage = siteData.menuSections[0].collections[0];
    }

    return siteData;
}
