export type Asset = {
  url: string
  type: 'image' | 'video'
}

export type Product = {
  name: string
  slug: string
  brand: string
  description: string
  price?: number
  priceVisible: boolean
  minOrderQty: number
  assets: Asset[]
}

export type NavNode = {
  name: string
  slug: string
  path: string              // full URL path e.g. "curated/christmas/hermes"
  description: string
  editorialUrl: string
  editorialType: 'image' | 'video'
  isHomepage: boolean
  children: NavNode[]
  products: Product[]
}

export type SiteData = {
  navTree: NavNode[]
  homepage: NavNode | null
}
