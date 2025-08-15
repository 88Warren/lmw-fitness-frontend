import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { showToast } from "../utils/toastUtil"; 
import { ULTIMATE_MINDSET_PACKAGE_PRICE_ID, DISCOUNT_AMOUNT } from '../utils/config';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cartItems]);

  const addItemToCart = useCallback((item) => {
    const existingItemIndex = cartItems.findIndex(i => i.priceId === item.priceId);

    if (existingItemIndex > -1) {
      showToast("warn", `${item.name} is already in your cart.`);
    } else {
      setCartItems(prevCart => [...prevCart, { ...item, quantity: 1 }]);
      showToast("success", `${item.name} added to cart!`);
    }
  }, [cartItems]);

  const removeItemFromCart = useCallback((priceId) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.filter(item => item.priceId !== priceId);
      showToast("warn", "Item removed from cart."); 
      return updatedCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

    const cartItemCount = cartItems.length; 
    const baseTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const hasMindsetPackage = cartItems.some(item => item.priceId === ULTIMATE_MINDSET_PACKAGE_PRICE_ID);
    const hasAnotherItem = cartItems.length > 1; 

    const isDiscountApplied = hasMindsetPackage && hasAnotherItem;
    const finalTotalPrice = isDiscountApplied ? baseTotalPrice - DISCOUNT_AMOUNT : baseTotalPrice;

  const value = {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    cartItemCount,
    cartTotalPrice: finalTotalPrice, 
    isDiscountApplied, 
    baseTotalPrice 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};