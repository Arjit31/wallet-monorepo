"use client";

import { useEffect } from "react";
import { getTransaction } from "../../lib/action/getTransaction";
import type { TransactionType } from "@repo/store/types/AllTransactionType";
import type { RootState } from "@repo/store/store";
import { useSelector, useDispatch } from "react-redux";
import { updateTransactions } from "@repo/store/features/transactionSlice";
import { AllTransactions } from "../../components/AllTransactions";

export default function () {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const dispatch = useDispatch();
  useEffect(() => {
    async function getAllTransactions() {
      const t: TransactionType[] = await getTransaction();

      if (updateTransactions) {
        dispatch(updateTransactions?.(t));
      }
    }
    if (!transactions[0] || transactions[0].amount === 0) {
      getAllTransactions();
    }
  }, []);
  return (
    <div className="w-full p-10">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transaction Overview
      </div>
      <AllTransactions transactions={transactions} />
    </div>
  );
}
