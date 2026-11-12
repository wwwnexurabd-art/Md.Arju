import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  ArrowRight, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  MessageCircle,
  Star
} from 'lucide-react';
import { Product } from '../types';
import { WHATSAPP_NUMBER } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onDirectOrder: (product: Product, quantity: number, color?: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  language: 'EN' | 'BN';
}

export const ProductModal: React.FC<ProductModalProps> = (props) => {
  if (!props.product) return null;
  return <ProductModalContent key={props.product.id} {...props} product={props.product} />;
};

const ProductModalContent: React.FC<Omit<ProductModalProps, 'product'> & { product: Product }> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
  isWishlisted,
  onToggleWishlist,
  language,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.find(v => v.type === 'color')?.options[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.find(v => v.type === 'size')?.options[0] || ''
  );
  const [copied, setCopied] = useState(false);

  const imagesList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorVariant = product.variants?.find(v => v.type === 'color');
  const sizeVariant = product.variants?.find(v => v.type === 'size');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[92dvh] overflow-y-auto">
          {/* Left Column: Image Gallery (Cols 1-6) */}
          <div className="md:col-span-6 p-5 sm:p-7 lg:p-8 bg-slate-50 flex flex-col justify-between">
            <div>
              {/* Main Image Display */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs mb-4">
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-[#F10D27] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                    -{product.discountPercent}% OFF
                  </span>
                )}
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#F10D27] scale-105'
                          : 'border-slate-200 hover:border-slate-400 opacity-70'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#F10D27] mb-1" />
                <span className="font-semibold text-slate-800">Fast Delivery</span>
                <span className="text-[10px] text-slate-500">24-48 Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-semibold text-slate-800">7 Days Return</span>
                <span className="text-[10px] text-slate-500">Easy Replacement</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-semibold text-slate-800">100% Genuine</span>
                <span className="text-[10px] text-slate-500">Verified Product</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Purchase Module (Cols 7-12) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-black text-[#10183F] font-heading leading-tight mb-3">
                {product.name}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <span className="text-2xl sm:text-3xl font-black text-[#F10D27] font-mono tracking-tight">
                  ৳{product.price.toLocaleString('en-BD')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-slate-400 text-base line-through font-mono">
                    ৳{product.originalPrice.toLocaleString('en-BD')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="ml-auto text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    Save ৳{(product.originalPrice! - product.price).toLocaleString('en-BD')}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Color Variant Selector */}
              {colorVariant && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-2">
                    {colorVariant.name}: <span className="text-slate-600 font-medium normal-case">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorVariant.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedColor(opt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selectedColor === opt
                            ? 'bg-[#10183F] text-white border-[#10183F] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variant Selector */}
              {sizeVariant && (
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-2">
                    {sizeVariant.name}: <span className="text-slate-600 font-medium normal-case">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizeVariant.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedSize(opt)}
                        className={`min-w-10 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === opt
                            ? 'bg-[#10183F] text-white border-[#10183F] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Stock */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Quantity
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-base hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800 font-mono">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      disabled={quantity >= product.stockCount}
                      className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-base hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="sm:mt-5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    In Stock ({product.stockCount} units available)
                  </span>
                </div>
              </div>

              {/* Specifications table snippet */}
              {product.specifications && (
                <div className="mb-6 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-[#10183F] uppercase tracking-wider mb-2">Key Specifications</h4>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-slate-400 font-medium">{key}</dt>
                        <dd className="text-slate-800 font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Cart */}
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm min-h-[46px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-700" />
                  <span>Add to Cart</span>
                </button>

                {/* Direct Order Now button */}
                <button
                  onClick={() => {
                    onDirectOrder(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-sm min-h-[46px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secondary utility actions */}
              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 font-medium hover:text-[#F10D27] transition-colors cursor-pointer ${
                    isWishlisted ? 'text-[#F10D27] font-semibold' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#F10D27]' : ''}`} />
                  <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <div className="flex items-center gap-4">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(product.name)}%20(SKU:%20${product.sku})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Query</span>
                  </a>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
