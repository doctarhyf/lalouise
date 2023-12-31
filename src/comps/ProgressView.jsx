import React, { useState } from "react";
import spin from "../assets/spin.svg";

export default function ProgressView({ show }) {
  return (
    <div
      className={`${show ? "visible" : "hidden"}  flex justify-center mb-4 `}
    >
      <img src={spin} width={40} height={40} />
    </div>
  );
}
