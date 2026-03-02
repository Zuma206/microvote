import { MantineProvider } from "@mantine/core";
import { MicrobitProvider } from "./lib/context";
import { Shell } from "./components/Shell";
import { Switch } from "./components/Switch";
import { Init } from "./components/Init";
import { useState } from "react";

export function App() {
  const [microbit, setMicrobit] = useState(false);

  return (
    <MantineProvider>
      <MicrobitProvider {...{ microbit, setMicrobit }}>
        <Shell>
          {microbit ? <Switch /> : <Init />}
        </Shell>
      </MicrobitProvider>
    </MantineProvider >
  );
}
