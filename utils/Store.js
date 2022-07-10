import { createContext, useReducer } from "react";

export const Store = createContext();
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';

const initialState = {
  cart: {
    cartItems: []
  }
};

function reducer(state, action) {
  switch (action.type) {
    case CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => item.name === existItem.name ? newItem : item)
        : [...state.cart.cartItems, newItem];
      return {...state, cart: {...state.cart, cartItems}}
    }
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      return {...state, cart: {...state.cart, cartItems}}
    }
    default:
      return state;
  }
}

export function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>;
}
