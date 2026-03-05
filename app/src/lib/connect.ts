import { useMicrovote } from "./context"
import { Microbit } from "./microbit";
import { MessageType } from "./reducers";
import { SerialVoteDevice } from "./serialvote";

export function useConnect() {
  const { dispatch } = useMicrovote();
  return async function() {
    const microbit = await Microbit.request();
    await microbit.open();
    const serialVote = new SerialVoteDevice(microbit);
    serialVote.onResults((results) => dispatch({ type: MessageType.SetResults, results }));
    serialVote.onDevices((devices) => dispatch({ type: MessageType.SetDevices, devices }));
    dispatch({ type: MessageType.SetSerialVote, serialVote });
  }
}
