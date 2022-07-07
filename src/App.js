import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';

import { resourceActions } from './store/resourceSlice';
import { accountActions } from './store/accountSlice';

import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutComplete from './pages/CheckoutComplete';
import Account from './pages/Account';

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
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route exact path="/product">
        <Product></Product>
      </Route>
      <Route exact path="/product/:id">
        <ProductDetail></ProductDetail>
      </Route>
      <Route exact path="/register">
        <Register></Register>
      </Route>
      <Route exact path="/login">
        <Login></Login>
      </Route>
      <Route exact path="/wishlist">
        <Wishlist></Wishlist>
      </Route>
      <Route exact path="/cart">
        <Cart></Cart>
      </Route>
      <Route exact path="/cart/checkout">
        <Checkout></Checkout>
      </Route>
      <Route exact path="/cart/checkout/complete">
        <CheckoutComplete></CheckoutComplete>
      </Route>
      <Route exact path="/account">
        <Account></Account>
      </Route>
      <Route path="/">
        <Redirect to="/"></Redirect>
      </Route>
    </Switch>
  );
}

export default App;
