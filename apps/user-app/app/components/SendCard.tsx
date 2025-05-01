"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/Center";
import { TextInput } from "@repo/ui/TextInput";
import { useState } from "react";
import { p2pTransfer } from "../lib/action/p2pTransfer";
import { redirect } from "next/navigation";

export function SendCard() {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <Card title="Send">
      <div className="w-full pt-2">
        <TextInput
          placeholder={"Number"}
          label="Number"
          onChange={(value) => {
            setNumber(value);
          }}
        />
        <TextInput
          placeholder={"Amount"}
          label="Amount"
          onChange={(value) => {
            setAmount(value);
          }}
        />
        <div className="pt-4 flex justify-center">
          <Button
            onClick={async () => {
              const {message} = await p2pTransfer(number, Number(amount));
              if(message != "success"){
                alert(message);
                redirect("/dashboard")
              }
              redirect("/dashboard");
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
