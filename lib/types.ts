export type Asset = {
  url: string
  type: 'image' | 'video'
}

export type Product = {
  name: string
  slug: string
  description: string
  price?: number
  priceVisible: boolean
  minOrderQty: number
  assets: Asset[]
}

export type Collection = {
  name: string
  slug: string
  description: string
  editorialUrl: string
  editorialType: 'image' | 'video'
  isHomepage: boolean
  products: Product[]
}

export type MenuSection = {
  name: string
  slug: string
  collections: Collection[]
}

export type SiteData = {
  menuSections: MenuSection[]
  homepage: Collection | null
}
