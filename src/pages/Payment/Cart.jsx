import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { BACKEND_URL } from '../../utils/config';
import { showToast } from '../../utils/toastUtil';
import LoadingAndErrorDisplay from '../../components/Shared/Errors/LoadingAndErrorDisplay';
import { Link } from 'react-router-dom';
import { DISCOUNT_AMOUNT } from '../../utils/config';
import { HashLink } from 'react-router-hash-link';

const Cart = () => {
  const { cart, removeItemFromCart, cartTotalPrice, isDiscountApplied, baseTotalPrice } = useCart();
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("warn", 'Your cart is empty! Add items before checking out.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const checkoutItems = cart.map(item => ({
        priceId: item.priceId,
        quantity: item.quantity,
      }));

      const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: checkoutItems,
          isDiscountApplied: isDiscountApplied,
          CustomerEmail: customerEmail
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || "Failed to create checkout session.");
      }

      if (session.error) {
        throw new Error(session.error);
      }

      // clearCart();

      window.location.href = session.url;

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An unexpected error occurred during checkout.");
      showToast("error", err.message || "Checkout failed. Please try again.");
    } finally {
      if (!error) { 
         setLoading(false); 
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen pt-32 pb-16 px-6 relative bg-gradient-to-b from-customGray/30 to-white" 
    >
      <div className="max-w-3xl mx-auto w-full mb-6"> 
        <HashLink
          to="/pricing" 
          aria-label="Back to pricing plans"
          className="inline-flex items-center space-x-2 text-white hover:text-brightYellow transition-colors duration-300 font-titillium font-semibold group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Pricing</span>
        </HashLink>
      </div>

      <div className="max-w-3xl w-full mx-auto bg-customGray p-12 rounded-xl text-gray-700 border-brightYellow border-2 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-higherJump text-customWhite mb-8 text-center leading-loose">Shopping Cart</h2>
        <LoadingAndErrorDisplay loading={loading} error={error} />
        
        {!loading && !error && cart.length === 0 ? ( 
          <p className="text-center text-xl text-customWhite">Your cart is empty <br/> <br/> 
            <Link to="/pricing" className="btn-full-colour w-full">
              Start adding items
            </Link>
          </p>
        ) : (
           !loading && cart.length > 0 && (
          <>
            <ul className="space-y-4 mb-6">
              {cart.map((item) => (
                <li key={item.priceId} className="flex justify-between items-center bg-white text-black p-4 rounded-md shadow-sm">
                  <div className="flex-grow">
                    <span className="font-bold text-lg">{item.name}</span>
                    <span className="text-black ml-2"> (£{item.price} x {item.quantity})</span>
                  </div>
                  <button
                    onClick={() => removeItemFromCart(item.priceId)}
                    className="ml-4 px-3 py-1 bg-hotPink text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            {/* Display discount information */}
            {isDiscountApplied && (
              <div className="text-right text-lg text-white mt-4">
                <p><span className="text-white">Subtotal: </span>£{baseTotalPrice.toFixed(2)}</p>
                <p><span className="text-white">Discount Applied:</span> -£{DISCOUNT_AMOUNT.toFixed(2)}</p>
              </div>
            )} 

            <div className="text-right text-2xl text-white mt-8 pt-4 border-t border-gray-200">
              <span className="text-white">Total:</span> £{cartTotalPrice.toFixed(2)}
            </div>
            <div className="mt-6">
              <label htmlFor="email" className="block text-white font-medium mb-1">Email address</label>
              <input
                id="email"
                type="email"
                className="w-full p-3 rounded-md border border-gray-300"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              className="btn-full-colour w-full py-3 mt-6"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </>
           )
        )}
      </div>
    </motion.div>
  );
};

export default Cart;