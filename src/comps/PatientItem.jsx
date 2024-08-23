import logo from "../assets/patient.png";
import { DEPARTEMENTS } from "../helpers/flow";

export default function PatientItem({ data, onViewPatient }) {
  console.log(data.dep);

  return (
    <div className=" md:w-[280px] md:border flex gap-x-4 hover:bg-sky-200/50 hover:border-sky-500  rounded-md p-2 cursor-pointer ">
      <div className=" w-[30pt] h-[30pt] rounded-md overflow-hidden">
        <img src={data.photo || logo} className=" h-[100%] " />
      </div>

      <div className="grow">
        <div className="text-black">{data.nom}</div>
        <div className=" text-sm">
          {/* <span className="text-slate-500">{data.emergContact.phone}</span> */}
          <span className="bg-sky-500 text-xs text-white p-1 font-bold rounded-md">
            {DEPARTEMENTS[data.dep] && DEPARTEMENTS[data.dep].label}
          </span>
          {/* <span>{`, ${CalcAge(new Date(data.dob))} ans`}</span> */}
        </div>
      </div>

      <div>
        <button
          onClick={(e) => onViewPatient(data)}
          className={
            "cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 "
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
}
