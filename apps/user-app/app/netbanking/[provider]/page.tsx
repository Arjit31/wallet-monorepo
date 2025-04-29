"use client";

import { useParams, useSearchParams, redirect } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { getOnrampTransaction } from "../../lib/action/getOnrampTransaction";
import { TextInput } from "@repo/ui/TextInput";

export default function Netbanking() {
  const provider = useParams().provider?.toString();
  if (provider !== "HDFC" && provider !== "Axis") {
    redirect("/transfer");
  }
  const [loading, setLoading] = useState(true);
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
        if (transaction) {
          setLoading(false);
        } else {
          alert("Some error occured!");
          redirect("/dashboard");
        }
      } else {
        alert("Some error occured!");
        redirect("/dashboard");
      }
    }
    fetchTransaction();
  }, []);
  if (loading) {
    return <div>loading...</div>;
  } else {
    return (
      <div className="flex flex-col items-center h-screen w-full gap-10 p-10">
        <div className="text-5xl font-extrabold underline">{provider}</div>
        <form className="flex flex-col gap-10">
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
            />
            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              I agree with the{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-500 hover:underline"
              >
                terms and conditions
              </a>
              .
            </label>
          </div>
          <div className="flex gap-3 max-w-sm">
            <button className="py-2.5 px-6 rounded-lg text-sm font-medium bg-teal-200 text-teal-800">
              Cancel
            </button>
            <button className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-teal-600">
              Confirm
            </button>
          </div>
        </form>
      </div>
    );
  }
}
