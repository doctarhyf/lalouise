import { useState } from "react";
import ToggleButton from "../comps/ToggleButton";
import DOBInput from "./DOBInput";

const REG = new RegExp("^[0-9]+$");

export default function NotFound({}) {
  function onSetNewState(yes) {
    console.log("current state => ", yes);
  }

  return (
    <div>
      <div>Not found</div>
      <div>
        <ToggleButton onSetNewState={onSetNewState} />
      </div>

      <DOBInput initDate={"15/06/1989"} />
    </div>
  );
}
