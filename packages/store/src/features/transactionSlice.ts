import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import { tempReturn } from "../types/AllTransactionType";
import type { TransactionType } from "../types/AllTransactionType";

export interface transactionState {
  transactions: TransactionType[];
}

const initialState: transactionState = {
  transactions: [tempReturn],
};

export const transactionSlice: Slice<transactionState> = createSlice({
  name: "counter",
  initialState,
  reducers: {
    updateTransactions: (state, action: PayloadAction<TransactionType[]>) => {
      state.transactions = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTransactions } = transactionSlice.actions;

export default transactionSlice.reducer;
