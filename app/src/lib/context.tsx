import { createContext, Dispatch, SetStateAction, PropsWithChildren, use } from "react";

interface MicrobitContext {
  setMicrobit: Dispatch<SetStateAction<boolean>>;
  microbit: boolean;
}

const MicrobitContext = createContext<MicrobitContext | null>(null);

export function MicrobitProvider(props: PropsWithChildren<MicrobitContext>) {
  return <MicrobitContext value={props}>{props.children}</MicrobitContext>;
}

export function useMicrobit() {
  const context = use(MicrobitContext);
  if (!context) throw new Error("Microbit context is not provided");
  return context;
}
