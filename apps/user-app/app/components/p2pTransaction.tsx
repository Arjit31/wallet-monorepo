import { Card } from "@repo/ui/card";

export function P2PTransaction({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    from: string;
    to: string;
    userId: string;
    fromNumber: string;
    toNumber: string;
  }[];
}) {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2 max-h-52 overflow-auto p-5">
        {transactions.map((t) => (
          <div key={t.time.toString()} className="flex justify-between">
            <div>
              {t.to === t.userId ? (
                <div className="text-sm text-green-600">Received INR</div>
              ) : (
                <div className="text-sm text-red-600">Sent INR</div>
              )}
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col items-end justify-center">
              {t.to === t.userId ? (
                <div className="text-sm text-green-600">+ Rs {t.amount}</div>
              ) : (
                <div className="text-sm text-red-600">- Rs {t.amount}</div>
              )}
              {t.to === t.userId ? (
                <div className="text-xs">
                  +91{" "}
                  {t.fromNumber.substring(0, 3) +
                    " " +
                    t.fromNumber.substring(3)}
                </div>
              ) : (
                <div className="text-xs">
                  +91{" "}
                  {t.toNumber.substring(0, 3) + " " + t.toNumber.substring(3)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
