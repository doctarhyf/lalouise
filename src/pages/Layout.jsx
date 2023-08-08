import React, { useState } from "react";
import { ReactDOM } from "react";
import { Link, Outlet } from "react-router-dom";
import hosp from "../assets/hospital.png";

function LinkItem({ link }) {
  return (
    <li className="p-2 ml-0">
      <Link
        className="hover:bg-white p-2 ml-0 hover:text-sky-500 px-2 rounded-[4pt]"
        to={link.path}
      >
        {link.title}
      </Link>
    </li>
  );
}

export default function Layout() {
  const [showMenu, setShowMenu] = useState(true);

  const links = [
    { title: "Home", path: "/lalouise/" },
    { title: "Reception", path: "/lalouise/reception" },
    { title: "Pharmacy", path: "/lalouise/pharmacy" },
    { title: "Infirmiers", path: "/lalouise/infirmiers" },
    { title: "Finances", path: "/lalouise/finances" },
    { title: "Paramtres", path: "/lalouise/params" },
  ];

  return (
    <div className="flex main-layout h-screen ">
      <nav
        className={`menu  text-white h-full ${
          showMenu
            ? "p-8  bg-sky-500"
            : "p-2  w-[56pt] bg-gradient-to-r from-cyan-500 to-blue-500 "
        } `}
      >
        <img
          onClick={(e) => setShowMenu(!showMenu)}
          src={hosp}
          className="w-[28pt] h-[28pt] inline-block cursor-pointer"
        />

        {showMenu && (
          <ul>
            <li className="text-white font-extrabold align-center text-3xl mb-4">
              <span>LaLouise</span>
            </li>

            {links.map((link, idx) => (
              <LinkItem link={link} key={idx} />
            ))}

            <div className="text-[10pt] flex-grow justify-end absolute bottom-0 mb-8 text-black text-opacity-75">
              @Copyright 2023{" "}
            </div>
          </ul>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
