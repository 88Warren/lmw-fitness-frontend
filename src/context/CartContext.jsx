import { createContext, useState, useContext, useEffect } from 'react';
import { showToast } from "../utils/toastUtil"; 
import { ULTIMATE_MINDSET_PACKAGE_PRICE_ID, DISCOUNT_AMOUNT } from '../utils/config';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
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
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addItemToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(i => i.priceId === item.priceId);
      if (existingItemIndex > -1) {
        showToast("warn", `${item.name} is already in your cart.`);
        return prevCart;
      }
      showToast("success", `${item.name} added to cart!`);
      return [...prevCart, { ...item, quantity: 1 }]; 
    });
  };

  const removeItemFromCart = (priceId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.priceId !== priceId);
      showToast("warn", "Item removed from cart."); 
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); 
  };

    const cartItemCount = cart.length; 
    const baseTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const hasMindsetPackage = cart.some(item => item.priceId === ULTIMATE_MINDSET_PACKAGE_PRICE_ID);
    const hasAnotherItem = cart.length > 1; 

    const isDiscountApplied = hasMindsetPackage && hasAnotherItem;
    const finalTotalPrice = isDiscountApplied ? baseTotalPrice - DISCOUNT_AMOUNT : baseTotalPrice;

  const value = {
    cart,
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