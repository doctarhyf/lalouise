import { useState } from "react";
import ToggleButton from "../comps/ToggleButton";

const REG = new RegExp("^[0-9]+$");

function DOBInput() {
  const [dob, setdob] = useState([]);
  const refdob = useState();
  let dobdata = "";

  function onkeyup(e) {
    const { keyCode } = e;
    const char = String.fromCharCode(keyCode);

    const dg = REG.test(char);

    console.log(keyCode);

    setdob((old) => {
      if (keyCode === 8) {
        return "";
      }

      if ((dg && old.length < 2) || old.length >= 3 || old.length >= 5) {
        return old + char;
      } else {
        if (old.length === 2 || old.length === 5) {
          return old + "/";
        } else {
          return old;
        }
      }

      if (old.length === 2) {
        return old;
      }

      return old;
    });
  }

  return (
    <div>
      <input
        value={dob}
        maxLength={10}
        className="p-1 w-full md:w-fit rounded-md outline-none border border-neutral-400 "
        type="text"
        //value={dob}
        onKeyUp={onkeyup}
      />
    </div>
  );
}

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

      <DOBInput />
    </div>
  );
}
