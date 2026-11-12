import React from 'react';
import { 
  Shirt, 
  Headphones, 
  Gamepad2, 
  Smartphone, 
  Watch, 
  Home, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategoryShowcaseProps {
  onSelectCategory: (categoryId: string) => void;
  language: 'EN' | 'BN';
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Shirt': return <Shirt className="w-6 h-6" />;
    case 'Headphones': return <Headphones className="w-6 h-6" />;
    case 'Gamepad2': return <Gamepad2 className="w-6 h-6" />;
    case 'Smartphone': return <Smartphone className="w-6 h-6" />;
    case 'Watch': return <Watch className="w-6 h-6" />;
    case 'Home': return <Home className="w-6 h-6" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  language,
}) => {
  // Exclude 'all' from showcase tiles
  const showcaseCategories = CATEGORIES.filter(c => c.id !== 'all');

  return (
    <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10183F] font-heading tracking-tight mb-2">
            {language === 'BN' ? 'জনপ্রিয় ক্যাটাগরি' : 'Explore by Category'}
          </h2>
          <div className="w-12 h-1 bg-[#F10D27] rounded-full mb-1" />
          <p className="text-sm text-slate-500">
            {language === 'BN' 
              ? 'আপনার প্রয়োজনীয় গ্যাজেট এবং ফ্যাশন আইটেম ব্রাউজ করুন' 
              : 'Hand-picked collections designed for modern lifestyle & tech lovers'}
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs sm:text-sm font-bold text-[#F10D27] hover:text-[#d60a20] flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {showcaseCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50/70 group-hover:bg-[#F10D27] text-[#F10D27] group-hover:text-white flex items-center justify-center mb-3 transition-colors duration-300">
              {getCategoryIcon(cat.icon)}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-[#10183F] group-hover:text-[#F10D27] transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {cat.count} items
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
