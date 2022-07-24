import { createContext, useContext, useReducer } from "react";
import Cookies from 'js-cookie';

const Store = createContext();
export const CART_ADD_ITEM = 'CART_ADD_ITEM';
export const CART_REMOVE_ITEM = 'CART_REMOVE_ITEM';
export const CART_RESET = 'CART_RESET';
export const SAVE_SHIPPING_ADDRESS = 'SAVE_SHIPPING_ADDRESS';
export const SAVE_PAYMENT_METHOD = 'SAVE_PAYMENT_METHOD';
export const CART_CLEAR_ITEMS = 'CART_CLEAR_ITEMS';

export const COOKIE_KEY_CART = 'cart';

export function useStore() {
  return useContext(Store);
}

const initialState = {
  cart: Cookies.get(COOKIE_KEY_CART)
    ? JSON.parse(Cookies.get(COOKIE_KEY_CART))
    : { cartItems: [] , shippingAddress: {} }
};

function reducer(state, action) {
  let stateVal = state;
  let cart = { ...state.cart }
  switch (action.type) {
    case CART_ADD_ITEM: {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => item.name === existItem.name ? newItem : item)
        : [...state.cart.cartItems, newItem];
      cart = {...state.cart, cartItems};
      Cookies.set(COOKIE_KEY_CART, JSON.stringify(cart));
      stateVal = { ...state, cart };
    }
    break;
    case CART_REMOVE_ITEM: {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      cart = {...state.cart, cartItems};
      Cookies.set(COOKIE_KEY_CART, JSON.stringify(cart));
      stateVal = { ...state, cart };
    }
    break;
    case CART_RESET: {
      cart = {
        cartItems: [],
        shippingAddress: {location: {}},
        paymentMethod: '',
      };
      stateVal = { ...state, cart };
      Cookies.remove(COOKIE_KEY_CART);
    }
    break;
    case SAVE_SHIPPING_ADDRESS: {
      cart = {
        ...state.cart,
        shippingAddress: {
          ...state.cart.shippingAddress,
          ...action.payload,
        }
      };
      stateVal = { ...state, cart };
      Cookies.set(COOKIE_KEY_CART, JSON.stringify(cart));
    }
    break;
    case SAVE_PAYMENT_METHOD: {
      cart = {
        ...state.cart,
        paymentMethod: action.payload,
      };
      stateVal = { ...state, cart };
      Cookies.set(COOKIE_KEY_CART, JSON.stringify(cart));
    }
    break;
    case CART_CLEAR_ITEMS: {
      cart = {
        ...state.cart,
        cartItems: [],
      };
      stateVal = { ...state, cart };
      Cookies.set(COOKIE_KEY_CART, JSON.stringify(cart));
    }
    break;
  }

  return stateVal;
}

export function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{state, dispatch}}>{children}</Store.Provider>;
}
