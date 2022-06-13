import { createSlice } from '@reduxjs/toolkit';

const resourceSlice = createSlice({
  name: 'resource',
  initialState: { categoryArr: [], collectionArr: [], colorArr: [], sizeArr: [] },
  reducers: {
    setCategoryArr(state, action) {
      state.categoryArr = action.payload;
    },
    setCollectionArr(state, action) {
      state.collectionArr = action.payload;
    },
    setColorArr(state, action) {
      state.colorArr = action.payload;
    },
    setSizeArr(state, action) {
      state.sizeArr = action.payload;
    },
  },
});

export const resourceActions = resourceSlice.actions;
export default resourceSlice.reducer;
