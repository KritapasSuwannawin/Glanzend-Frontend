import { useEffect } from 'react';
import { Route, Redirect, Switch, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
