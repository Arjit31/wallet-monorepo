"use client";

import { useParams, useSearchParams, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnrampTransaction } from "../../lib/action/getOnrampTransaction";
import { NetbankingForm } from "../../components/NetbankingForm";
import Countdown from "react-countdown";

export default function Netbanking() {
  const provider = useParams().provider?.toString();
  if (provider !== "HDFC" && provider !== "Axis") {
    redirect("/transfer");
  }
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const amount = searchParams.get("amount");
  useEffect(() => {
    async function fetchTransaction() {
      if (provider && amount && token) {
        const transaction = await getOnrampTransaction(
          provider,
          Number(amount),
          token
        );
        if (transaction.flag) {
          setLoading(false);
          setUserId(transaction.userId);
          const startTime = transaction.start_time;
          const now = new Date();
          const diffInSeconds = Math.floor(
            (now.getTime() - startTime.getTime()) / 1000
          );
          if (diffInSeconds > 50) {
            redirect("/transfer");
          }
        } else {
          alert("Some error occured!");
          redirect("/transfer");
        }
      } else {
        alert("Some error occured!");
        redirect("/transfer");
      }
    }
    fetchTransaction();
  }, []);
  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <div className="flex flex-col items-center h-screen w-full gap-10 p-10">
        <div className="text-5xl font-extrabold underline">
          {provider + " Bank"}
        </div>
        <NetbankingForm
          amount={Number(amount) || 0}
          token={token || ""}
          userId={userId || ""}
        />
        <Countdown
          date={Date.now() + 45 * 1000}
          onComplete={() => {
            redirect("/transfer");
          }}
        />
      </div>
    );
  }
}
