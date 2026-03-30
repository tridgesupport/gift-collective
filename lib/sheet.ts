import Papa from 'papaparse';
import { slugify } from './slugify';
import { Asset, Product, NavNode, SiteData } from './types';

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

    const navTree: NavNode[] = [];
    let homepage: NavNode | null = null;

    for (const row of data) {
        const levels = ['level_1', 'level_2', 'level_3', 'level_4', 'level_5']
            .map(k => (row[k] || '').trim())
            .filter(Boolean);

        const productName = (row.product_name || '').trim();

        if (levels.length === 0 || !productName) {
            console.warn('Skipping row due to missing level or product name', row);
            continue;
        }

        // Build product
        const assets: Asset[] = [];
        for (let i = 1; i <= 4; i++) {
            const urlRaw = row[`asset_${i}_url`];
            if (urlRaw) {
                const url = formatUrl(urlRaw.trim());
                const typeRaw = row[`asset_${i}_type`];
                const type = typeRaw?.trim().toLowerCase() === 'video' ? 'video' : 'image';
                if (url) assets.push({ url, type });
            }
        }

        const priceVisible = row.price_visible?.toString().trim().toLowerCase() === 'true';
        const soldOut = row.sold_out?.toString().trim().toLowerCase() === 'yes';
        let minOrderQty = parseInt(row.min_order_qty?.toString().trim() || '20', 10);
        if (isNaN(minOrderQty)) minOrderQty = 20;

        const product: Product = {
            name: productName,
            slug: slugify(productName),
            brand: (row.brand || '').trim(),
            description: (row.product_description || '').trim(),
            price: row.price ? parseFloat(row.price) : undefined,
            priceVisible,
            soldOut,
            minOrderQty,
            assets,
        };

        // Walk/create tree following the level hierarchy
        let currentChildren = navTree;
        let currentPath = '';

        for (let i = 0; i < levels.length; i++) {
            const levelName = levels[i];
            const slug = slugify(levelName);
            currentPath = currentPath ? `${currentPath}/${slug}` : slug;

            let node = currentChildren.find(n => n.slug === slug);
            if (!node) {
                node = {
                    name: levelName,
                    slug,
                    path: currentPath,
                    description: '',
                    editorialUrl: '',
                    editorialType: 'image',
                    isHomepage: false,
                    children: [],
                    products: [],
                };
                currentChildren.push(node);
            }

            if (i === levels.length - 1) {
                // Deepest level: apply editorial metadata (first row wins) and add product
                if (!node.editorialUrl) {
                    node.description = (row.collection_description || '').trim();
                    node.editorialUrl = formatUrl((row.collection_editorial_url || '').trim());
                    node.editorialType = row.collection_editorial_type?.trim().toLowerCase() === 'video' ? 'video' : 'image';
                }
                const isHomepage = row.is_homepage?.toString().trim().toLowerCase() === 'true';
                if (isHomepage) {
                    node.isHomepage = true;
                    if (!homepage) homepage = node;
                }
                node.products.push(product);
            } else {
                currentChildren = node.children;
            }
        }
    }

    // Fallback: use first leaf node with products as homepage
    if (!homepage && navTree.length > 0) {
        const findFirstLeaf = (nodes: NavNode[]): NavNode | null => {
            for (const node of nodes) {
                if (node.products.length > 0) return node;
                const leaf = findFirstLeaf(node.children);
                if (leaf) return leaf;
            }
            return null;
        };
        homepage = findFirstLeaf(navTree);
    }

    return { navTree, homepage };
}
