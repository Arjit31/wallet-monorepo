"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { Select } from "@repo/ui/Select";
import { useState } from "react";
import { TextInput } from "@repo/ui/TextInput";
import { createOnrampTransaction } from "../lib/action/createOnrampTransaction";

const SUPPORTED_BANKS = [
  {
    name: "HDFC Bank",
    redirectUrl: "http://localhost:3000/netbanking/HDFC",
  },
  {
    name: "Axis Bank",
    redirectUrl: "http://localhost:3000/netbanking/Axis",
  },
];

export const AddMoney = () => {
  const [redirectUrl, setRedirectUrl] = useState(
    SUPPORTED_BANKS[0]?.redirectUrl
  );
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(amount) => {
            setAmount(Number(amount));
          }}
        />
        <div className="py-4 text-left">Bank</div>
        <Select
          onSelect={function (value) {
            setRedirectUrl(
              SUPPORTED_BANKS.find((x) => x.name === value)?.redirectUrl || ""
            );
            setProvider(
              SUPPORTED_BANKS.find((x) => x.name === value)?.name || ""
            );
          }}
          options={SUPPORTED_BANKS.map((x) => ({
            key: x.name,
            value: x.name,
          }))}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              const token = await createOnrampTransaction(provider, amount);
              const netbankingURL = redirectUrl + "?token=" + token + "&amount="+amount
              window.location.href = netbankingURL || "";
            }}
          >
            Add Money
          </Button>
        </div>
      </div>
    </Card>
  );
};
