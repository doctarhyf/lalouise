import { useEffect, useState } from "react";
import nurse from "../assets/nurse.png";

export default function IconButtonsCont({
  data,
  onRadioButtonSelected,
  hidefirst,
  selectedcode,
}) {
  const [selectedid, setselectedid] = useState();

  useEffect(() => {
    if (selectedcode) setselectedid(selectedcode);
  }, []);

  function onClick(dt) {
    setselectedid(dt.code);
    onRadioButtonSelected(dt);
  }

  return (
    <div className={`flex flex-col md:flex-row my-4 gap-4`}>
      {data.map((d, i) => (
        <div
          key={d.code}
          onClick={(e) => onClick(data[i])}
          className={` group w-full md:w-fit
          
          ${i === 0 && hidefirst ? "hidden" : ""}
          
          ${
            selectedid === d.code
              ? "bg-sky-500 text-white"
              : " text-black bg-white"
          } flex border-1 border p-1 rounded-md cursor-pointer hover:border-sky-500 `}
        >
          <div>
            <img src={nurse} width={40} />
          </div>
          <div>
            <div>{d.title}</div>
            <div
              className={` ${
                selectedid === d.code ? "text-sky-200" : "text-neutral-600"
              } text-sm  group-hover:text-sky-600`}
            >
              {d.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
