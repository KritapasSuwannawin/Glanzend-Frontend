import { configureStore } from '@reduxjs/toolkit';

import resourceReducer from './resourceSlice';
import productReducer from './productSlice';

const store = configureStore({
  reducer: { resource: resourceReducer, product: productReducer },
});

export default store;
