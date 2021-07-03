import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@muya-ui/core";
import { createUpTheme } from "@muya-ui/theme-up";
import { GlobalStyles } from "@muya-ui/theme-light";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={createUpTheme()}>
      <>
        <GlobalStyles resetScrollBar />
        <App />
      </>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
