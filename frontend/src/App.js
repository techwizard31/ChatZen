import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import Chat from "./pages/Chat.js";
import "./app.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chat" element={<Chat />} exact />
      </Routes>
    </div>
  );
}

export default App;
