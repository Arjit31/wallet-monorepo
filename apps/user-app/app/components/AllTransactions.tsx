import { Card } from "@repo/ui/card";
import type { TransactionType } from "@repo/store/types/AllTransactionType";

export const AllTransactions = ({
  transactions,
}: {
  transactions: TransactionType[];
}) => {
  if (!transactions || transactions[0]?.amount === 0) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2 h-full max-h-screen overflow-auto p-5">
        {transactions.map((t) =>
          t.type === "onramp" ? (
            <div key={t.createdAt.toString()} className="flex justify-between">
              <div>
                <div className="text-sm">Received INR</div>
                <div className="text-slate-600 text-xs">
                  {t.createdAt.toDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                <div className="text-sm">+ Rs {t.amount}</div>
                <div
                  className={
                    t.status === "Success"
                      ? "text-xs text-green-600"
                      : t.status === "Processing"
                        ? "text-xs text-slate-600"
                        : "text-xs text-red-600"
                  }
                >
                  {t.status}
                </div>
              </div>
            </div>
          ) : (
            <div key={t.createdAt.toString()} className="flex justify-between">
              <div>
                {t.isSender === false ? (
                  <div className="text-sm text-green-600">Received INR</div>
                ) : (
                  <div className="text-sm text-red-600">Sent INR</div>
                )}
                <div className="text-slate-600 text-xs">
                  {t.createdAt.toDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end justify-center">
                {t.isSender === false ? (
                  <div className="text-sm text-green-600">+ Rs {t.amount}</div>
                ) : (
                  <div className="text-sm text-red-600">- Rs {t.amount}</div>
                )}
                {t.isSender === false ? (
                  <div className="text-xs">
                    +91{" "}
                    {t.mobileNumber?.substring(0, 3) +
                      " " +
                      t.mobileNumber?.substring(3)}
                  </div>
                ) : (
                  <div className="text-xs">
                    +91{" "}
                    {t.mobileNumber?.substring(0, 3) + " " + t.mobileNumber?.substring(3)}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </Card>
  );
};
