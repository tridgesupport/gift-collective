import { getSheetData } from '@/lib/sheet';
import { NavNode } from '@/lib/types';
import EditorialBanner from '@/components/EditorialBanner';
import PaginatedFrames from '@/components/PaginatedFrames';
import ProductGallery from '@/components/ProductGallery';
import InquiryButton from '@/components/InquiryButton';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';

function findNode(tree: NavNode[], slugs: string[]): NavNode | null {
    if (slugs.length === 0) return null;
    const [first, ...rest] = slugs;
    const node = tree.find(n => n.slug === first);
    if (!node) return null;
    if (rest.length === 0) return node;
    return findNode(node.children, rest);
}

function getAncestors(tree: NavNode[], slugs: string[]): NavNode[] {
    const ancestors: NavNode[] = [];
    let currentTree = tree;
    for (const slug of slugs) {
        const node = currentTree.find(n => n.slug === slug);
        if (!node) break;
        ancestors.push(node);
        currentTree = node.children;
    }
    return ancestors;
}

export async function generateStaticParams() {
    const siteData = await getSheetData();
    const paths: { slug: string[] }[] = [];

    function walkNode(node: NavNode) {
        const slugParts = node.path.split('/');
        paths.push({ slug: slugParts });

        for (const child of node.children) {
            walkNode(child);
        }

        for (const product of node.products) {
            paths.push({ slug: [...slugParts, product.slug] });
        }
    }

    for (const node of siteData.navTree) {
        walkNode(node);
    }

    return paths;
}

export default async function CatchAllPage(props: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await props.params;
    const siteData = await getSheetData();

    // Try to match as a nav node
    const node = findNode(siteData.navTree, slug);

    if (node) {
        if (node.children.length > 0 && node.products.length === 0) {
            // Intermediate node: redirect to first child
            redirect(`/${node.children[0].path}`);
        }

        // Leaf node with products: render collection page
        const topLevelNode = siteData.navTree.find(n => n.slug === slug[0]);
        return (
            <div>
                <EditorialBanner node={node} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <PaginatedFrames
                        products={node.products}
                        collectionName={node.name}
                        menuSection={topLevelNode?.name || slug[0]}
                        baseUrl={`/${node.path}`}
                    />
                </div>
            </div>
        );
    }

    // Try to match as a product: parent = all but last segment, last = product slug
    if (slug.length >= 2) {
        const parentSlugs = slug.slice(0, -1);
        const productSlug = slug[slug.length - 1];
        const parentNode = findNode(siteData.navTree, parentSlugs);

        if (parentNode) {
            const product = parentNode.products.find(p => p.slug === productSlug);
            if (product) {
                const ancestors = getAncestors(siteData.navTree, parentSlugs);
                const breadcrumb = ancestors.map(n => n.name).join(' / ');

                return (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 pt-20">
                        <Link href={`/${parentNode.path}`} className="inline-block text-xs uppercase tracking-widest text-muted hover:text-gold transition-colors mb-8">
                            ← Back
                        </Link>

                        <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted mb-12 border-b border-sand pb-4">
                            {breadcrumb}
                        </div>

                        <div className="bg-cream border border-sand p-6 md:p-12 shadow-xl shadow-warm-dark/5">
                            <ProductGallery assets={product.assets} priority />

                            <div className="mt-12 text-center max-w-2xl mx-auto">
                                {product.brand && (
                                    <p className="text-[9px] uppercase tracking-widest text-muted mb-2">{product.brand}</p>
                                )}
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
                                        collectionName={parentNode.name}
                                        menuSection={ancestors[0]?.name || slug[0]}
                                        variant="primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }

    return notFound();
}
