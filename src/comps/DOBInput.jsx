import { useState } from "react";

export default function DOBInput({ onNewDate, initDate, setDateIsValid }) {
  const [dob, setdob] = useState([]);
  const [valid, setvalid] = useState(false);

  function onChange(e) {
    const dateString = e.target.value;
    setdob(dateString);
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    const valid = regex.test(dateString);
    if (setDateIsValid) setDateIsValid(valid);

    if (!valid) {
      setvalid(false);
      console.error(`Date ${dateString}, is invalid`);
      return;
    }

    setvalid(true);
    let [dd, mm, yyyy] = dateString.split("/");
    let date = new Date(`${mm}-${dd}-${yyyy}`);

    if (onNewDate) onNewDate(dateString);
  }

  function DOB2DDMMYYYY(dt) {
    if (!(dt instanceof Date && !isNaN(dt))) {
      console.log(`date ${dt} is not valid`);

      return dt;
    }

    let [dd, mm, yyyy] = [dt.getDate(), dt.getMonth() + 1, dt.getFullYear()];
    dd = dd < 10 ? "0" + dd : dd;
    mm = mm < 10 ? "0" + mm : mm;

    return `${dd}/${mm}/${yyyy}`;
  }

  return (
    <div>
      <input
        value={dob}
        maxLength={10}
        className={`p-1 rounded-md outline-none border border-neutral-400
        
         ${valid ? "border-green-500   " : " border-red-500 "} 
        `}
        type="text"
        onChange={onChange}
        placeholder={initDate || "ex: 17/05/1997"}
      />
      <div
        className={` border-1  ${
          valid ? "text-green-500   " : " text-red-500 "
        } font-bold p-1 text-xs`}
      >
        {valid ? "valid" : "invalid"}
        {" date"}
      </div>
    </div>
  );
}
