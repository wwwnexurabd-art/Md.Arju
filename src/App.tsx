import React, { useState, useEffect } from 'react';
import { useStore } from './data/store';
import { Product, NavigationPage, Order } from './types';
import { CATEGORIES } from './data/products';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderSuccessView } from './components/OrderSuccessView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CategoryShowcase } from './components/CategoryShowcase';
import { OffersSection } from './components/OffersSection';
import { StaticPages } from './components/StaticPages';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { Footer } from './components/Footer';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { WHATSAPP_NUMBER } from './data/products';

export default function App() {
  const {
    products,
    cart,
    cartTotalItems,
    cartSubtotal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    wishlist,
    toggleWishlist,
    submitOrderToServer,
    cms,
    deliverySettings,
    adminToken,
    adminUser,
    loginAdmin,
    logoutAdmin,
    language,
    setLanguage
  } = useStore();

  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [ordersForTracking, setOrdersForTracking] = useState<Order[]>([]);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Load orders for public tracking query if needed
  useEffect(() => {
    if (currentPage === 'order-tracking' && adminToken) {
      fetch('/api/orders', { headers: { 'Authorization': `Bearer ${adminToken}` } })
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setOrdersForTracking(data);
        })
        .catch(() => {});
    }
  }, [currentPage, adminToken]);

  const handleNavigate = (page: NavigationPage, param?: string) => {
    setCurrentPage(page);
    if (param) {
      if (page === 'order-tracking') {
        setTrackingOrderNumber(param);
      }
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage('products');
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setActiveCategory('all');
      setCurrentPage('products');
    }
  };

  const handleCardOrderNow = (product: Product) => {
    addToCart(product, 1);
    setCurrentPage('checkout');
  };

  const handleDirectOrder = (product: Product, quantity: number, color?: string, size?: string) => {
    addToCart(product, quantity, color, size);
    setCurrentPage('checkout');
  };

  const handleOrderSubmitted = async (orderData: any) => {
    try {
      const created = await submitOrderToServer(orderData);
      setLatestOrder(created);
      setOrdersForTracking(prev => [created, ...prev]);
      setCurrentPage('order-confirmation');
    } catch (err: any) {
      alert(`Order placement failed: ${err.message || 'Please check your information.'}`);
    }
  };

  const handleTrackSpecificOrder = (orderNumber: string) => {
    setTrackingOrderNumber(orderNumber);
    setCurrentPage('order-tracking');
  };

  // Filter products by search query if present
  const displayProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || 
           p.category.toLowerCase().includes(q) || 
           p.description.toLowerCase().includes(q) ||
           (p.sku && p.sku.toLowerCase().includes(q));
  });

  const offerProducts = products.filter(p => p.isOffer || (p.discountPercent && p.discountPercent > 15));
  const newArrivals = products.filter(p => p.isNewArrival || p.id.includes('007') || p.id.includes('008'));

  // If on admin route and logged in, render the full admin dashboard
  if (currentPage === 'admin' && adminToken && adminUser) {
    return (
      <AdminLayout
        user={adminUser}
        token={adminToken}
        onLogout={logoutAdmin}
        onExitToStore={() => setCurrentPage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#F10D27]/20 selection:text-[#F10D27]">
      {/* Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartTotalItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        cms={cms}
        adminUser={adminUser}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <>
            {/* Emerald Green Hero Banner matching reference image */}
            <HeroBanner
              onOrderNow={() => {
                if (products[0]) {
                  handleCardOrderNow(products[0]);
                } else {
                  handleNavigate('products');
                }
              }}
              onViewOffers={() => handleNavigate('offers')}
              language={language}
              cms={cms}
            />

            {/* Popular Categories Showcase */}
            <CategoryShowcase
              onSelectCategory={handleSelectCategory}
              language={language}
            />

            {/* Main Product Collection matching reference with 1, 2, 3 column switcher */}
            <ProductGrid
              products={displayProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOrderNow={handleCardOrderNow}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              categories={CATEGORIES}
              language={language}
            />

            {/* Weekly Special Offer Banner */}
            <OffersSection
              onOrderNow={handleCardOrderNow}
              onSelectProduct={(p) => setSelectedProduct(p)}
              offerProducts={offerProducts}
              language={language}
            />
          </>
        )}

        {/* ALL PRODUCTS / FILTERED CATALOG */}
        {currentPage === 'products' && (
          <div className="py-6">
            <ProductGrid
              products={displayProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOrderNow={handleCardOrderNow}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              categories={CATEGORIES}
              language={language}
            />
          </div>
        )}

        {/* SPECIAL OFFERS PAGE */}
        {currentPage === 'offers' && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <h1 className="text-3xl font-black text-[#10183F] font-heading mb-1">
                Special Discount Offers
              </h1>
              <p className="text-sm text-slate-500">
                Exclusive bundled deals and seasonal price cuts across all categories.
              </p>
            </div>
            <ProductGrid
              products={offerProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOrderNow={handleCardOrderNow}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              activeCategory="all"
              onSelectCategory={setActiveCategory}
              categories={CATEGORIES}
              language={language}
            />
          </div>
        )}

        {/* NEW ARRIVALS */}
        {currentPage === 'new-arrivals' && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <h1 className="text-3xl font-black text-[#10183F] font-heading mb-1">
                New Arrivals
              </h1>
              <p className="text-sm text-slate-500">
                Discover the latest generation of smart electronics, mechanical keyboards, and audio peripherals.
              </p>
            </div>
            <ProductGrid
              products={newArrivals.length > 0 ? newArrivals : products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOrderNow={handleCardOrderNow}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              activeCategory="all"
              onSelectCategory={setActiveCategory}
              categories={CATEGORIES}
              language={language}
            />
          </div>
        )}

        {/* CHECKOUT FLOW */}
        {currentPage === 'checkout' && (
          <CheckoutView
            items={cart}
            onBackToCart={() => handleNavigate('home')}
            onSubmitOrder={handleOrderSubmitted}
            language={language}
            deliverySettings={deliverySettings}
          />
        )}

        {/* ORDER SUCCESS PAGE */}
        {currentPage === 'order-confirmation' && latestOrder && (
          <OrderSuccessView
            order={latestOrder}
            onNavigate={handleNavigate}
            onTrackOrder={handleTrackSpecificOrder}
            language={language}
          />
        )}

        {/* ORDER TRACKING */}
        {currentPage === 'order-tracking' && (
          <OrderTrackingView
            orders={ordersForTracking.length > 0 ? ordersForTracking : (latestOrder ? [latestOrder] : [])}
            initialOrderNumber={trackingOrderNumber}
            language={language}
          />
        )}

        {/* ADMIN LOGIN SCREEN (If not authenticated) */}
        {currentPage === 'admin' && (!adminToken || !adminUser) && (
          <AdminLogin
            onLoginSuccess={(user, token) => {
              loginAdmin(user, token);
            }}
            onClose={() => setCurrentPage('home')}
          />
        )}

        {/* STATIC PAGES (About, Contact, FAQ, Policies) */}
        {['about', 'contact', 'faq', 'shipping-policy', 'refund-policy', 'privacy-policy', 'terms'].includes(currentPage) && (
          <StaticPages
            page={currentPage}
            onNavigate={handleNavigate}
            language={language}
            cms={cms}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, col, size) => addToCart(prod, qty, col, size)}
        onDirectOrder={handleDirectOrder}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        language={language}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          handleNavigate('checkout');
        }}
        onViewProduct={(p) => setSelectedProduct(p)}
        language={language}
      />

      {/* Floating Quick Action Buttons on Mobile */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5 sm:hidden">
        {/* WhatsApp Float */}
        <a
          href={`https://wa.me/${cms?.whatsappNumber || WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg active:scale-95"
          aria-label="WhatsApp Us"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Cart Float */}
        {cartTotalItems > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-12 h-12 rounded-full bg-[#F10D27] text-white flex items-center justify-center shadow-lg active:scale-95 relative cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#10183F] text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              {cartTotalItems}
            </span>
          </button>
        )}
      </div>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        language={language}
        cms={cms}
      />
    </div>
  );
}
