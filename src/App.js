import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import { resourceActions } from './store/resourceSlice';
import { accountActions } from './store/accountSlice';

import Nav from './components/nav/Nav';
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

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/resource/startup`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, data, message } = json;

        if (status === 'error') {
          throw new Error(message);
        }

        const { categoryArr, collectionArr, colorArr, sizeArr, userId } = data;

        dispatch(resourceActions.setCategoryArr(categoryArr));
        dispatch(resourceActions.setCollectionArr(collectionArr));
        dispatch(resourceActions.setColorArr(colorArr));
        dispatch(resourceActions.setSizeArr(sizeArr));

        userId && dispatch(accountActions.setID(userId));
      })
      .catch((err) => console.log(err.message));
  }, [dispatch]);

  return (
    <>
      <Nav></Nav>
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
    </>
  );
}

export default App;
