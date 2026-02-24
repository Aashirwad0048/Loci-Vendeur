import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import WholesaleHeader from '../components/Retailer/wholesale/WholesaleHeader';
import WholesaleFilters from '../components/Retailer/wholesale/WholesaleFilters';
import WholesaleCard from '../components/Retailer/wholesale/WholesaleCard';
import ProductDetailsModal from '../components/Retailer/wholesale/ProductDetailsModal';
import CartDrawer from '../components/Retailer/wholesale/CartDrawer';
import WholesalerMiniInfoModal from '../components/Retailer/wholesale/WholesalerMiniInfoModal';
import { Search, CheckCircle } from 'lucide-react';

const FALLBACK_IMAGE = 'https://via.placeholder.com/220x220?text=Product';

export default function WholesaleMarket() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get('/products?nearby=true');
        const raw = response.data?.data || [];

        const getSellerName = (value, wholesalerObj) => {
          if (typeof value === 'string') return value;
          if (value && typeof value === 'object') return value.name || 'Wholesaler';
          if (wholesalerObj?.name) return wholesalerObj.name;
          return 'Wholesaler';
        };

        const mapped = raw.map((item) => {
          const wholesalerObj = item.wholesaler || (item.wholesalerId && typeof item.wholesalerId === 'object' ? item.wholesalerId : null);
          const sellerName = getSellerName(item.wholesalerName, wholesalerObj);
          const wholesalerId = wholesalerObj?.id || wholesalerObj?._id || item.wholesalerId || null;

          return {
            id: item._id,
            name: item.name,
            image: item.image || FALLBACK_IMAGE,
            brand: item.brand || 'Loci Supply',
            category: item.category || 'General',
            price: item.price,
            wholesalePrice: item.price,
            minOrderQty: item.minOrderQty || 1,
            supplierStock: item.stock,
            supplier: sellerName,
            wholesalerId,
            wholesaler: {
              id: wholesalerId,
              name: sellerName,
              city: item.wholesalerCity || wholesalerObj?.city || item.city || '-',
            },
            rating: item.rating || '4.2',
            currentStoreStock: item.stock,
            city: item.city,
          };
        });

        setProducts(mapped);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const processedItems = useMemo(() => {
    const filtered = products.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'priceLowHigh':
        return sorted.sort((a, b) => a.wholesalePrice - b.wholesalePrice);
      case 'priceHighLow':
        return sorted.sort((a, b) => b.wholesalePrice - a.wholesalePrice);
      case 'discount':
        return sorted.sort((a, b) => {
          const discountA = (a.price - a.wholesalePrice) / a.price;
          const discountB = (b.price - b.wholesalePrice) / b.price;
          return discountB - discountA;
        });
      case 'moq':
        return sorted.sort((a, b) => a.minOrderQty - b.minOrderQty);
      default:
        return sorted;
    }
  }, [products, searchTerm, selectedCategory, sortBy]);

  const categories = ['All', ...new Set(products.map((item) => item.category))];

  const addToCart = (item, qty) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });

    setSelectedProduct(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateCartQty = (id, change) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = p.qty + change;
          return newQty >= p.minOrderQty ? { ...p, qty: newQty } : p;
        }
        return p;
      })
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((p) => p.id !== id));

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/wholesale/checkout', { state: { cart } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8 pb-12 font-sans relative">
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateCartQty}
        removeFromCart={removeFromCart}
        checkout={handleCheckout}
      />

      <div className="max-w-7xl mx-auto">
        <WholesaleHeader cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} onOpenCart={() => setIsCartOpen(true)} />

        <WholesaleFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading && <div className="py-20 text-center text-gray-600 font-semibold">Loading products...</div>}
        {error && <div className="py-20 text-center text-red-600 font-semibold">{error}</div>}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {processedItems.map((item) => (
                <WholesaleCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedProduct(item)}
                  onSellerInfo={() => setSelectedWholesaler(item.wholesaler)}
                />
              ))}
            </div>

            {processedItems.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              </div>
            )}
          </>
        )}

        {selectedProduct && <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
        <WholesalerMiniInfoModal wholesaler={selectedWholesaler} onClose={() => setSelectedWholesaler(null)} />
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-green-500 p-1 rounded-full text-white">
            <CheckCircle size={18} />
          </div>
          <span className="font-bold text-sm">Added to order successfully!</span>
          <button onClick={() => setIsCartOpen(true)} className="ml-4 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition">
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
