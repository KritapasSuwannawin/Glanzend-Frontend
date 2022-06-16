import { configureStore } from '@reduxjs/toolkit';

import resourceReducer from './resourceSlice';
import productReducer from './productSlice';
import accountReducer from './accountSlice';

const store = configureStore({
  reducer: { resource: resourceReducer, product: productReducer, account: accountReducer },
});

export default store;
