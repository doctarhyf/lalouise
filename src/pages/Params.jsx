import React, { useRef } from "react";
import PageHeader from "../comps/PageHeader";
import ActionButton from "../comps/ActionButton";
import cloud from "../assets/cloud.png";

export default function Params() {
  const refs = [useRef(), useRef(), useRef(), useRef()];

  function onUpdateSlide(idx) {
    const ref = refs[idx];
    const input = ref.current;

    input.click();
    //console.log(ref);
  }

  function handleChange(e) {
    const { name, files } = e.target;
    const file = files[0];
    const [, id] = name.split("_");

    console.log("Selected files:", name, file, id);
  }

  return (
    <div className="p-8 container">
      <PageHeader title="Parametres" sub="Tous les parametres du systems" />

      <div className=" flex gap-4 flex-col sm:flex-row ">
        {[...Array(4)].map((promoSlide, i) => (
          <div key={i}>
            <div className=" font-bold ">IMG {i + 1}</div>
            <div className=" relative w-full object-cover sm:w-40 h-48 sm:h-28 bg-slate-700 rounded-md overflow-hidden">
              <div className=" absolute inset-0 flex items-center justify-center   ">
                <progress max={100} value={75} />
              </div>
              <img
                className=" object-contain "
                src="https://cdn.britannica.com/15/136315-050-EB55175C/50-Cent-Eminem-Dr-Dre-2004.jpg"
              />
            </div>
            <input
              accept=".png, .jpg, .jpeg"
              onChange={handleChange}
              type="file"
              name={`file_${i}`}
              hidden
              ref={refs[i]}
            />

            <ActionButton
              icon={cloud}
              title={"UPDATE"}
              onClick={(e) => onUpdateSlide(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
