import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: { id: undefined },
  reducers: {
    setID(state, action) {
      state.id = action.payload;
    },
  },
});

export const accountActions = accountSlice.actions;
export default accountSlice.reducer;
