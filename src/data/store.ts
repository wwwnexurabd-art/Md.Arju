import { useState, useEffect } from 'react';
import { Product, CartItem, Order, NavigationPage } from '../types';
import { INITIAL_PRODUCTS } from './products';
import { CMSSettings, DeliverySettings } from '../../server/db';

const STORAGE_KEYS = {
  CART: 'nexura_cart_v1',
  WISHLIST: 'nexura_wishlist_v1',
  ADMIN_TOKEN: 'nexura_admin_token_v1',
  LANGUAGE: 'nexura_lang_v1',
};

export const DEFAULT_CMS: CMSSettings = {
  heroLabel: 'NEXURA.BD',
  heroHeadline: 'Welcome to Our Store',
  heroSubtext: 'Browse our latest collection of quality products.',
  heroImageUrl: '/images/hero/hero-gadgets.jpg',
  hotlineNumber: '+880 1700-000000',
  whatsappNumber: '8801700000000',
  supportEmail: 'www.nexura.bd@gmail.com',
  storeAddress: 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230, Bangladesh',
  topAnnouncement: 'Cash on Delivery Available Across Bangladesh'
};

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  window.dispatchEvent(new Event('nexura:cart_changed'));
}

export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveWishlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
  window.dispatchEvent(new Event('nexura:wishlist_changed'));
}

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
}

export function saveAdminToken(token: string | null) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  }
  window.dispatchEvent(new Event('nexura:auth_changed'));
}

export function useStore() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(getStoredCart);
  const [wishlist, setWishlist] = useState<string[]>(getStoredWishlist);
  const [cms, setCms] = useState<CMSSettings>(DEFAULT_CMS);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(getStoredAdminToken);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [language, setLanguageState] = useState<'EN' | 'BN'>('EN');

  // Load products, CMS, and Delivery from server
  const refreshStoreData = async () => {
    try {
      const [prodRes, cmsRes, delivRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()).catch(() => null),
        fetch('/api/settings/cms').then(r => r.json()).catch(() => null),
        fetch('/api/settings/delivery').then(r => r.json()).catch(() => null),
      ]);

      if (Array.isArray(prodRes) && prodRes.length > 0) {
        setProducts(prodRes);
      }
      if (cmsRes && cmsRes.heroHeadline) {
        setCms(cmsRes);
      }
      if (delivRes && delivRes.insideDhakaFee !== undefined) {
        setDeliverySettings(delivRes);
      }
    } catch (err) {
      console.error('Error refreshing store data:', err);
    }
  };

  // Verify Admin Session on mount
  useEffect(() => {
    refreshStoreData();

    const verifySession = async () => {
      const token = getStoredAdminToken();
      if (!token) {
        setAdminUser(null);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
        } else {
          saveAdminToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      }
    };

    verifySession();

    const handleCart = () => setCart(getStoredCart());
    const handleWishlist = () => setWishlist(getStoredWishlist());
    const handleAuth = () => {
      setAdminToken(getStoredAdminToken());
      verifySession();
    };

    window.addEventListener('nexura:cart_changed', handleCart);
    window.addEventListener('nexura:wishlist_changed', handleWishlist);
    window.addEventListener('nexura:auth_changed', handleAuth);

    return () => {
      window.removeEventListener('nexura:cart_changed', handleCart);
      window.removeEventListener('nexura:wishlist_changed', handleWishlist);
      window.removeEventListener('nexura:auth_changed', handleAuth);
    };
  }, []);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    const currentCart = getStoredCart();
    const existingIndex = currentCart.findIndex(
      item => item.product.id === product.id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...currentCart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...currentCart, { product, quantity, selectedColor, selectedSize }];
    }
    saveCart(updatedCart);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    const currentCart = getStoredCart();
    if (quantity <= 0) {
      currentCart.splice(index, 1);
    } else {
      currentCart[index].quantity = quantity;
    }
    saveCart([...currentCart]);
  };

  const removeFromCart = (index: number) => {
    const currentCart = getStoredCart();
    currentCart.splice(index, 1);
    saveCart([...currentCart]);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const current = getStoredWishlist();
    const exists = current.includes(productId);
    const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
    saveWishlist(updated);
  };

  // Submit Order to Server API
  const submitOrderToServer = async (orderPayload: any): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to place order');
      }
      const createdOrder: Order = await res.json();
      clearCart();
      refreshStoreData(); // Refresh stock in store
      return createdOrder;
    } catch (err) {
      console.error('Order creation failed:', err);
      throw err;
    }
  };

  const loginAdmin = (user: any, token: string) => {
    setAdminUser(user);
    saveAdminToken(token);
  };

  const logoutAdmin = async () => {
    const token = getStoredAdminToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {}
    }
    saveAdminToken(null);
    setAdminUser(null);
  };

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return {
    products,
    refreshProducts: refreshStoreData,
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
    setLanguage: setLanguageState
  };
}
