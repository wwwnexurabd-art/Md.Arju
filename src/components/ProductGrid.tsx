import React, { useState } from 'react';
import { Product, GridColumns } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: { id: string; name: string }[];
  language: 'EN' | 'BN';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onOrderNow,
  wishlist,
  onToggleWishlist,
  activeCategory,
  onSelectCategory,
  categories,
  language,
}) => {
  const [columns, setColumns] = useState<GridColumns>(3);
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured');

  // Filter products by category
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => {
        const catObj = categories.find(c => c.id === activeCategory);
        if (!catObj) return true;
        return p.category.toLowerCase().includes(catObj.name.toLowerCase()) || 
               catObj.name.toLowerCase().includes(p.category.toLowerCase());
      });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    return 0; // featured default
  });

  return (
    <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">
      {/* Section Header with exact styling from reference */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10183F] font-heading tracking-tight mb-2">
            {language === 'BN' ? 'আপনার পছন্দের পণ্যটি নির্বাচন করুন' : 'Select Your Favorite Product'}
          </h2>
          {/* Red underline accent bar matching reference image */}
          <div className="w-14 h-1 bg-[#F10D27] rounded-full mb-2" />
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            {language === 'BN' 
              ? 'আপনার জন্য সবচেয়ে আকর্ষণীয় এবং দরকারী পণ্যগুলো খুঁজে নিন' 
              : 'More attractive products that may be useful for you'}
          </p>
        </div>

        {/* Right Controls: Sort & 1/2/3 Grid Layout Selector */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Sort Dropdown */}
          <div className="relative flex items-center flex-1 sm:flex-initial">
            <ArrowUpDown className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto pl-8 pr-4 min-h-[40px] py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20"
            >
              <option value="featured">Featured First</option>
              <option value="discount">Biggest Discount</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {/* Grid Layout Selector: 1, 2, 3 columns matching reference */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            {/* 1 Column Button */}
            <button
              onClick={() => setColumns(1)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 min-h-[34px] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                columns === 1
                  ? 'bg-[#10183F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="1 Column List View"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="12" height="10" rx="1.5" />
              </svg>
              <span>1</span>
            </button>

            {/* 2 Columns Button */}
            <button
              onClick={() => setColumns(2)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 min-h-[34px] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                columns === 2
                  ? 'bg-[#10183F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="2 Columns Grid"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="5" height="10" rx="1" />
                <rect x="9" y="3" width="5" height="10" rx="1" />
              </svg>
              <span>2</span>
            </button>

            {/* 3 Columns Button */}
            <button
              onClick={() => setColumns(3)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 min-h-[34px] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                columns === 3
                  ? 'bg-[#10183F] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="3 Columns Grid"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="3" width="3" height="10" rx="0.5" />
                <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
                <rect x="11" y="3" width="3" height="10" rx="0.5" />
              </svg>
              <span>3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Segmented Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 sm:mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 sm:px-4 min-h-[40px] py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#10183F] text-white shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid according to selected column layout */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
          <p className="text-slate-500 font-medium mb-3">No products found matching this filter.</p>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-sm font-bold text-[#F10D27] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-3 sm:gap-5 lg:gap-6 ${
            columns === 1
              ? 'grid-cols-1 max-w-2xl mx-auto'
              : columns === 2
              ? 'grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
          }`}
        >
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onOrderNow={onOrderNow}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              language={language}
            />
          ))}
        </div>
      )}
    </section>
  );
};
