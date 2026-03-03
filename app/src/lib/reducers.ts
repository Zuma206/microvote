import { SerialVoteDevice } from "./serialvote";
import { pages } from "../components/Switch";
import { MicrovoteState } from "./context";
import { Microbit } from "./microbit";

export enum MessageType {
  SetMicrobit,
  StartVote,
  ChangePage,
}

type SetMicrobitMessage = { type: MessageType.SetMicrobit, microbit: Microbit };
type StartVoteMessage = { type: MessageType.StartVote, title: string, choices: string[] };
type ChangePageMessage = { type: MessageType.ChangePage, page: keyof typeof pages };
type Message =
  SetMicrobitMessage |
  StartVoteMessage |
  ChangePageMessage;

export function reducer(state: MicrovoteState, message: Message): MicrovoteState {
  switch (message.type) {
    case MessageType.SetMicrobit: return setMicrobit(state, message);
    case MessageType.StartVote: return startVote(state, message);
    case MessageType.ChangePage: return changePage(state, message);
  }
}

function setMicrobit(state: MicrovoteState, msg: SetMicrobitMessage): MicrovoteState {
  return { ...state, microbit: new SerialVoteDevice(msg.microbit) };
}

function startVote(state: MicrovoteState, msg: StartVoteMessage): MicrovoteState {
  return {
    ...state,
    vote: {
      choices: msg.choices,
      title: msg.title,
      results: [],
    },
    page: "Results",
  };
}

function changePage(state: MicrovoteState, msg: ChangePageMessage): MicrovoteState {
  return { ...state, page: msg.page }
}
