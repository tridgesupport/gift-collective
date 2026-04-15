import { getSheetData } from '@/lib/sheet';
import Nav from '@/components/Nav';
import NavMobile from '@/components/NavMobile';
import PublishButton from '@/components/PublishButton';
import CartWishlistProvider from '@/components/CartWishlistProvider';
import { NavNode, SearchableProduct } from '@/lib/types';

function flattenProducts(nodes: NavNode[], menuSection = ''): SearchableProduct[] {
    const results: SearchableProduct[] = [];
    for (const node of nodes) {
        const section = menuSection || node.name;
        for (const p of node.products) {
            results.push({
                name: p.name,
                slug: p.slug,
                brand: p.brand,
                description: p.description,
                imageUrl: p.assets[0]?.url || '',
                productUrl: `/${node.path}/${p.slug}`,
                collectionName: node.name,
            });
        }
        results.push(...flattenProducts(node.children, section));
    }
    return results;
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const siteData = await getSheetData();
    const allProducts = flattenProducts(siteData.navTree);

    return (
        <CartWishlistProvider>
        <div className="min-h-screen flex flex-col bg-cream">
            <Nav navTree={siteData.navTree} allProducts={allProducts} />
            <NavMobile navTree={siteData.navTree} allProducts={allProducts} />
            {process.env.NEXT_PUBLIC_IS_PREVIEW === 'true' && <PublishButton />}
            <main className="flex-1 mt-16 md:mt-20">
                {children}
            </main>
            <footer className="py-12 md:py-20 mt-12 bg-cream">
                <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] text-warm-dark uppercase tracking-[0.15em] font-semibold">
                    <p className="mb-6 md:mb-0">&copy; 2024 THE GIFT COLLECTIVE. ALL RIGHTS RESERVED.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-gold transition-colors">PRIVACY</a>
                        <a href="#" className="hover:text-gold transition-colors">TERMS</a>
                        <a href="#" className="hover:text-gold transition-colors">INSTAGRAM</a>
                    </div>
                </div>
            </footer>
        </div>
        </CartWishlistProvider>
    );
}
