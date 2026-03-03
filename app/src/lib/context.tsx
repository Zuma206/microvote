import { ActionDispatch, createContext, PropsWithChildren, use, useReducer } from "react";
import { Microbit } from "./microbit";

interface MicrovoteState {
  microbit?: Microbit;
  vote?: {
    title: string;
    choices: string[];
    results: number[];
  };
  devices: number[];
}

const initialState: MicrovoteState = { devices: [] };

export enum MessageType {
  SetMicrobit,
  StartVote,
}

type Message =
  { type: MessageType.SetMicrobit, microbit: Microbit } |
  { type: MessageType.StartVote, title: string, choices: string[] };

function reducer(state: MicrovoteState, message: Message): MicrovoteState {
  switch (message.type) {
    case MessageType.SetMicrobit:
      return { ...state, microbit: message.microbit };
    case MessageType.StartVote:
      return {
        ...state,
        vote: {
          choices: message.choices,
          title: message.title,
          results: [],
        }
      };
  }
}

interface Context extends MicrovoteState {
  dispatch: ActionDispatch<Parameters<typeof reducer> extends [_: any, ...(infer U)] ? U : never>;
}

const Context = createContext<Context | null>(null);

export function MicrovoteProvider(props: PropsWithChildren) {
  const [context, dispatch] = useReducer(reducer, initialState);
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
