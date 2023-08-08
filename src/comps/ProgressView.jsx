import React, { useState } from "react";
import spin from "../assets/spin.svg";

export default function ProgressView(props) {
  const { show } = props;

  return (
    <div
      className={`${show ? "visible" : "invisible"}  flex justify-center mb-4 `}
    >
      <img src={spin} width={40} height={40} />
    </div>
  );
}
