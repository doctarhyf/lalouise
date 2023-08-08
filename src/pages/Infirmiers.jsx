import React, { useEffect, useState } from "react";
import logo from "../assets/react.svg";
import PageHeader from "../comps/PageHeader";
import { StyleButton, StyleInputText } from "../Styles";

import {
  AddNewItemToTable,
  DeleteItem,
  GetAllItemsFromTable,
  GetItemByID,
  TABLE_NAME,
  UpdateInfRoulement,
  UpdateItem,
} from "../db/sb";

import EmptyList from "../comps/EmptyList";
import {
  GetCurrentMonthName,
  GetNumDaysCurMonth,
  GetNumDaysInMonth,
} from "../Helper";

function InfirmierItem({ data, onViewInf }) {
  return (
    <div className="flex gap-x-4 hover:bg-sky-100 rounded-md p-2 cursor-pointer ">
      <img src={logo} />
      <div>
        <div className="text-black">{data.nom}</div>
        <div className=" text-sm">
          <span className="text-slate-500">{data.phone}</span>,{" "}
          <span className="text-white text-bold text-[8pt] p-[4pt] rounded-[4pt] bg-sky-500">
            {data.grade}
          </span>
        </div>
      </div>

      <div>
        <button
          onClick={(e) => onViewInf(data)}
          className={`cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function RoulementGeneral(props) {
  const infirmiers = props.listInfirmiers;
  const numdays = new Array(GetNumDaysCurMonth()).fill(0);
  let cl = `w-[120px] text-sm border p-2 border-slate-500`;

  return (
    <>
      <div className="pb-2 text-green-500 text-lg">
        Roulement, mois de {GetCurrentMonthName()}
      </div>

      <table>
        <tr>
          <td className={cl}>{GetCurrentMonthName()}</td>
          {numdays.map((it, i) => (
            <td key={i} className={cl}>
              {" "}
              {i + 1}{" "}
            </td>
          ))}
        </tr>

        {infirmiers.map((inf, i) => (
          <tr key={i}>
            <td className={cl}>{inf.nom}</td>
            {inf.roulement.map((r, i) => (
              <td key={i} className={cl}>
                {r}
              </td>
            ))}
          </tr>
        ))}
      </table>
      {
        // infirmiers.map((inf, i) => <Roulement key={i} showData id={inf.id} />)
        console.warn(infirmiers[0])
      }
    </>
  );
}

function RoulementDayEditor(props) {
  const [val, setVal] = useState("-");

  useEffect(() => {
    setVal(props.val);

    console.log("p", props);
  }, []);

  async function GetInf(infID) {
    let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, infID);

    return inf;
  }

  function onChangeDaySched(e) {
    console.log("da props", props);

    const v = e.target.value;
    const d = props.day;
    const updateID = props.updateID;
    //const inf = GetInf();

    console.log("value: ", v, ", day: ", d, ", updid: ", updateID);

    setVal(v);

    async function upd() {
      await UpdateInfRoulement(updateID, d, v);
    }

    upd();
  }

  return (
    <select value={val} onChange={onChangeDaySched}>
      <option value={"J"}>J</option>
      <option value={"N"}>N</option>
      <option value={"R"}>R</option>
      <option value={"-"}>-</option>
    </select>
  );
}

function Roulement(props) {
  const numDays = GetNumDaysInMonth(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  );
  const month = GetCurrentMonthName().substring(0, 3).toUpperCase();
  const year = new Date().getFullYear();
  const classtdmonthname = `w-[200px] border border-slate-500`;
  const classtdday = `w-[2rem] text-center border border-slate-500`;
  const [inf, setInf] = useState(null);
  const [infId, setInfId] = useState(-1);

  useEffect(() => {
    const id = props.updateID ? props.updateID : props.id;
    setInfId(id);

    //console.warn('getting inf by id => ', props.id)

    async function getInf() {
      //if(props.updateID === undefined ) return

      let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, id);

      setInf(inf);
    }

    getInf();
  }, []);

  return (
    <div>
      <table>
        {props.showDates && inf && (
          <tr>
            <td className={classtdmonthname}>{`${month}, ${year}`}</td>
            {[...Array(numDays)].map((x, i) => (
              <td className={classtdday}> {i + 1}</td>
            ))}
          </tr>
        )}

        {props.showData && inf && (
          <tr>
            <td className={classtdmonthname}>
              {" "}
              {props.showingRoulementGen ? props.inf.nom : inf.nom}{" "}
            </td>
            {[...Array(numDays)].map((day, i) => (
              <td className={classtdday}>
                {props.editidingInf ? (
                  <RoulementDayEditor
                    val={inf?.roulement[i]}
                    day={i}
                    updateID={props.updateID}
                  />
                ) : (
                  props.inf?.roulement[i] || "-"
                )}
              </td>
            ))}
          </tr>
        )}
      </table>
    </div>
  );
}

function FormNewInf(props) {
  const titleClass = `text-xl text-green-500 mb-2`;
  console.log("damn", props);

  return (
    <>
      <div>
        {props.editidingInf ? (
          <div className={titleClass}> Editing </div>
        ) : (
          <div className={titleClass}> Ajout Nouveau Infirmer </div>
        )}
      </div>
      <form>
        <div>Nom</div>
        <input
          type="text"
          disabled={props.editidingInf ? false : false}
          value={props.infNom}
          onChange={(e) => props.setInfNom(e.target.value)}
          className={StyleInputText}
        />
        <div>Phone</div>
        <input
          type="phone"
          value={props.infPhone}
          onChange={(e) => props.setInfPhone(e.target.value)}
          className={StyleInputText}
        />
        <div>Grade</div>
        <input
          type="text"
          value={props.infGrade}
          onChange={(e) => props.setInfGrade(e.target.value)}
          className={StyleInputText}
        />
        <div>Equipe</div>
        <input
          type="text"
          value={props.infTeam}
          onChange={(e) => props.setInfTeam(e.target.value)}
          className={StyleInputText}
        />

        {props.editidingInf && (
          <>
            <div>Programe</div>
            <Roulement
              editidingInf={props.editidingInf}
              showDates
              showData
              updateID={props.updateID}
            />
          </>
        )}

        <div>
          {!props.editidingInf && (
            <button
              className={StyleButton("green-500")}
              onClick={props.onNewInf}
            >
              SAVE
            </button>
          )}
          {props.editidingInf && (
            <button
              className={StyleButton("green-500")}
              onClick={(e) => {
                e.preventDefault();
                props.onUpdateInf(props.updateID);
              }}
            >
              UPDATE
            </button>
          )}
          <button className={StyleButton("gray-500")} onClick={props.onCancel}>
            CANCEL
          </button>
          <button className={StyleButton("red-500")} onClick={props.onDelInf}>
            DELETE
          </button>
        </div>
      </form>
    </>
  );
}

export default function Infirmiers() {
  const [q, setQ] = useState("");
  const [listInfirmiers, setListInfirmers] = useState([]);

  const [infNom, setInfNom] = useState("Gracia Liwena");
  const [infPhone, setInfPhone] = useState("0892125047");
  const [infGrade, setInfGrade] = useState("IT");
  const [infTeam, setInfTeam] = useState("D");
  const [selectedSection, setSelectedSection] = useState("inflist");
  const [updateID, setUpdateID] = useState(-1);
  const [editidingInf, setEditidingInf] = useState(false);

  const selClass = "text-sky-500 border-b-sky-500 bg-sky-500 text-white";

  useEffect(() => {
    refreshInfList();
  }, []);

  function onViewInf(inf) {
    setEditidingInf(true);
    setUpdateID(inf.id);

    let curViewInf = inf;

    setInfNom(curViewInf.nom);
    setInfPhone(curViewInf.phone);
    setInfGrade(curViewInf.grade);
    setInfTeam(curViewInf.team);

    setSelectedSection("infnew");
  }

  function onChangeSection(e) {
    const secName = e.target.name;
    setSelectedSection(secName);
    console.log(secName);

    if (secName === "infnew") {
      setEditidingInf(false);
    }
  }

  function onSearchInf(e) {
    const q = e.target.value;
    setQ(q);
  }

  async function onNewInf(e) {
    e.preventDefault();

    let newInf = {};

    newInf.nom = infNom;
    newInf.phone = infPhone;
    newInf.grade = infGrade;
    newInf.team = infTeam;
    newInf.roulement = new Array(GetNumDaysCurMonth()).fill("J");

    console.log(newInf);

    await AddNewItemToTable(newInf, TABLE_NAME.INFIRMIERS);
    resetForm();
    setSelectedSection("inflist");
    refreshInfList();
  }

  async function onUpdateInf(updateID) {
    console.log(updateID);

    let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, updateID);
    let updInf = {};

    updInf.nom = infNom;
    updInf.phone = infPhone;
    updInf.grade = infGrade;
    updInf.team = infTeam;
    updInf.roulement = inf.roulement;

    await UpdateItem(TABLE_NAME.INFIRMIERS, updateID, updInf);
    refreshInfList();
  }

  async function onDelInf(e) {
    e.preventDefault();

    if (confirm("Are you sure you wanna delete this record?")) {
      await DeleteItem(TABLE_NAME.INFIRMIERS, updateID);
      refreshInfList();
    }
  }

  async function refreshInfList() {
    setListInfirmers(await GetAllItemsFromTable(TABLE_NAME.INFIRMIERS));
    setSelectedSection("inflist");
  }

  function resetForm() {
    setInfNom("");
    setInfPhone("");
    setInfGrade("");
    setInfTeam("");
  }

  function onCancel(e) {
    e.preventDefault();
    setSelectedSection("inflist");
  }

  return (
    <div className="p-8">
      <PageHeader title="Infirmers" sub="Liste de tous les infirmiers" />

      <div className="flex flex-col md:flex-row mb-8 border border-white border-b-sky-500">
        <button
          name="inflist"
          onClick={onChangeSection}
          className={`px-2 mx-4 ml-0 border border-white  ${
            selectedSection === "inflist" ? selClass : "hover:text-sky-500"
          }  hover:border-b-sky-500  rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Liste des infirmiers
        </button>
        <button
          name="inftt"
          onClick={onChangeSection}
          className={`px-2 mx-4 border border-white ${
            selectedSection === "inftt" ? selClass : "hover:text-sky-500"
          }  hover:border-b-sky-500   rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Horaire
        </button>
        <button
          name="infnew"
          onClick={onChangeSection}
          className={`px-2 mx-4 border border-white ${
            selectedSection === "infnew" ? selClass : "hover:text-sky-500"
          }  hover:border-b-sky-500   rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Nouveau Infirmier
        </button>
      </div>

      {selectedSection === "inflist" && (
        <div className="list-infirmiers mt-8">
          <div>
            {listInfirmiers && listInfirmiers.length > 0 ? (
              <div>
                <div className="m-2">
                  <input
                    className={StyleInputText}
                    type="search"
                    value={q}
                    onChange={onSearchInf}
                    placeholder="Search ..."
                  />
                </div>
                <div>
                  {listInfirmiers.map((inf, idx) => (
                    <InfirmierItem key={idx} data={inf} onViewInf={onViewInf} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <EmptyList
                  title={"Pas d'infirmier"}
                  sub={"Veuillez ajouter les infirmiers"}
                />
                <div>
                  <button
                    className={StyleButton("green-500")}
                    onClick={(e) => {
                      setSelectedSection("infnew");
                    }}
                  >
                    Ajouter Infirmier
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedSection === "inftt" && (
        <div className="horaire">
          <RoulementGeneral
            listInfirmiers={listInfirmiers}
            updateID={updateID}
          />
        </div>
      )}

      {selectedSection === "infnew" && (
        <div className="view-inf">
          <FormNewInf
            onDelInf={onDelInf}
            editidingInf={editidingInf} //if viewing or editing
            updateID={updateID}
            onUpdateInf={onUpdateInf}
            infNom={infNom}
            setInfNom={setInfNom}
            infPhone={infPhone}
            setInfPhone={setInfPhone}
            infGrade={infGrade}
            setInfGrade={setInfGrade}
            infTeam={infTeam}
            setInfTeam={setInfTeam}
            onNewInf={onNewInf}
            onCancel={onCancel}
          />
        </div>
      )}
    </div>
  );
}
