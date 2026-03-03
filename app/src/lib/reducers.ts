import { SerialVoteDevice } from "./serialvote";
import { pages } from "../components/Switch";
import { MicrovoteState } from "./context";

export enum MessageType {
  SetSerialVote,
  StartVote,
  ChangePage,
  SetResults,
}

type SetMicrobitMessage = { type: MessageType.SetSerialVote, serialVote: SerialVoteDevice };
type StartVoteMessage = { type: MessageType.StartVote, title: string, choices: string[] };
type ChangePageMessage = { type: MessageType.ChangePage, page: keyof typeof pages };
type SetResultsMessage = { type: MessageType.SetResults, results: number[] };
type Message =
  SetMicrobitMessage |
  StartVoteMessage |
  ChangePageMessage |
  SetResultsMessage;

export function reducer(state: MicrovoteState, message: Message): MicrovoteState {
  switch (message.type) {
    case MessageType.SetSerialVote: return setMicrobit(state, message);
    case MessageType.StartVote: return startVote(state, message);
    case MessageType.ChangePage: return changePage(state, message);
    case MessageType.SetResults: return setResults(state, message);
  }
}

function setMicrobit(state: MicrovoteState, msg: SetMicrobitMessage): MicrovoteState {
  return { ...state, serialVote: msg.serialVote };
}

function startVote(state: MicrovoteState, msg: StartVoteMessage): MicrovoteState {
  if (state.serialVote) state.serialVote.start(msg.choices.length);
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

function setResults(state: MicrovoteState, msg: SetResultsMessage): MicrovoteState {
  if (!state.vote) return state;
  return { ...state, vote: { ...state.vote, results: msg.results } };
}
