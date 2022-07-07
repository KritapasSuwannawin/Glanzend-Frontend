import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: { id: undefined, wishlistLineItemIDArr: [], cartLineItemIDArr: [] },
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
    setCartLineItemIDArr(state, action) {
      state.cartLineItemIDArr = action.payload;
    },
    removeIDFromCartLineItemIDArr(state, action) {
      const index = state.cartLineItemIDArr.indexOf(action.payload);
      if (index > -1) {
        state.cartLineItemIDArr.splice(index, 1);
      }
    },
    removeIDArrFromCartLineItemIDArr(state, action) {
      state.cartLineItemIDArr = state.cartLineItemIDArr.filter((id) => !action.payload.includes(id));
    },
  },
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
