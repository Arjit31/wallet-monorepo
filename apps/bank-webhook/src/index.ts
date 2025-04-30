import express from "express";
import { prisma } from "@repo/db";
import cors from "cors";
import { expireQueue } from "./queues/expireQueue";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/bank-webhook", async function (req, res) {
  const paymentDetails: {
    token: string;
    userId: string;
    amount: number;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };
  try {
    await prisma.$transaction([
      prisma.onRampTransaction.update({
        where: {
          token: paymentDetails.token,
          userId: paymentDetails.userId,
          amount: paymentDetails.amount,
          status: "Processing"
        },
        data: {
          status: "Success",
        },
      }),
      prisma.balance.update({
        where: {
          userId: paymentDetails.userId,
        },
        data: {
          amount: {
            increment: Number(paymentDetails.amount),
          },
        },
      }),
    ]);
    res.json("captured");
  } catch (error) {
    try {
      await prisma.onRampTransaction.update({
        where: {
          token: paymentDetails.token,
        },
        data: {
          status: "Failure",
        },
      });
    } catch (error) {
      console.log(error);
    }
    console.error(error);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.post("/setExpiry", (req, res) => {
  const paymentDetails: {
    token: string;
    userId: string;
  } = {
    token: req.body.token,
    userId: req.body.userId,
  };
  try {
    expireQueue.add(
      "expireQueue",
      { token: paymentDetails.token, userId: paymentDetails.userId },
      { delay: 60 * 1000 }
    );
    res.status(200).send({ message: "Entry created and job scheduled" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error!" });
  }
});
app.listen(3002);
