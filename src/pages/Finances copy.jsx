import React, { useEffect, useState } from "react";
import { StyleButton, StyleInputText } from "../Styles";
import PageHeader from "../comps/PageHeader";
import SectionMenu from "../comps/SectionMenu";
import { Tr } from "../comps/Table";
import { Td } from "../comps/Table";
import {
  AddNewItemToTable,
  EmptyTable,
  GetAllItemsFromTable,
  TABLE_NAME,
} from "../db/sb";

const HEADERS_TABLEAU_GEN = [
  "DATE",
  "QUITENCIER",
  "PHARMACIE",
  "TQ",
  "T PHAR",
  "D CENTRE",
  "D DIVERS",
];
const HEADERS_INS_DEP = ["Montant (CDF)", "Date", "Designation", "ID"];

const SECTIONS = {
  TABLEAU_GENERAL: { title: "Tableau Gen.", name: "tbgen" },
  INSERTION_DEP: { title: "Inserer Dep.", name: "insdep" },
  LISTE_DEPENSE: { title: "Liste des depenses", name: "lsdep" },
};

const selClass = "text-sky-500 border-b-sky-500 bg-sky-500 text-white";

export default function Finances() {
  const [selectedSection, setSelectedSection] = useState(
    SECTIONS.TABLEAU_GENERAL.name
  );
  const [inputs, setInputs] = useState({});
  const [deps, setDeps] = useState([]);

  useEffect(() => {
    loadAllDeps();
  }, []);

  function handleChange(e) {
    e.preventDefault();
    const n = e.target.name;
    const v = e.target.value;

    setInputs((inputs) => ({ ...inputs, [n]: v }));

    console.log(n, v, inputs);
  }

  function onChangeSection(e) {
    e.preventDefault();
    const secname = e.target.name;

    setSelectedSection(secname);
    console.log(secname);

    if (secname == SECTIONS.LISTE_DEPENSE.name) loadAllDeps();
  }

  async function onInsertDep(e) {
    e.preventDefault();

    let dep = { ...inputs };

    await AddNewItemToTable(dep, TABLE_NAME.DEPENSES);
    resetForm();
  }

  function resetForm() {
    setInputs({});
    setSelectedSection(SECTIONS.LISTE_DEPENSE.name);
    loadAllDeps();
  }

  async function loadAllDeps() {
    console.warn("loading all depenses ...");
    const deps = await GetAllItemsFromTable(TABLE_NAME.DEPENSES);
    setDeps(deps);
  }

  function onRestDepTable(e) {
    e.preventDefault();
    if (confirm("Are you sure?")) {
      EmptyTable(TABLE_PREFIX.DEPENSES);
      loadAllDeps();
    }
  }

  return (
    <div className="p-8">
      <PageHeader title="Finances" sub="Finances generales du centre" />

      <SectionMenu
        sectionsData={SECTIONS}
        onChangeSection={onChangeSection}
        selectedSection={selectedSection}
      />

      {selectedSection === SECTIONS.TABLEAU_GENERAL.name && (
        <div className="tb-gen">
          <table>
            <Tr data={HEADERS_TABLEAU_GEN} />
          </table>
        </div>
      )}

      {selectedSection === SECTIONS.INSERTION_DEP.name && (
        <div className="new-dep">
          <form>
            <label>
              <div>Description de la depense</div>
              <input
                type="text"
                onChange={handleChange}
                value={inputs.desc || ""}
                className={StyleInputText}
                name="desc"
                placeholder="Descripton dep ..."
              />
            </label>

            <label>
              <div>Montant ( FC )</div>
              <input
                type="number"
                onChange={handleChange}
                value={inputs.amount || ""}
                name="amount"
                className={StyleInputText}
                placeholder="ex: 75000"
              />
            </label>

            <label>
              <div>Date</div>
              <input
                type="date"
                onChange={handleChange}
                value={inputs.date || new Date()}
                name="date"
                className={StyleInputText}
              />
            </label>

            <div>
              {inputs.desc && inputs.amount && inputs.date && (
                <button
                  className={StyleButton("green-500")}
                  onClick={onInsertDep}
                >
                  SAUVEGARDER
                </button>
              )}
              <button
                className={StyleButton("gray-500")}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSection(SECTIONS.TABLEAU_GENERAL.name);
                }}
              >
                ANNULER
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedSection === SECTIONS.LISTE_DEPENSE.name && (
        <div className="lsdep">
          <div>
            <button className={StyleButton("red-500")} onClick={onRestDepTable}>
              RESET
            </button>
          </div>
          <div>
            <table>
              <Tr data={HEADERS_INS_DEP} />
              {deps &&
                deps.map((it, i) => {
                  return (
                    <tr key={i}>
                      <Td data={it.amount} />
                      <Td data={it.created} />
                      <Td data={it.desc} />
                      <Td data={it.id} />
                    </tr>
                  );
                })}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
