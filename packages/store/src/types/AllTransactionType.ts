export type TransactionType = {
  id: string;
  amount: number;
  createdAt: Date;
  type: string;
  provider: string | null;
  mobileNumber: string | null;
  isSender: boolean;
  status: string;
};

export const tempReturn: TransactionType = {
  id: "",
  amount: 0,
  createdAt: new Date(),
  type: "onramp",
  provider: null,
  mobileNumber: null,
  isSender: false,
  status: "Success"
};
