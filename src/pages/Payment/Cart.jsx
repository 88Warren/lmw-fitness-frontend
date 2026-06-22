import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { BACKEND_URL } from "../../utils/config";
import { showToast } from "../../utils/toastUtil";
import LoadingAndErrorDisplay from "../../components/Shared/Errors/LoadingAndErrorDisplay";
import { Link } from "react-router-dom";
import { DISCOUNT_AMOUNT } from "../../utils/config";
import { HashLink } from "react-router-hash-link";
import { FiTrash2, FiTag, FiX, FiShoppingBag, FiArrowLeft, FiLock } from "react-icons/fi";

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
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const response = await fetch(`${BACKEND_URL}/api/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: couponCode.trim(), cartTotal: cartTotalPrice }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid coupon code");
      setAppliedCoupon(data.coupon);
      setCouponDiscount(data.discount);
      showToast("success", `Coupon applied! You saved £${data.discount.toFixed(2)}`);
    } catch (err) {
      setCouponError(err.message);
      showToast("error", err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
    showToast("info", "Coupon removed");
  };

  const finalTotal = cartTotalPrice - couponDiscount;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast("warn", "Your cart is empty! Add items before checking out.");
      return;
    }
    if (!customerEmail) {
      setEmailError(true);
      showToast("error", "Please enter your email address to proceed with checkout.");
      return;
    }
    if (!agreedToTerms) {
      showToast("error", "You must agree to the Terms of Service before proceeding.");
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
      const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          isDiscountApplied,
          customerEmail: (customerEmail || "").trim().toLowerCase(),
          couponCode: couponCode.trim() || null,
        }),
      });
      const session = await response.json();
      if (!response.ok) throw new Error(session.error || "Failed to create checkout session.");
      if (session.error) throw new Error(session.error);
      window.location.href = session.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An unexpected error occurred during checkout.");
      showToast("error", err.message || "Checkout failed. Please try again.");
    } finally {
      if (!error) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-16 px-4 bg-linear-to-br from-white via-pink-50 to-yellow-50">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <HashLink
            to="/#Pricing"
            className="inline-flex items-center gap-2 text-sm text-customGray/60 hover:text-hotPink transition-colors duration-200 mb-6 font-titillium"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to programmes
          </HashLink>
          <h1 className="text-3xl md:text-4xl font-titillium font-bold text-customGray tracking-wide">
            Your Basket
          </h1>
          <p className="text-sm text-customGray/50 font-titillium mt-1">
            {cartItems.length === 0
              ? "Nothing in here yet"
              : `${cartItems.length} item${cartItems.length > 1 ? "s" : ""}`}
          </p>
        </motion.div>

        <LoadingAndErrorDisplay loading={loading} error={error} />

        {/* Empty state */}
        {!loading && !error && cartItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-8 h-8 text-hotPink" />
            </div>
            <h2 className="text-xl font-bold text-customGray mb-2 font-titillium">Your basket is empty</h2>
            <p className="text-customGray/50 text-sm mb-6 font-titillium">
              Add a programme to get started on your fitness journey.
            </p>
            <HashLink
              to="/#Pricing"
              className="btn-primary inline-flex items-center gap-2 no-underline"
            >
              <FiShoppingBag className="w-4 h-4" />
              Browse Programmes
            </HashLink>
          </motion.div>
        )}

        {/* Cart with items */}
        {!loading && cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Cart items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-50">
                {cartItems.map((item, index) => (
                  <motion.li
                    key={item.priceId}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex items-center justify-between px-6 py-5"
                  >
                    <div className="flex items-center gap-4">
                      {/* colour pill */}
                      <div className="w-2 h-10 rounded-full bg-linear-to-b from-hotPink to-brightYellow shrink-0" />
                      <div>
                        <p className="font-bold text-customGray font-titillium">
                          {item.name === "beginner-programme"
                            ? "Beginner Programme"
                            : item.name === "advanced-programme"
                            ? "Advanced Programme"
                            : item.name}
                        </p>
                        <p className="text-sm text-customGray/50 font-titillium">
                          One-off fee · qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg text-customGray font-titillium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItemFromCart(item.priceId)}
                        aria-label={`Remove ${item.name}`}
                        className="p-2 rounded-lg text-customGray/30 hover:text-hotPink hover:bg-pink-50 transition-colors duration-200"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Bundle discount notice */}
            {isDiscountApplied && (
              <div className="flex items-center gap-3 bg-limeGreen/10 border border-limeGreen/30 rounded-xl px-5 py-3">
                <span className="text-limeGreen text-lg">🎉</span>
                <div className="font-titillium text-sm">
                  <span className="font-semibold text-customGray">Bundle discount applied!</span>
                  <span className="text-customGray/60 ml-1">−£{DISCOUNT_AMOUNT.toFixed(2)} off your order</span>
                </div>
              </div>
            )}

            {/* Coupon code */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-customGray font-titillium mb-4">
                <FiTag className="w-4 h-4 text-hotPink" />
                Have a coupon code?
              </h3>
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    placeholder="Enter code"
                    disabled={couponLoading}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:border-hotPink focus:ring-1 focus:ring-hotPink font-titillium bg-white disabled:opacity-50"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-customGray text-white text-sm font-bold font-titillium rounded-lg hover:bg-customGray/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-limeGreen/10 border border-limeGreen/30 rounded-lg px-4 py-3">
                  <span className="text-sm font-semibold text-customGray font-titillium">
                    🎉 You saved £{couponDiscount.toFixed(2)}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 text-customGray/40 hover:text-hotPink transition-colors duration-200"
                    aria-label="Remove coupon"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-2 font-titillium">{couponError}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <h3 className="text-sm font-semibold text-customGray font-titillium mb-4">Order Summary</h3>
              <div className="space-y-2 font-titillium text-sm">
                {isDiscountApplied && (
                  <>
                    <div className="flex justify-between text-customGray/60">
                      <span>Subtotal</span>
                      <span>£{baseTotalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-limeGreen font-semibold">
                      <span>Bundle discount</span>
                      <span>−£{DISCOUNT_AMOUNT.toFixed(2)}</span>
                    </div>
                  </>
                )}
                {appliedCoupon && (
                  <>
                    {!isDiscountApplied && (
                      <div className="flex justify-between text-customGray/60">
                        <span>Subtotal</span>
                        <span>£{cartTotalPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-limeGreen font-semibold">
                      <span>Coupon discount</span>
                      <span>−£{couponDiscount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                  <span className="font-bold text-customGray text-base">Total</span>
                  <span className="font-bold text-2xl text-customGray">£{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
              <p className="text-sm text-customGray/60 font-titillium mb-5 leading-relaxed">
                Enter your email below — we'll send your daily motivation, workout videos and food planner straight to your inbox.
              </p>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="checkout-email" className="block text-sm font-semibold text-customGray font-titillium mb-1.5">
                  Email address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => { setCustomerEmail(e.target.value); if (emailError) setEmailError(false); }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg text-sm text-customGray placeholder-gray-300 focus:outline-none focus:ring-1 font-titillium bg-white transition-colors duration-200 ${
                    emailError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                      : "border-gray-200 focus:border-hotPink focus:ring-hotPink"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1.5 font-titillium">Please enter a valid email address.</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 mb-6">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                      agreedToTerms
                        ? "bg-brightYellow border-brightYellow"
                        : "bg-white border-gray-300 hover:border-brightYellow"
                    }`}
                  >
                    {agreedToTerms && (
                      <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="terms"
                  className="text-sm text-customGray/70 font-titillium cursor-pointer leading-relaxed"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                >
                  I agree to the{" "}
                  <Link
                    to="/docs/LMW_fitness_Terms_of_Service.docx"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-hotPink underline hover:text-limeGreen transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </label>
              </div>

              {/* Checkout button */}
              <motion.button
                whileHover={!loading && agreedToTerms ? { scale: 1.01 } : {}}
                whileTap={!loading && agreedToTerms ? { scale: 0.99 } : {}}
                onClick={handleCheckout}
                disabled={loading || !agreedToTerms}
                className={`w-full py-4 rounded-xl font-bold font-titillium text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading || !agreedToTerms
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-limeGreen via-brightYellow to-hotPink text-black hover:shadow-lg hover:shadow-hotPink/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Proceed to Checkout · £{finalTotal.toFixed(2)}
                  </>
                )}
              </motion.button>

              {/* Trust signal */}
              <p className="text-center text-xs text-customGray/40 font-titillium mt-3 flex items-center justify-center gap-1">
                <FiLock className="w-3 h-3" />
                Secure checkout powered by Stripe
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
