import React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ReactDOM } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Pharmacy from "./pages/Pharmacy";
import Reception from "./pages/Reception";
import Infirmiers from "./pages/Infirmiers";
import Finances from "./pages/Finances";
import Params from "./pages/Params";

import { createClient } from "@supabase/supabase-js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lalouise/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/lalouise/home" element={<Home />} />
          <Route path="/lalouise/pharmacy" element={<Pharmacy />} />
          <Route path="/lalouise/reception" element={<Reception />} />
          <Route path="/lalouise/infirmiers" element={<Infirmiers />} />
          <Route path="/lalouise/finances" element={<Finances />} />
          <Route path="/lalouise/params" element={<Params />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
