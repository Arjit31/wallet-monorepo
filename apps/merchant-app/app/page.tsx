'use client'

import { TestComponent2 } from "@repo/ui/testComponent2";
import type { RootState } from "@repo/store/store";
import { useSelector, useDispatch} from "react-redux";
import { increment, decrement, incrementByAmount, decrementByAmount } from "@repo/store/features/balanceSlice";

export default function Home() {



  const balance = useSelector((state: RootState) => state.balance.value)
  const dispatch = useDispatch()
  return (
    <div>
      Test PULL
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
