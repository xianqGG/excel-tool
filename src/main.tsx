import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@muya-ui/core";
import { createUpTheme } from "@muya-ui/theme-up";
import { GlobalStyles } from "@muya-ui/theme-light";
import av from "leancloud-storage";

import App from "./App";

av.init({
  appId: "cb4IEhttbM3bmeUHuoVMc49C-MdYXbMMI",
  appKey: "kLnUa0sg5DEkIaGsvRAlQ5x3",
});

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
