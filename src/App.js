import { Route, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Account from './pages/Account';

function App() {
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
      <Route path="/cart">
        <Cart></Cart>
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
