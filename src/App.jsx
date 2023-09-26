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
    localStorage.removeItem("llu");

    /* let userFound = localStorage.getItem("llu");

    if (userFound) {
      userFound = JSON.parse(userFound);

      let expired = userFound.login_expires - new Date().getTime() < 0;

      if (!expired) {
        setuser(userFound);
      } else {
        localStorage.removeItem("llu");
      }
    }

    console.log(userFound); */
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/lalouise/"
          element={user ? <Layout user={user} /> : <Login />}
        >
          <Route index element={<Home user={user} />} />
          <Route path="/lalouise/home" element={<Home user={user} />} />
          <Route path="/lalouise/pharmacy" element={<Pharmacy user={user} />} />
          <Route
            path="/lalouise/reception"
            element={<Reception user={user} />}
          />
          <Route
            path="/lalouise/infirmiers"
            element={<Infirmiers user={user} />}
          />
          <Route path="/lalouise/finances" element={<Finances user={user} />} />
          <Route path="/lalouise/params" element={<Params user={user} />} />
          <Route path="*" element={<NotFound user={user} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
