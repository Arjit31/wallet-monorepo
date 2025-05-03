"use client";

import { useEffect, useState } from "react";
import { getTransaction } from "../../lib/action/getTransaction";
import type { TransactionType } from "@repo/store/types/AllTransactionType";
import type { RootState } from "@repo/store/store";
import { useSelector, useDispatch } from "react-redux";
import { updateTransactions } from "@repo/store/features/transactionSlice";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { Card } from "@repo/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

type ColoredBarPoint = {
  time: string;
  balance: number;
  color: string;
  amount: number;
};

type PieData = {
  sent: number;
  received: number;
};

function calculateColoredBars(
  transactions: TransactionType[]
): ColoredBarPoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const points: ColoredBarPoint[] = [];
  let prevBalance = 0;

  for (const tx of sorted) {
    const change = tx.isSender ? -tx.amount : tx.amount;
    const currBalance = prevBalance + change;

    let color = "blue";
    if (currBalance > prevBalance) color = "green";
    else if (currBalance < prevBalance) color = "red";

    points.push({
      time: tx.createdAt.toISOString(),
      balance: currBalance,
      color,
      amount: tx.amount,
    });

    prevBalance = currBalance;
  }

  return points;
}

function calculatePieData(transactions: TransactionType[]): PieData {
  let sent = 0;
  let received = 0;

  for (const tx of transactions) {
    if (tx.isSender) sent += tx.amount;
    else received += tx.amount;
  }

  return { sent, received };
}

function limitDataPoints(data: ColoredBarPoint[], maxPoints = 21): ColoredBarPoint[] {
  if (data.length <= maxPoints) return data;

  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0 || index == length-1);
}

export default function DashboardCharts() {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const [data, setData] = useState<ColoredBarPoint[]>([]);
  const [pieData, setPieData] = useState<PieData>({ sent: 0, received: 0 });
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

  useEffect(() => {
    const colored = calculateColoredBars(transactions);
    const limitedData = limitDataPoints(colored);  // Limit to max 50 data points
    setData(limitedData);
    setPieData(calculatePieData(transactions));
  }, [transactions]);

  const barData = {
    labels: data.map((d) => d.time.substring(0, 10)),
    datasets: [
      {
        label: "Balance",
        data: data.map((d) => d.amount),
        backgroundColor: data.map((d) => d.color),
        barThickness: 10,
      },
    ],
  };

  const lineData = {
    labels: data.map((d) => d.time.substring(0, 10)),
    datasets: [
      {
        label: "Balance Over Time",
        data: data.map((d) => d.balance),
        fill: false,
        borderColor: "#6366F1",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#6366F1",
      },
    ],
  };

  const pieChartData = {
    labels: ["Sent", "Received"],
    datasets: [
      {
        label: "Transaction Split",
        data: [pieData.sent, pieData.received],
        backgroundColor: ["#F87171", "#60A5FA"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="w-full p-6 space-y-10  min-h-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Dashboard Overview
      </div>
      <Card title="Balance Over Time">
        <div className="w-full h-96 mt-10">
          <Line
            data={lineData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </Card>

      <Card title="Transactions">
        <div className="w-full h-96 mt-10">
          <Bar
            data={barData}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={300}
          />
        </div>
      </Card>

      <Card title="Sent vs Received">
        <div className="w-full h-96 mt-10">
          <Doughnut
            data={pieChartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </Card>
    </div>
  );
}
