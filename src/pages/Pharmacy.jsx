import React, { useEffect, useState } from "react";

import {
  TABLE_NAME,
  AddNewItemToTable,
  GetAllItemsFromTable,
  RemoveAllItemsFromTable,
  UpdateItem,
  DeleteItem,
} from "../db/sb";

import {
  StyleButton,
  StyleButtonSmall,
  StyleInputSelect,
  StyleInputText,
} from "../Styles";
import PageHeader from "../comps/PageHeader";
import SectionMenu from "../comps/SectionMenu";
import { Td, Tr } from "../comps/Table";
import ProgressView from "../comps/ProgressView";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";

const SECTIONS = {
  MEDS_TABLE: { title: "Liste produits", name: "lsmeds" },
  SELL_MEDL: { title: "Sortie produit", name: "sellmed" },
  FORM_ADD_MED: { title: "Add New Med", name: "formnewmed" },
  SELLS_RECORD: { title: "Liste Sortie Produits", name: "lsprodsells" },
};

const STOCK_CODES = {
  ALL: "st_all",
  ZERO: "st_zero",
  LOW: "st_low",
  OK: "st_ok",
};

const STOCK_LOW_THRESHHOLD = 10;
const BG_STOCK_LOW = "bg-yellow-600";
const BG_STOCK_ZERO = "bg-red-600";
const STOCK_FILTER_LABELS = [
  { label: "Tous les produits", code: STOCK_CODES.ALL },
  { label: "Stock Vide", code: STOCK_CODES.ZERO },
  { label: "Stock Faible", code: STOCK_CODES.LOW },
  { label: "Stock Ok", code: STOCK_CODES.OK },
];

function MedItem({ med, editMed, deleteMed, showMedToSell }) {
  //const medData = JSON.parse(med);

  return (
    <tr
      className={` ${
        med.medAmount <= STOCK_LOW_THRESHHOLD && med.medAmount >= 1
          ? BG_STOCK_LOW + ` text-white font-bold `
          : ""
      } ${
        med.medAmount < 1 ? BG_STOCK_ZERO + " text-white font-bold " : ""
      }  border border-black cursor-pointer hover:bg-black hover:text-white`}
    >
      <Td data={med.id} />
      <Td data={med.medName} />
      <Td data={med.medType} />
      <Td data={med.medAmount} />
      <Td data={med.medPrice} />
      <Td data={med.medSoldBy} />
      <td className="border-collapse border border-slate-500">
        <button
          className={StyleButtonSmall("green-500")}
          onClick={(e) => editMed(med)}
        >
          UPDATE
        </button>
        <button
          className={StyleButtonSmall("red-500")}
          onClick={(e) => deleteMed(med)}
        >
          DELETE
        </button>
        <button
          className={StyleButtonSmall()}
          onClick={(e) => showMedToSell(med)}
        >
          SORTIE
        </button>
      </td>
    </tr>
  );
}

export default function Pharmacy() {
  const [selectedSection, setSelectedSection] = useState(
    SECTIONS.MEDS_TABLE.name
  );

  const [medName, setMedName] = useState("");
  const [medAmount, setMedAmount] = useState(0);
  const [medType, setMedType] = useState("comprime");
  const [medPrice, setMedPrice] = useState(0);
  const [medSoldBy, setMedSoldBy] = useState("");

  const map = new Map();
  map.set("medName", setMedName);
  map.set("medAmount", setMedAmount);
  map.set("medType", setMedType);
  map.set("medPrice", setMedPrice);
  map.set("medSoldBy", setMedSoldBy);

  const [meds, setMeds] = useState([]);
  const [medsFiltered, setMedsFiltered] = useState([]);
  const [curUpdateID, setCurUpdateID] = useState(0);
  const [updatingMed, setUpdatingMed] = useState(false);

  const [q, setQ] = useState("");
  const [med2sell, setMed2sell] = useState({});
  const [qty2Sell, setQty2Sell] = useState(0);
  const [isCash, setIsCash] = useState(true);

  const [loading, setLoading] = useState(true);
  const [selectedPatientData, setSelectedPatientData] = useState();

  const updateMed = async (e) => {
    let newMed = {};

    newMed.id = curUpdateID;
    newMed.medName = medName;
    newMed.medAmount = medAmount;
    newMed.medType = medType;
    newMed.medPrice = medPrice;
    newMed.medSoldBy = medSoldBy;

    console.log(TABLE_NAME.MEDS, newMed.id, newMed);
    UpdateItem(TABLE_NAME.MEDS, newMed.id, newMed);
    //return;

    setMeds(await GetAllItemsFromTable(TABLE_NAME.MEDS));
    setSelectedSection(SECTIONS.MEDS_TABLE.name);
    clearNewMedData();

    console.warn(
      "should update sellrec to record the sell rec for current med!!!"
    );
  };

  function showMedToSell(med2sell) {
    setMed2sell(med2sell);
    setSelectedSection(SECTIONS.SELL_MEDL.name);
  }

  const editMed = (med) => {
    setUpdatingMed(true);
    setSelectedSection(SECTIONS.FORM_ADD_MED.name);

    setCurUpdateID(med.id);
    setMedName(med.medName);
    setMedAmount(med.medAmount);
    setMedPrice(med.medPrice);
    setMedSoldBy(med.medSoldBy);
    setMedType(med.medType);
  };

  const deleteMed = async (med) => {
    //console.log(med)
    const yes = window.confirm("Are you sure? No undo");
    if (yes) {
      DeleteItem(TABLE_NAME.MEDS, med.id);

      let meds = await GetAllItemsFromTable(TABLE_NAME.MEDS);
      setMeds([...meds]);
    }
  };

  const [medSellsRecs, setMedSellsRecs] = useState([]);
  const [medSellsRecsFiltered, setMedSellsRecsFiltered] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientsFiltered, setPatientsFiltered] = useState([]);

  useEffect(() => {
    const med = {
      medName: "",
      medCount: "",
      medType: "",
      medPrice: "",
      medSoldBy: "",
    };

    //setNewMed(med);

    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setMeds([]);
      setMedsFiltered([]);
      setPatients([]);
      setPatientsFiltered([]);

      setMedSellsRecs([]);
      setMedSellsRecsFiltered([]);
      setLoading(true);
      const meds = await GetAllItemsFromTable(TABLE_NAME.MEDS);
      const sellsrecs = await GetAllItemsFromTable(TABLE_NAME.MED_SELLS_REC);
      const patients = await GetAllItemsFromTable(TABLE_NAME.PATIENTS);

      setPatients(patients);
      setPatientsFiltered(Array.from(patients));
      setMeds(meds);
      setMedsFiltered(meds);
      setMedSellsRecs(sellsrecs);
      setMedSellsRecsFiltered(sellsrecs);

      setLoading(false);
    } catch (e) {
      console.log(e);
      alert(e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  const onInputChange = (e) => {
    const name = e.target.name;
    const val = e.target.value;

    for (let [key, func] of map) {
      if (key === name) func(val);
    }
  };

  const removeAllMeds = async (e) => {
    e.preventDefault();

    const yes = window.confirm("Are you sure?");

    if (yes) {
      RemoveAllItemsFromTable();
      setMeds(await GetAllItemsFromTable(TABLE_NAME.MEDS));
    }
  };

  const addNewMed = async () => {
    let newMed = {};

    newMed.medName = medName;
    newMed.medAmount = medAmount;
    newMed.medType = medType;
    newMed.medPrice = medPrice;
    newMed.medSoldBy = medSoldBy;

    AddNewItemToTable(newMed);
    setMeds(await GetAllItemsFromTable(TABLE_NAME.MEDS));
    setSelectedSection(SECTIONS.FORM_ADD_MED.name);

    clearNewMedData();
  };

  async function onSearch(e) {
    const q = e.target.value;
    setQ(q);

    if (q === "") {
      loadAllData();
      return;
    }

    let filter = meds.filter(
      (med) =>
        med.medName.toLowerCase().includes(q.toLowerCase()) ||
        med.medType.toLowerCase().includes(q.toLowerCase())
    );

    setMedsFiltered(filter);
  }

  function clearNewMedData() {
    for (let [key, func] of map) {
      func("");
    }
  }

  function onChangeSection(e) {
    e.preventDefault();
    setSelectedSection(e.target.name);
  }

  function onChangeQty2Sell(e) {
    e.preventDefault();
    const qty2sell = e.target.value;
    setQty2Sell(qty2sell);
  }

  const [curStockCode, setCurStockCode] = useState(STOCK_CODES.ALL);
  const [curStockFilterLabel, setCurStockFilterLabel] = useState(
    STOCK_FILTER_LABELS[0].label
  );

  function onShowFilter(stockCode, stockFilterLabel) {
    setCurStockCode(stockCode);
    setCurStockFilterLabel(stockFilterLabel);

    let filtered = meds;

    switch (stockCode) {
      case STOCK_CODES.ALL:
        filtered = meds;
        break;

      case STOCK_CODES.ZERO:
        filtered = meds.filter((m, i) => m.medAmount === 0);
        break;

      case STOCK_CODES.LOW:
        filtered = meds.filter(
          (m, i) => m.medAmount <= STOCK_LOW_THRESHHOLD && m.medAmount > 0
        );
        break;

      case STOCK_CODES.OK:
        filtered = meds.filter((m, i) => m.medAmount > STOCK_LOW_THRESHHOLD);
        break;
    }

    setMedsFiltered(Array.from(filtered));
  }

  const [qpat, setqpat] = useState("");
  function onSearchPatient(e) {
    const v = e.target.value;
    setqpat(v);

    if (v.replaceAll(" ", "") === "") {
      setPatientsFiltered(patients);
      return;
    }

    let filtered = patients.filter((p, i) =>
      p.nom.toLowerCase().includes(qpat.toLocaleLowerCase())
    );

    setPatientsFiltered(filtered);

    console.log(e);
  }

  function onSetSelectedPatientData(data) {
    const patientData = JSON.parse(data);

    setSelectedPatientData(data);
    setqpat(patientData.nom);
  }

  function onSellMed(e) {
    e.preventDefault();

    /* if (selectedPatientData === undefined) {
      alert("Error, choisissez dabord un patient avant de vendre le produit!");
      console.log("selectedPatientData === undefined, selecet a patient first");
      return;
    } */

    let sellrec = {
      prodID: med2sell.id,
      last_update: new Date(),
      oldstock: med2sell.medAmount,
    };

    const stockRest = med2sell.medAmount - qty2Sell;
    sellrec.newstock = stockRest;
    sellrec.qty = qty2Sell;
    med2sell.medAmount = stockRest;

    /*  let patientData = JSON.parse(selectedPatientData);

    let paymentRecord = {
      foreign_table: TABLE_NAME.MEDS,
      amount: med2sell.medPrice * qty2Sell,
      description: "",
      cash: isCash,
      payed: isCash,
      payed_at: isCash ? new Date().toISOString() : null,
      foreign_key: patientData.id,
      data: selectedPatientData,
      type: "PHA",
    }; */

    UpdateItem(
      TABLE_NAME.MEDS,
      med2sell.id,
      med2sell,
      (res) => {
        alert("Med sold!\n" + res);

        AddNewItemToTable(sellrec, TABLE_NAME.MED_SELLS_REC, (d) => {
          console.log("on sell rec ", d);

          /* AddNewItemToTable(
            paymentRecord,
            TABLE_NAME.PAYMENTS,
            (res) => {
              console.log("Payment rec added succes\n", res);
              loadAllData();
              setSelectedSection(SECTIONS.MEDS_TABLE.name);
            },
            (e) => {
              console.log(e);
              alert("Add error\n" + e);
            }
          ); */

          alert("Process success!");
          loadAllData();
        });
      },
      (e) => {
        alert("Error selling med.\n" + e);
        console.log(e);
      }
    );
  }

  return (
    <div className="p-8">
      <PageHeader title="Pharmacie" sub="Liste de tous les medicaments" />

      <SectionMenu
        sectionsData={SECTIONS}
        selectedSection={selectedSection}
        onChangeSection={onChangeSection}
      />

      {selectedSection === SECTIONS.MEDS_TABLE.name && (
        <section>
          {/* { meds && meds.length > 0 ? */}

          <div className="table-meds">
            <div className="mb-4 flex flex-row justify-center">
              <button
                className={`${StyleButton("green-500")} ml-0 `}
                onClick={(e) => {
                  setSelectedSection(SECTIONS.FORM_ADD_MED.name);
                  setUpdatingMed(false);
                }}
              >
                Add New Med
              </button>
              <button
                className={StyleButton("red-500")}
                onClick={removeAllMeds}
              >
                Remove All Meds
              </button>
            </div>

            <input
              type="search"
              className={`${StyleInputText} mb-4 `}
              value={q}
              onChange={onSearch}
              placeholder="search ..."
            />

            <div className="md:flex gap-2 mb-4 flex-wrap">
              <p className="w-full">AFFICHER</p>

              {STOCK_FILTER_LABELS.map((st, i) => (
                <div>
                  <span
                    onClick={(e) => onShowFilter(st.code, st.label)}
                    className={` inline-block my-2 md:my-0 w-full ${
                      st.code === curStockCode ? "text-white bg-sky-500" : ""
                    } cursor-pointer outline rounded-md p-2 outline-neutral-300 hover:outline-sky-500 outline-[1px]`}
                  >
                    <input
                      checked={st.code === curStockCode}
                      type="radio"
                      name="stock"
                      code={st.code}
                      onChange={(e) =>
                        onShowFilter(e.target.getAttribute("code"), st.label)
                      }
                    />
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            <ProgressView show={loading} />

            <table className="border-collapse border border-slate-500  ">
              <tr>
                <td
                  colSpan={7}
                  align="center"
                  className="border-collapse border border-slate-500"
                >
                  <div>
                    TABLEAU DES MEDICAMENTS -{" "}
                    <span className=" p-1 rounded-md bg-black text-white text-xs font-bold">
                      {curStockFilterLabel} {medsFiltered.length}
                    </span>
                  </div>
                </td>
              </tr>

              <Tr
                data={[
                  "ID",
                  "Name",
                  "Type",
                  "Stock",
                  "Price (CDF)",
                  "Sold by",
                  "Options",
                ]}
              />

              {medsFiltered.map((it, idx) => (
                <MedItem
                  showMedToSell={showMedToSell}
                  key={it.id}
                  med={it}
                  editMed={editMed}
                  deleteMed={deleteMed}
                />
              ))}
            </table>
          </div>
        </section>
      )}

      {selectedSection === SECTIONS.SELL_MEDL.name && (
        <section className="sell-med">
          <table>
            <tbody>
              {/*  <tr>
                <td
                  valign="top"
                  align="right"
                  className={`text-sm text-neutral-600 font-bold `}
                >
                  Patient:
                </td>
                <td>
                  <div className="space-y-4 flex-col fex">
                    {false && (
                      <input
                        type="search"
                        className={StyleInputText}
                        value={qpat}
                        onChange={onSearchPatient}
                      />
                    )}
                    <select
                      className="w-fit p-2 outline-sky-400"
                      onClick={(e) => onSetSelectedPatientData(e.target.value)}
                    >
                      {patientsFiltered.map((p, i) => (
                        <option value={JSON.stringify(p)}>{p.nom}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr> */}
              {[
                "Nom du produit",
                "Quantite a sortir",
                "Stock Restant",
                "P.U/$",
                "Total",
              ].map((r, i) => (
                <tr
                  className={`
                
                ${
                  i === 2 &&
                  med2sell.medAmount - qty2Sell > 10 &&
                  "bg-green-300"
                }
                

                 ${
                   i === 2 &&
                   med2sell.medAmount - qty2Sell <= 10 &&
                   med2sell.medAmount - qty2Sell > 0 &&
                   "bg-yellow-300"
                 }

                  ${
                    i === 2 &&
                    med2sell.medAmount - qty2Sell <= 0 &&
                    "bg-red-500"
                  }


                `}
                  key={i}
                >
                  <td
                    align="right"
                    className={`text-sm text-neutral-600 font-bold `}
                  >
                    {r} : {"  "}
                  </td>
                  {i === 0 && <td className="font-bold">{med2sell.medName}</td>}
                  {i === 1 && (
                    <td>
                      <input
                        type="number"
                        className={StyleInputSelect}
                        name="qty"
                        value={qty2Sell}
                        onChange={onChangeQty2Sell}
                        min={1}
                        max={med2sell.medAmount}
                      />
                    </td>
                  )}
                  {i === 2 && (
                    <td>
                      {FormatNumberWithCommas(med2sell.medAmount - qty2Sell)}
                    </td>
                  )}
                  {i === 3 && (
                    <td>
                      {FormatNumberWithCommas(med2sell.medPrice)}
                      {" FC"}
                      {"/"}
                      {med2sell.medSoldBy}
                    </td>
                  )}
                  {i === 4 && (
                    <td className=" font-bold ">
                      {FormatNumberWithCommas(med2sell.medPrice * qty2Sell)}
                      {" FC"}
                    </td>
                  )}
                </tr>
              ))}
              <tr>
                <td align="right">
                  <input
                    type="checkbox"
                    checked={isCash}
                    onChange={(e) => setIsCash(e.target.checked)}
                  />
                </td>
                <td>
                  CASH{" "}
                  {isCash ? (
                    <span className="bg-green-600 font-bold p-1 rounded-full text-sm text-white px-2">
                      CASH: Paid immediatly
                    </span>
                  ) : (
                    <span className="bg-red-500 font-bold p-1 rounded-full text-sm text-white px-2">
                      CREDIT: Will be paid later
                    </span>
                  )}{" "}
                </td>
              </tr>
              <tr>
                <td align="right">
                  {" "}
                  {qty2Sell > 0 && patientsFiltered.length > 0 && (
                    <button
                      className={StyleButton("green-500")}
                      onClick={onSellMed}
                    >
                      SELL
                    </button>
                  )}
                </td>
                <td align="center" colSpan={2}>
                  <div className="flex">
                    <button
                      className={StyleButton("gray-500")}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSection(SECTIONS.MEDS_TABLE.name);
                      }}
                    >
                      {" "}
                      CANCEL
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {selectedSection === SECTIONS.FORM_ADD_MED.name && (
        <section className="add-new-med-form ">
          <h4 className="text-3xl text-sky-500">
            {updatingMed ? `Updating Med " ${curUpdateID} "` : "Add New Med"}{" "}
          </h4>
          <div>
            <div>Nom du produit</div>
            <input
              type="text"
              placeholder="Ex: Quinine ..."
              className={StyleInputText}
              name="medName"
              value={medName}
              onChange={onInputChange}
            />
          </div>
          <div>
            <div>Stock</div>
            <input
              type="number"
              className={StyleInputText}
              name="medAmount"
              value={medAmount}
              onChange={onInputChange}
            />
          </div>
          <div>
            <div>Type</div>
            <select
              className={StyleInputSelect}
              value={medType}
              onChange={onInputChange}
              name="medType"
            >
              <option value="comprime">Comprime</option>
              <option value="cyro">Cyro</option>
              <option value="boite">Boite</option>
            </select>
          </div>

          <div>Prix (CDF)</div>
          <input
            type="number"
            name="medPrice"
            className={StyleInputText}
            value={medPrice}
            onChange={onInputChange}
          />
          <div>Vendu par</div>
          <select
            value={medSoldBy}
            className={StyleInputSelect}
            name="medSoldBy"
            onChange={onInputChange}
          >
            <option value="comprime">Comprime</option>
            <option value="cyro">Cyro</option>
            <option value="boite">Boite</option>
          </select>
          <div>
            {!updatingMed && (
              <button
                onClick={addNewMed}
                className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-sky-500 hover:text-white text-sky-500  border border-sky-500 `}
              >
                Add New Med
              </button>
            )}
            {updatingMed && (
              <button onClick={updateMed} className={StyleButton("green-500")}>
                Update
              </button>
            )}
            <button
              onClick={(e) => setSelectedSection(SECTIONS.MEDS_TABLE.name)}
              className={StyleButton("gray-500")}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {selectedSection === SECTIONS.SELLS_RECORD.name && (
        <section className="ls-prod-sells">
          <table className="w-full">
            <thead>
              <tr>
                {[
                  "No",
                  "Produit",
                  "Ancien Stock",
                  "Qte Sortie",
                  "Stock Restant",
                  "Date",
                ].map((it, i) => (
                  <td
                    key={i}
                    className="p1 border-b border-l border-neutral-400"
                  >
                    {it}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {medSellsRecsFiltered.map((msr, i) => (
                <tr key={i}>
                  <td className="p1 border-b border-l border-neutral-400">
                    {i + 1}
                  </td>
                  <td className="p1 border-b border-l border-neutral-400">
                    {(meds.find((it, i) => it.id === msr.prodID) &&
                      meds.find((it, i) => it.id === msr.prodID).medName) || (
                      <span className="text-sm font-bold bg-red-500 text-white rounded-md p-1">
                        Med Deleted
                      </span>
                    )}
                  </td>

                  <td className="p1 border-b border-l border-neutral-400">
                    {msr.oldstock}
                  </td>
                  <td className="p1 border-b border-l border-neutral-400">
                    {msr.qty}
                  </td>
                  <td className="p1 border-b border-l border-neutral-400">
                    {msr.newstock}
                  </td>

                  <td className="p1 border-b border-l border-neutral-400">
                    {FormatDate(new Date(msr.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
