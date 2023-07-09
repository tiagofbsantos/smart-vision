import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "tachyons";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

serviceWorker.unregister();
