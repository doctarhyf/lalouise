import { useState } from "react";
import ToggleButton from "../comps/ToggleButton";

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
    </div>
  );
}
