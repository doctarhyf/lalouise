import React, { useRef, useState } from "react";
import { ReactDOM } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import hosp from "../assets/hospital.png";
import ld from "../assets/loading.gif";

export default function Login() {
  const [loading, setloading] = useState();
  const refpwd = useRef();
  const refnum = useRef();
  const navigate = useNavigate();

  function onLogin(e) {
    setloading(true);

    localStorage.setItem("llu", '{"phone":"0893092849","role":"AG"}');

    setTimeout(() => {
      window.location.reload();
      // alert("ok");
    }, 2000);
  }

  return (
    <div className="bg-sky-500 place-items-center flex h-[100vh] w-[100%]">
      <div className="w-full space-y-8 mx-auto sm:max-w-[320pt] p-8">
        <div className="logo flex gap-2 mx-auto w-fit ">
          <img
            src={hosp}
            className="min-w-[28pt]  h-[28pt] inline-block cursor-pointer"
          />

          <span className="text-3xl font-bold text-white">LaLouise</span>
        </div>

        <div className="flex space-y-4 flex-col">
          <div>Phone</div>
          <input
            ref={refnum}
            className="p-2 outline-none rounded-md"
            type="text"
            maxLength={10}
            placeholder="ex:0893092849"
          />

          <div>Password</div>
          <input
            ref={refpwd}
            className="p-2 outline-none rounded-md"
            type="text"
            maxLength={10}
          />

          <div className={`mx-auto ${loading ? "block" : "hidden"} `}>
            <img src={ld} width={30} />
          </div>

          <div className="text-sm text-center">
            Veuillez vous connecter votre numero
          </div>

          <button
            onClick={onLogin}
            className="border-purple-500 rounded-md bg-purple-400 text-white hover:bg-purple-500  border p-2"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
