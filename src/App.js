import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { resourceActions } from './store/resourceSlice';
import { accountActions } from './store/accountSlice';

import Home from './pages/home/Home';
import Product from './pages/product/Product';
import ProductDetail from './pages/productDetail/ProductDetail';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Wishlist from './pages/wishlist/Wishlist';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import CheckoutComplete from './pages/checkoutComplete/CheckoutComplete';
import Account from './pages/account/Account';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/product-startup`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        const { colorArr, sizeArr } = data;
        dispatch(resourceActions.setColorArr(colorArr));
        dispatch(resourceActions.setSizeArr(sizeArr));
      })
      .catch((err) => console.log(err));

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/home-startup`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        const { categoryArr, collectionArr } = data;
        dispatch(resourceActions.setCategoryArr(categoryArr));
        dispatch(resourceActions.setCollectionArr(collectionArr));
      })
      .catch((err) => console.log(err));

    const email = localStorage.getItem('glanzend-email');
    const encryptedPassword = localStorage.getItem('glanzend-password');

    if (email && encryptedPassword) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/account/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, encryptedPassword }),
      })
        .then((res) => res.json())
        .then((json) => {
          const { status, data, message } = json;

          if (status === 'error') {
            throw new Error(message);
          }

          if (status === 'fail') {
            localStorage.removeItem('glanzend-email');
            localStorage.removeItem('glanzend-password');
            return;
          }

          const { id } = data;

          dispatch(accountActions.setID(id));
        })
        .catch((err) => console.log(err));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/product" element={<Product></Product>}></Route>
      <Route path="/product/:id" element={<ProductDetail></ProductDetail>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/wishlist" element={<Wishlist></Wishlist>}></Route>
      <Route path="/cart" element={<Cart></Cart>}></Route>
      <Route path="/cart/checkout" element={<Checkout></Checkout>}></Route>
      <Route path="/cart/checkout/complete" element={<CheckoutComplete></CheckoutComplete>}></Route>
      <Route path="/account" element={<Account></Account>}></Route>
      <Route path="/*" element={<Navigate replace to="/"></Navigate>}></Route>
    </Routes>
  );
}

export default App;
