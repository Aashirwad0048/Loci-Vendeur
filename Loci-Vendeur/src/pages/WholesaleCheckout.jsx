import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import CheckoutDeliveryDetails from '../components/Retailer/wholesale/checkout/CheckoutDeliveryDetails';
import CheckoutPayment from '../components/Retailer/wholesale/checkout/CheckoutPayment';
import CheckoutSummary from '../components/Retailer/wholesale/checkout/CheckoutSummary';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function WholesaleCheckout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const cart = state?.cart || [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = cart.reduce((acc, item) => acc + item.wholesalePrice * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const isOnlinePayment = paymentMethod !== 'cod';

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

      const payload = {
        city: currentUser.city || 'Delhi',
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
      };

      const response = await API.post('/orders', payload);
      const order = response.data?.data;

      if (!order?._id) {
        throw new Error('Invalid order response');
      }

      if (isOnlinePayment) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay checkout');
        }

        const paymentOrderRes = await API.post(`/orders/${order._id}/payment/order`);
        const paymentData = paymentOrderRes.data?.data;

        if (!paymentData?.razorpayOrderId || !paymentData?.keyId) {
          throw new Error('Failed to initialize payment');
        }

        const currentUserName = currentUser.name || 'Retailer';
        const currentUserEmail = currentUser.email || '';

        await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: 'Loci Vendeur',
            description: `Order ${String(order._id).slice(-6).toUpperCase()}`,
            order_id: paymentData.razorpayOrderId,
            prefill: {
              name: currentUserName,
              email: currentUserEmail,
            },
            notes: {
              orderId: String(order._id),
            },
            theme: {
              color: '#111827',
            },
            handler: async (paymentResult) => {
              try {
                await API.post(`/orders/${order._id}/payment/verify`, {
                  razorpayOrderId: paymentResult.razorpay_order_id,
                  razorpayPaymentId: paymentResult.razorpay_payment_id,
                  razorpaySignature: paymentResult.razorpay_signature,
                });
                resolve();
              } catch (verifyError) {
                reject(
                  new Error(
                    verifyError.response?.data?.message || 'Payment verification failed. Please contact support.'
                  )
                );
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user')),
            },
          });

          rzp.open();
        });
      }

      navigate(`/wholesale/success/${order._id}`, {
        state: {
          paymentMethod,
          fallbackAmount: total,
          fallbackItemsCount: cart.reduce((acc, item) => acc + item.qty, 0),
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <button onClick={() => navigate('/wholesale')} className="mt-4 text-blue-600 hover:underline">
          Go back to Market
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8 pb-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        {error && <p className="mb-6 text-sm font-semibold text-red-600">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <CheckoutDeliveryDetails />
            <CheckoutPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          </div>

          <div className="lg:col-span-4">
            <CheckoutSummary
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              loading={loading}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
