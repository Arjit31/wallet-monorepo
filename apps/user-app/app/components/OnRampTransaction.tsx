import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2 h-52 overflow-auto p-5">
            {transactions.map(t => <div key={t.time.toString()} className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                    <div className="text-sm">+ Rs {t.amount}</div>
                    <div className = {t.status === "Success" ? "text-xs text-green-600" : ( t.status === "Processing" ? "text-xs text-slate-600" : "text-xs text-red-600")} >{t.status}</div>
                </div>

            </div>)}
        </div>
    </Card>
}