import React, { useEffect, useState } from "react";
import logo from "../assets/react.svg";
import PageHeader from "../comps/PageHeader";
import { StyleButton, StyleInputText } from "../Styles";
import nurse from "../assets/nurse.png";

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
import ProgressView from "../comps/ProgressView";
import { cltd } from "../helpers/flow";
const titleClass = `text-xl text-green-500 mb-2`;

function InfirmierItem({ data, onViewInf }) {
  return (
    <div className="flex gap-x-4 hover:bg-sky-100 rounded-md p-2 cursor-pointer ">
      <div className="w-[30pt] h-[30pt]">
        <img src={nurse} />
      </div>
      <div className="grow">
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

function Roul({ infData, editidingInf, updateID, loadData, hideTopRows }) {
  function onUpdateRoulement(infID, val, day) {
    if (infID === undefined) return;

    let data = infData;
    let roulement = data.roulement;
    roulement[day] = val;

    data.roulement = roulement;

    UpdateItem(TABLE_NAME.INFIRMIERS, infID, data, (d) => {
      console.log("update finished => ", d);
      loadData();
    });
  }

  return (
    <div>
      <table className="table-auto">
        <thead>
          <tr>
            {!hideTopRows && (
              <td
                align="center"
                colSpan={
                  (infData.roulement && infData.roulement.length + 1) || 0
                }
                className={cltd}
              >
                Roulement Mois de 'month'
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {!hideTopRows && (
            <tr>
              <td className={cltd}>Jours</td>
              {infData.roulement &&
                infData.roulement.map((d, i) => (
                  <td className={cltd} key={i}>
                    {i + 1}
                  </td>
                ))}
            </tr>
          )}
          <tr>
            <td className={cltd}> {infData.nom} </td>
            {infData.roulement &&
              infData.roulement.map((d, i) => (
                <td className={cltd} key={i} width={20}>
                  {editidingInf ? (
                    <select
                      value={d}
                      onChange={(e) => {
                        onUpdateRoulement(updateID, e.target.value, i);
                      }}
                    >
                      <option value="-">-</option>
                      <option value="J">J</option>
                      <option value="N">N</option>
                      <option value="R">R</option>
                    </select>
                  ) : (
                    d
                  )}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RoulGen({ loadData }) {
  const [listInfirmiers, setListInfirmiers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const infs = await GetAllItemsFromTable(TABLE_NAME.INFIRMIERS);
    setListInfirmiers(infs);
    setLoading(false);
  }

  return (
    <div>
      <ProgressView show={loading} />
      {listInfirmiers.map((infData, i) => (
        <Roul
          infData={infData}
          hideTopRows={i === 0 ? false : true}
          /* editidingInf={props.editidingInf}
          updateID={props.updateID} */
          loadData={loadData}
        />
      ))}
    </div>
  );
}

function FormNewInf(props) {
  const [loading, setLoading] = useState(false);
  const [infData, setInfData] = useState([]);

  console.log(props);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, props.updateID);
    inf = inf.length === 1 ? inf[0] : [];

    setInfData(inf);
    console.log(inf.roulement);

    setLoading(false);
  }

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
            <ProgressView show={loading} />

            <Roul
              infData={infData}
              editidingInf={props.editidingInf}
              updateID={props.updateID}
              loadData={loadData}
            />

            {/* <Roulement
              editidingInf={props.editidingInf}
              showDates
              showData
              updateID={props.updateID}
            /> */}
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
  const [listInfirmiersFiltered, setListInfirmersFiltered] = useState([]);

  const [infNom, setInfNom] = useState("Gracia Liwena");
  const [infPhone, setInfPhone] = useState("0892125047");
  const [infGrade, setInfGrade] = useState("IT");
  const [infTeam, setInfTeam] = useState("D");
  const [selectedSection, setSelectedSection] = useState("inflist");
  const [updateID, setUpdateID] = useState(-1);
  const [editidingInf, setEditidingInf] = useState(false);
  const [loading, setLoading] = useState(true);

  const selClass = "text-sky-500 border-b-sky-500 bg-sky-500 text-white";

  useEffect(() => {
    loadInfList();
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

    if (q.replaceAll(" ", "") === "") {
      setListInfirmersFiltered(listInfirmiers);
      return;
    }

    console.log(listInfirmiers);

    const filtered = listInfirmiers.filter((inf, i) =>
      inf.nom.toLowerCase().includes(q.toLowerCase())
    );

    setListInfirmersFiltered(filtered);
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
    loadInfList();
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
    loadInfList();
  }

  async function onDelInf(e) {
    e.preventDefault();

    if (confirm("Are you sure you wanna delete this record?")) {
      await DeleteItem(TABLE_NAME.INFIRMIERS, updateID);
      loadInfList();
    }
  }

  async function loadInfList() {
    setLoading(true);

    setListInfirmers([]);
    setListInfirmersFiltered([]);

    const list = await GetAllItemsFromTable(TABLE_NAME.INFIRMIERS);

    setListInfirmers(list);
    setListInfirmersFiltered(list);

    setSelectedSection("inflist");
    setLoading(false);
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

      <ProgressView show={loading} />

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
                  {listInfirmiersFiltered.map((inf, idx) => (
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
          {/* <RoulementGeneral
            listInfirmiers={listInfirmiers}
            updateID={updateID}
          /> */}
          <RoulGen listInfirmiers={listInfirmiers} updateID={updateID} />
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
