'use client'

import { TestComponent2 } from "@repo/ui/testComponent2";
import type { RootState } from "@repo/store/store";
import { useSelector, useDispatch} from "react-redux";
import { increment, decrement, incrementByAmount, decrementByAmount } from "@repo/store/features/balanceSlice";
import { Appbar } from "@repo/ui/Appbar";

export default function Home() {
  const balance = useSelector((state: RootState) => state.balance.value)
  const dispatch = useDispatch()
  return (
    <div>
      <Appbar user={{name: "Arjit"}} onSignin={() => {}} onSignout={() => {}}></Appbar>
      <TestComponent2></TestComponent2>
      <div>{balance}</div>
      <button onClick={() => {
        if(incrementByAmount){
          dispatch(incrementByAmount?.(1))
        }
      }}>
        changeBalance
      </button>
    </div>
  );
}
