import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart, useCartDispatch } from '../store/CartContext';

export default function CartIcon() {
  const { items } = useCart();
  const dispatch = useCartDispatch();

  if (items.length === 0) return null;

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_CART' })}
      className="fixed top-6 right-6 md:top-6 md:right-12 bg-white text-brand-wood p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
    >
      <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm">
        {items.length}
      </span>
    </button>
  );
}
