import { ActionDispatch, createContext, PropsWithChildren, use, useReducer } from "react";
import { pages } from "../components/Switch";
import { Microbit } from "./microbit";

interface MicrovoteState {
  page: keyof typeof pages,
  microbit?: Microbit;
  vote?: {
    title: string;
    choices: string[];
    results: number[];
  };
  devices: number[];
}

const initialState: MicrovoteState = { devices: [], page: "New Vote" };

export enum MessageType {
  SetMicrobit,
  StartVote,
  ChangePage,
}

type Message =
  { type: MessageType.SetMicrobit, microbit: Microbit } |
  { type: MessageType.StartVote, title: string, choices: string[] } |
  { type: MessageType.ChangePage, page: keyof typeof pages };

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
        },
        page: "Results",
      };
    case MessageType.ChangePage:
      return { ...state, page: message.page };
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
