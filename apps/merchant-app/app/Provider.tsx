"use client";

import { Provider } from "react-redux";
import { store } from "@repo/store/store";

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
