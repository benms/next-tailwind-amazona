import { createContext, useReducer } from "react";
import Cookies from 'js-cookie';

export const Store = createContext();
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_RESET = 'CART_RESET';
export const SAVE_SHIPPING_ADDRESS = 'SAVE_SHIPPING_ADDRESS';

export const COOKIE_KEY_CART = 'cart';

const initialState = {
  cart: Cookies.get(COOKIE_KEY_CART)
    ? JSON.parse(Cookies.get(COOKIE_KEY_CART))
    : { cartItems: [] , shippingAddress: {} }
};

function reducer(state, action) {
  let stateVal = state;
  switch (action.type) {
    case CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => item.name === existItem.name ? newItem : item)
        : [...state.cart.cartItems, newItem];
      Cookies.set(COOKIE_KEY_CART, JSON.stringify({...state.cart, cartItems}));
      stateVal = {...state, cart: {...state.cart, cartItems}};
    }
    break;
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set(COOKIE_KEY_CART, JSON.stringify({...state.cart, cartItems}));
      stateVal = {...state, cart: {...state.cart, cartItems}};
    }
    break;
    case CART_RESET: {
      stateVal = {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: {location: {}},
          paymentMethod: '',
        }
      };
    }
    break;
    case SAVE_SHIPPING_ADDRESS: {
      stateVal = {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload
          },
        }
      };
    }
    break;
  }
  return stateVal;
}

export function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>;
}
