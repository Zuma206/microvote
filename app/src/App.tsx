import { MantineProvider } from "@mantine/core";
import { MicrobitProvider } from "./lib/context";
import { Shell } from "./components/Shell";
import { Init } from "./components/Init";
import { useState } from "react";
import { Results } from "./components/Results";

export function App() {
  const [microbit, setMicrobit] = useState(false);

  return (
    <MantineProvider>
      <MicrobitProvider {...{ microbit, setMicrobit }}>
        <Shell>
          {microbit ? <Results /> : <Init />}
        </Shell>
      </MicrobitProvider>
    </MantineProvider >
  );
}
