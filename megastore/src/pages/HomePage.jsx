import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/features/productsSlice'
import { fetchCategories } from '../redux/features/categoriesSlice'
import HeroBanner from '../components/home/HeroBanner'
import SectionHeader from '../components/home/SectionHeader'
import CategoryCards from '../components/home/CategoryCards'
import BenefitsSection from '../components/home/BenefitsSection'
import NewsletterSection from '../components/home/NewsletterSection'
import ProductGrid from '../components/product/ProductGrid'
import SkeletonGrid from '../components/common/Skeleton'

const HomePage = () => {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((s) => s.products)
  const { items: categories } = useSelector((s) => s.categories)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100, skip: 0 }))
    if (!categories.length) dispatch(fetchCategories())
  }, [dispatch])

  // Derive different sections from loaded products
  const featured = products.filter((p) => p.rating >= 4.5).slice(0, 8)
  const popular = products
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
  const discounted = products
    .filter((p) => p.discountPercentage >= 15)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 8)
  const trending = products
    .filter((p) => p.stock > 50)
    .slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 py-12">
        {/* Benefits */}
        <BenefitsSection />

        {/* Categories */}
        <section>
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse our wide selection of product categories"
            viewAllLink="/categories"
          />
          <CategoryCards />
        </section>

        {/* Featured Products */}
        <section>
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked top-rated items just for you"
            viewAllLink="/products"
          />
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <ProductGrid products={featured} />
          )}
        </section>

        {/* Popular Products */}
        <section>
          <SectionHeader
            title="Most Popular"
            subtitle="What everyone is buying right now"
            viewAllLink="/products"
          />
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <ProductGrid products={popular} />
          )}
        </section>

        {/* Discount Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="relative text-white">
            <p className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-1">Limited Time Offer</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Save up to 50% OFF</h2>
            <p className="text-white/80">On thousands of products across all categories</p>
          </div>
          <a
            href="/products"
            className="relative flex-shrink-0 px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
          >
            Grab the Deal
          </a>
        </div>

        {/* Discounted Products */}
        <section>
          <SectionHeader
            title="Hot Deals"
            subtitle="Biggest discounts available right now"
            viewAllLink="/products"
          />
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <ProductGrid products={discounted} />
          )}
        </section>

        {/* Trending */}
        <section>
          <SectionHeader
            title="Trending Now"
            subtitle="Fast-moving products you don't want to miss"
            viewAllLink="/products"
          />
          {loading ? (
            <SkeletonGrid count={8} />
          ) : (
            <ProductGrid products={trending} />
          )}
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </div>
    </div>
  )
}

export default HomePage
