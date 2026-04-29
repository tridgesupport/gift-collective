import { slugify } from './slugify';
import { Asset, Product, NavNode, SiteData } from './types';

function formatUrl(url: string): string {
    if (!url) return '';
    return `/api/image?url=${encodeURIComponent(url)}`;
}

export async function getSheetData(): Promise<SiteData> {
    const apiUrl = process.env.CATALOGUE_API_URL || 'https://tgc-self-serve-upload.onrender.com/api/catalogue';
    const revalidateSeconds = Number(process.env.SHEET_REVALIDATE_SECONDS) || 300;

    const response = await fetch(apiUrl, {
        next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch catalogue: ${response.statusText}`);
    }

    const json = await response.json();
    const data: any[] = json.products || [];

    const navTree: NavNode[] = [];
    let homepage: NavNode | null = null;

    for (const row of data) {
        const levels = ['level_1', 'level_2', 'level_3', 'level_4', 'level_5']
            .map(k => (row[k] || '').trim())
            .filter(Boolean);

        const productName = (row.title || '').trim();

        if (levels.length === 0 || !productName) {
            continue;
        }

        if (row.show_product === false) continue;

        // assets is a JSON-encoded string
        let assets: Asset[] = [];
        try {
            const parsed = typeof row.assets === 'string' ? JSON.parse(row.assets) : (row.assets || []);
            assets = (parsed as { url: string; type: string }[]).map(a => ({
                url: formatUrl(a.url),
                type: a.type === 'video' ? 'video' : 'image',
            }));
        } catch {
            // malformed assets — no images for this product
        }

        const priceVisible = row.price_visible === true;
        const soldOut = row.sold_out === true;
        let minOrderQty = typeof row.min_order_qty === 'number'
            ? row.min_order_qty
            : parseInt(row.min_order_qty?.toString() || '20', 10);
        if (isNaN(minOrderQty)) minOrderQty = 20;

        const product: Product = {
            name: productName,
            slug: slugify(productName),
            brand: (row.vendor_brand_name || '').trim(),
            description: (row.description || '').trim(),
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
                if (!node.editorialUrl) {
                    node.description = (row.collection_description || '').trim();
                    node.editorialUrl = formatUrl((row.collection_editorial_url || '').trim());
                    node.editorialType = row.collection_editorial_type?.trim().toLowerCase() === 'video' ? 'video' : 'image';
                }
                if (row.is_homepage === true) {
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
