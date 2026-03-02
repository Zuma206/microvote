import { createRoot } from "react-dom/client";

// Finds the root element and initialised react inside of it.
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("couldn't find root element");
const root = createRoot(rootElement);
root.render(<h1>Microvote</h1>);
