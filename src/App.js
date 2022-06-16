import { Route, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import Login from './pages/Login';

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
      <Route path="/">
        <Redirect to="/"></Redirect>
      </Route>
    </Switch>
  );
}

export default App;
