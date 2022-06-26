import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: { id: undefined, wishlistLineItemIDArr: [] },
  reducers: {
    setID(state, action) {
      state.id = action.payload;
    },
    setWishlistLineItemIDArr(state, action) {
      state.wishlistLineItemIDArr = action.payload;
    },
    removeIDFromWishlistLineItemIDArr(state, action) {
      const index = state.wishlistLineItemIDArr.indexOf(action.payload);
      if (index > -1) {
        state.wishlistLineItemIDArr.splice(index, 1);
      }
    },
  },
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
