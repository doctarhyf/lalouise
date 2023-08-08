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

const SECTIONS = {
  MEDS_TABLE: { title: "Liste produits", name: "lsmeds" },
  SELL_MEDL: { title: "Sortie produit", name: "sellmed" },
  FORM_ADD_MED: { title: "Add New Med", name: "formnewmed" },
  SELLS_RECORD: { title: "Liste Sortie Produits", name: "lsprodsells" },
};

function MedItem({ med, editMed, deleteMed, showMedToSell }) {
  //const medData = JSON.parse(med);

  return (
    <tr
      className={` ${
        med.medAmount < 10 && med.medAmount > 1
          ? "bg-yellow-600 text-white font-bold "
          : ""
      } ${
        med.medAmount < 1 ? "bg-red-500 text-white font-bold " : ""
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
  const [curUpdateID, setCurUpdateID] = useState(0);
  const [updatingMed, setUpdatingMed] = useState(false);

  const [q, setQ] = useState("");
  const [med2sell, setMed2sell] = useState({});
  const [qty2Sell, setQty2Sell] = useState(0);

  const [loading, setLoading] = useState(true);

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

  function sellMed(e) {
    let sellrec = {
      prodID: med2sell.id,
      date: new Date(),
      oldstock: med2sell.medAmount,
    };

    e.preventDefault();
    console.log("b4 upd ", med2sell);
    const stockRest = med2sell.medAmount - qty2Sell;
    console.log("stockRest", stockRest);

    sellrec.newstock = stockRest;

    med2sell.medAmount = stockRest;
    console.warn("afta upd", med2sell);

    UpdateItem(TABLE_NAME.MEDS, med2sell.id, med2sell);
    AddNewItemToTable(sellrec, TABLE_NAME.MED_SELLS_REC);
    setSelectedSection(SECTIONS.MEDS_TABLE.name);

    console.log(sellrec);
  }

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

  useEffect(() => {
    const med = {
      medName: "",
      medCount: "",
      medType: "",
      medPrice: "",
      medSoldBy: "",
    };

    //setNewMed(med);
    async function loadAllMeds() {
      setLoading(true);
      setMeds(await GetAllItemsFromTable(TABLE_NAME.MEDS));
      setLoading(false);
    }

    loadAllMeds();
  }, []);

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

    let filter = meds.filter(
      (med) =>
        med.medName.toLowerCase().includes(q.toLowerCase()) ||
        med.medType.toLowerCase().includes(q.toLowerCase())
    );

    setMeds(filter);
    if (q === "") {
      setMeds(await GetAllItemsFromTable(TABLE_NAME.MEDS));
    }
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

  return (
    <div className="p-8">
      <PageHeader title="Pharmacie" sub="Liste de tous les medicaments" />

      <SectionMenu
        sectionsData={SECTIONS}
        selectedSection={selectedSection}
        onChangeSection={onChangeSection}
      />

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

            <ProgressView show={loading} />

            <table className="border-collapse border border-slate-500  ">
              <tr>
                <td
                  colSpan={7}
                  align="center"
                  className="border-collapse border border-slate-500"
                >
                  <div>TABLEAU DES MEDICAMENTS</div>
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

              {meds.map((it, idx) => (
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
            <tr>
              <Td data={"Produit"} />
              <Td data={med2sell.medName} />
            </tr>
            <tr>
              <Td data={"Prix (CDF)"} />
              <Td data={med2sell.medPrice} />
            </tr>
            <tr>
              <Td data={"Sold by"} />
              <Td data={med2sell.medSoldBy} />
            </tr>
            <tr>
              <Td data={"Stock"} />
              <Td data={med2sell.medAmount} />
            </tr>
            <tr
              className={` ${
                med2sell.medAmount - qty2Sell === 0
                  ? "bg-red-500 text-white font-bold text-sm"
                  : ""
              }  ${
                med2sell.medAmount - qty2Sell <= 5 &&
                med2sell.medAmount - qty2Sell > 0
                  ? "bg-yellow-600 text-white font-bold text-sm"
                  : ""
              }
                             ${
                               med2sell.medAmount - qty2Sell > 5
                                 ? "bg-green-600 text-white font-bold text-sm"
                                 : ""
                             }`}
            >
              <Td data={"Stock Restant"} />
              <Td
                className={`${
                  med2sell.medAmount - qty2Sell < 1
                    ? " bg-red-500 font-bold text-white "
                    : ""
                }`}
                data={med2sell.medAmount - qty2Sell}
              />
            </tr>
            <tr>
              <Td data={"Quantite a vendre"} />
              <Td
                data={
                  <input
                    type="number"
                    className={StyleInputSelect}
                    name="qty"
                    value={qty2Sell}
                    onChange={onChangeQty2Sell}
                    min={1}
                    max={med2sell.medAmount}
                  />
                }
              />
            </tr>
            <tr>
              <td colSpan={2}>
                <div className="flex">
                  {med2sell.medAmount - qty2Sell > -1 && (
                    <button
                      className={StyleButton("green-500")}
                      onClick={sellMed}
                    >
                      SELL
                    </button>
                  )}
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
          </table>
        </section>
      )}

      {selectedSection === SECTIONS.SELLS_RECORD.name && (
        <section className="ls-prod-sells">
          Quinine 12 boites sortie le 22/06/23 stock: 90
        </section>
      )}
    </div>
  );
}
