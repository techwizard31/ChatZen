import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChatProvider } from "./context/chatProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatProvider>
  </BrowserRouter>
);

reportWebVitals();
