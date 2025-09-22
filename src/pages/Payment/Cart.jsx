import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import LoadingAndErrorDisplay from "../../components/Shared/Errors/LoadingAndErrorDisplay";
import { InputField } from "../../controllers/forms/formFields";
import { Link } from "react-router-dom";
import { DISCOUNT_AMOUNT } from "../../utils/config";
import { HashLink } from "react-router-hash-link";

const Cart = () => {
  const {
    cartItems,
    removeItemFromCart,
    cartTotalPrice,
    isDiscountApplied,
    baseTotalPrice,
  } = useCart();
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast("warn", "Your cart is empty! Add items before checking out.");
      return;
    }

    if (!customerEmail) {
      setEmailError(true);
      showToast(
        "error",
        "Please enter your email address to proceed with checkout."
      );
      return;
    }

    if (!agreedToTerms) {
      showToast(
        "error",
        "You must agree to the Terms of Service before proceeding."
      );
      return;
    }

    setEmailError(false);
    setLoading(true);
    setError(null);

    try {
      const checkoutItems = cartItems.map((item) => ({
        priceId: item.priceId,
        quantity: item.quantity,
      }));

      const response = await fetch(
        `${BACKEND_URL}/api/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: checkoutItems,
            isDiscountApplied: isDiscountApplied,
            CustomerEmail: customerEmail,
          }),
        }
      );

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || "Failed to create checkout session.");
      }

      if (session.error) {
        throw new Error(session.error);
      }

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
      <div className="max-w-7xl w-full mx-auto">
        <div className="max-w-3xl mx-auto bg-customGray p-12 rounded-xl text-gray-700 border-brightYellow border-2 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-higherJump text-customWhite mb-8 text-center leading-loose">
          Shopping Cart
        </h2>
        <LoadingAndErrorDisplay loading={loading} error={error} />

        {!loading && !error && cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-customWhite mb-6">Your cart is empty</p>
            <HashLink
              to="/#Pricing"
              aria-label="Start adding items to cart"
              className="btn-full-colour inline-flex items-center justify-center space-x-2 transition-colors duration-300 font-titillium font-semibold"
            >
              <span>Start Adding Items</span>
            </HashLink>
          </div>
        ) : (
          !loading &&
          cartItems.length > 0 && (
            <>
              <ul className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <li
                    key={item.priceId}
                    className="flex justify-between items-center bg-white text-black p-4 rounded-md shadow-sm"
                  >
                    <div className="flex-grow">
                      <span className="font-bold text-lg">
                        {item.name === "beginner-programme"
                          ? "Beginner Programme"
                          : item.name === "advanced-programme"
                          ? "Advanced Programme"
                          : item.name}
                      </span>
                      <span className="text-black ml-2">
                        {" "}
                        (£{item.price} x {item.quantity})
                      </span>
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
                  <p>
                    <span className="text-white">Subtotal: </span>£
                    {baseTotalPrice.toFixed(2)}
                  </p>
                  <p>
                    <span className="text-white">Discount Applied:</span> -£
                    {DISCOUNT_AMOUNT.toFixed(2)}
                  </p>
                </div>
              )}

              <div className="text-right text-2xl text-white mt-8 pt-4 border-t border-gray-200">
                <span className="text-white">Total:</span> £
                {cartTotalPrice.toFixed(2)}
              </div>
              <p className="text-center mt-4 text-logoGray leading-loose">
                To sign up, simply enter your email. <br />
                We&apos;ll send you daily motivation, workout videos and a food
                planner to keep you on track.
              </p>
              <div className="mt-6">
                <InputField
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    setCustomerEmail(e.target.value);
                    if (emailError) {
                      setEmailError(false);
                    }
                  }}
                  placeholder="Enter your email"
                  required
                  autoComplete="on"
                />
                {/* Add a conditional error message below the input */}
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 accent-brightYellow border-gray-300 rounded focus:ring-brightYellow"
                />
                <label htmlFor="terms" className="text-sm text-customWhite">
                  I agree to the{" "}
                  <Link
                    to="/docs/LMW_fitness_Terms_of_Service.docx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brightYellow underline hover:text-limeGreen transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </label>
              </div>
              <button
                className={`btn-full-colour w-full py-3 mt-6 ${
                  !agreedToTerms || loading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleCheckout}
                disabled={loading || !agreedToTerms}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </button>

              {/* Back to Pricing button when cart has items */}
              <div className="mt-4 text-center">
                <HashLink
                  to="/#Pricing"
                  aria-label="Back to pricing plans"
                  className="btn-primary inline-flex items-center justify-center space-x-2 transition-colors duration-300 font-titillium font-semibold group"
                >
                  <span>Back to Pricing</span>
                </HashLink>
              </div>
            </>
          )
        )}
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
