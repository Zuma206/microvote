import { MicrovoteProvider } from "./lib/context";
import { MantineProvider } from "@mantine/core";
import { Shell } from "./components/Shell";
import { Switch } from "./components/Switch";

export function App() {
  return (
    <MantineProvider>
      <MicrovoteProvider>
        <Shell>
          <Switch />
        </Shell>
      </MicrovoteProvider>
    </MantineProvider>
  );
}
