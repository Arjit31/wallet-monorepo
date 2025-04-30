"use client";

import { useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";
import { failOnrampTransaction } from "../lib/action/failOnrampTransaction";

export function NetbankingForm({
  amount,
  token,
  userId,
}: {
  amount: number;
  token: string;
  userId: string;
}) {
  async function webhookRequest() {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_WEBHOOK_URL + "/bank-webhook",
        {
          token,
          userId: userId,
          amount,
        }
      );
      console.log("Response:", res);
    } catch (error) {
      console.error("Webhook error:", error);
    }
    redirect("/transfer");
  }

  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <div>
        We have received a request to withdraw ₹{amount} from your account.{" "}
        <br />
        Are you sure you want to proceed with this transaction?
        <br />
        Please confirm to continue, or cancel if you did not initiate this
        request.
      </div>
      <div className="flex items-center">
        <input
          id="link-checkbox"
          type="checkbox"
          value=""
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          onClick={() => {
            setEnabled(!enabled);
          }}
        />
        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          I agree with the{" "}
          <a
            href=""
            className="text-blue-600 dark:text-blue-500 hover:underline"
          >
            terms and conditions
          </a>
          .
        </label>
      </div>
      <div className="flex gap-3 max-w-sm">
        <button
          className="py-2.5 px-6 rounded-lg text-sm font-medium bg-slate-200 text-teal-800 cursor-pointer"
          onClick={async () => {
            await failOnrampTransaction(token);
            redirect("/transfer");
          }}
        >
          Cancel
        </button>
        <button
          className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-300"
          disabled={!enabled}
          onClick={() => {
            webhookRequest();
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
