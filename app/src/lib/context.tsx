import { ActionDispatch, createContext, PropsWithChildren, use, useReducer } from "react";
import { SerialVoteDevice } from "./serialvote";
import { pages } from "../components/Switch";
import { reducer } from "./reducers";

export class MicrovoteState {
  page: keyof typeof pages = "New Vote";
  microbit?: SerialVoteDevice;
  devices: number[] = [];
  vote?: {
    title: string;
    choices: string[];
    results: number[];
  };
}


interface Context extends MicrovoteState {
  dispatch: ActionDispatch<Parameters<typeof reducer> extends [_: any, ...(infer U)] ? U : never>;
}

const Context = createContext<Context | null>(null);

export function MicrovoteProvider(props: PropsWithChildren) {
  const [context, dispatch] = useReducer(reducer, new MicrovoteState());
  return (
    <Context.Provider value={{ ...context, dispatch }}>
      {props.children}
    </Context.Provider>
  )
}

export function useMicrovote() {
  const context = use(Context);
  if (context === null) throw new Error("Microvote context not provided");
  return context;
}
