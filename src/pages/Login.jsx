import React, { useRef, useState } from "react";
import { ReactDOM } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import hosp from "../assets/hospital.png";
import ld from "../assets/loading.gif";
import { GetUser } from "../db/sb";

export default function Login() {
  const [loading, setloading] = useState();
  const [phone, setphone] = useState("");
  const [pwd, setpwd] = useState("");
  const [error, seterror] = useState(false);
  const [userdata, setuserdata] = useState();
  const navigate = useNavigate();

  function onLogin(e) {
    Login();

    /*  localStorage.setItem("llu", '{"phone":"0893092849","role":"AG"}');

    setTimeout(() => {
      window.location.reload();
      // alert("ok");
    }, 2000); */
  }

  async function Login() {
    setuserdata(undefined);
    setloading(true);
    seterror(false);

    await GetUser(
      phone,
      pwd,
      (d) => {
        setuserdata(d);
        setloading(false);

        console.warn("Found user ...\n", d);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      (e) => {
        setloading(false);
        seterror(
          "Error login, verifiez votre mot de passe ou contacter l'admin pour la creation d'un nouveau compte!"
        );
        console.log(e);
      }
    );
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
            value={phone}
            onChange={(e) => setphone(e.target.value)}
            className="p-2 outline-none rounded-md"
            type="text"
            maxLength={10}
            placeholder="ex:0893092849"
          />

          <div>Password</div>
          <input
            value={pwd}
            onChange={(e) => setpwd(e.target.value)}
            className="p-2 outline-none rounded-md"
            type="password"
            maxLength={10}
            onKeyUp={(e) => {
              if (e.code == "Enter" && phone.length === 10 && pwd.length >= 6) {
                Login();
              }
            }}
          />

          <div className={`mx-auto ${loading ? "block" : "hidden"} `}>
            <img src={ld} width={30} />
          </div>

          <div className="text-sm text-center">
            {!error && phone.length === 0 && (
              <div>Veuillez vous connecter votre numero</div>
            )}
            {error && (
              <div className="bg-red-500 text-white font-bold p-1 rounded-md">
                {error}
              </div>
            )}

            {userdata && (
              <div className="bg-green-500 text-white font-bold p-1 rounded-md">
                Login success, binvenue <b>{userdata.displayname}</b>
              </div>
            )}
          </div>

          <button
            onClick={onLogin}
            className={` ${
              phone.length === 10 && pwd.length >= 6 ? "visible" : "invisible"
            } border-purple-500 rounded-md bg-purple-400 text-white hover:bg-purple-500  border p-2`}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
