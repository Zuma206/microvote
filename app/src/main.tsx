import { createRoot } from "react-dom/client";
import { App } from "./App";

import "@mantine/core/styles.css";

// Finds the root element and initialised react inside of it.
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("couldn't find root element");
const root = createRoot(rootElement);
root.render(<App />);
