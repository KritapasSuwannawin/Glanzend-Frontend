import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    collectionID: undefined,
    categoryID: undefined,
    colorID: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    offset: 0,
    view: 9,
    currentProductArr: [],
  },
  reducers: {
    setCollectionID(state, action) {
      state.collectionID = action.payload;
      state.categoryID = undefined;
    },
    setCategoryID(state, action) {
      state.categoryID = action.payload;
      state.collectionID = undefined;
    },
    setColorID(state, action) {
      state.colorID = action.payload;
    },
    setMinPrice(state, action) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action) {
      state.maxPrice = action.payload;
    },
    clearSearchHandler(state, action) {
      state.collectionID = undefined;
      state.categoryID = undefined;
      state.colorID = undefined;
      state.minPrice = undefined;
      state.maxPrice = undefined;
    },
    setCurrentProductArr(state, action) {
      if (state.offset > 0) {
        state.currentProductArr = state.currentProductArr.concat(action.payload);
        return;
      }

      state.currentProductArr = action.payload;
    },
    setOffset(state, action) {
      state.offset = action.payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
