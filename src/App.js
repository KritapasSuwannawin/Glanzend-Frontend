import { Route, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Product from './pages/Product';

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Home></Home>
      </Route>
      <Route exact path="/product">
        <Product></Product>
      </Route>
      <Route path="/">
        <Redirect to="/"></Redirect>
      </Route>
    </Switch>
  );
}

export default App;
