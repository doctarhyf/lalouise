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
import NotFound from "./pages/NotFoud";

function App() {
  const [user, setuser] = useState();

  useEffect(() => {
    const u = localStorage.getItem("llu");

    setuser(u);

    console.log(u);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lalouise/" element={user ? <Layout /> : <Login />}>
          <Route index element={<Home />} />
          <Route path="/lalouise/home" element={<Home />} />
          <Route path="/lalouise/pharmacy" element={<Pharmacy />} />
          <Route path="/lalouise/reception" element={<Reception />} />
          <Route path="/lalouise/infirmiers" element={<Infirmiers />} />
          <Route path="/lalouise/finances" element={<Finances />} />
          <Route path="/lalouise/params" element={<Params />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
