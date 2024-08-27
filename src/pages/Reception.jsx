import { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import ProgressView from "../comps/ProgressView";
import { CATEGORIES_PATIENTS, DEPARTEMENTS } from "../helpers/flow";
import IconButtonsCont from "../comps/IconButtonsCont";
import EmptyList from "../comps/EmptyList";
import { StyleButton, StyleInputText } from "../Styles";
import {
  AddNewItemToTable,
  DeleteItem,
  GetAllItemsFromTable,
  TABLE_NAME,
  UpdateItem,
} from "../db/sb";
import PatientItem from "../comps/PatientItem";
import FormPatient from "../comps/FormPatient";

const SECTIONS = {
  LIST_PATIENTS: "lspat",
  NEW_PAT: "newpat",
  VIEW_PAT: "viewpat",
};

export default function Reception({ user }) {
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [list, setlist] = useState([]);
  const [listPatients, setListPatients] = useState([]);
  const [listPatientsFiltered, setListPatientsFiltered] = useState([]);
  const [selectedSection, setSelectedSection] = useState(
    SECTIONS.LIST_PATIENTS
  );
  const [patsCount, setPatsCount] = useState(0);
  const [selectedPatientsCategorieData, setSelectedPatientsCategorieData] =
    useState(CATEGORIES_PATIENTS[0]);
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  const [showSortis, setShowSortis] = useState(false);

  useEffect(() => {
    loadPatList();
  }, []);

  useEffect(() => {
    initData(list, showSortis);
  }, [showSortis]);

  function initData(list, showSortis) {
    if (showSortis) {
      list = list.filter((p) => p.exit !== null);
    } else {
      list = list.filter((p) => p.exit === null);
    }

    setQ("");
    setListPatients(list);
    setListPatientsFiltered(Array.from(list));
    setSelectedSection(SECTIONS.LIST_PATIENTS);
  }

  async function loadPatList() {
    setLoading(true);
    setlist([]);
    setListPatients([]);
    setListPatients([]);

    let list = await GetAllItemsFromTable(TABLE_NAME.PATIENTS);
    setlist(list);
    initData(list, showSortis);
    setLoading(false);
  }

  function onChangeSection(e) {
    const secName = e.target.name;
    setSelectedSection(secName);

    if (secName === "newpat") {
      setSelectedPatient(undefined);
    }

    console.log(secName);
  }

  function onRadioButtonSelected(dt) {
    setSelectedPatientsCategorieData(dt);

    const { title, sub, code } = dt;

    if (code === "ALL") {
      setListPatientsFiltered([...listPatients]);
      return;
    }

    const filtered = listPatients.filter((p, i) => p.dep === code);
    setListPatientsFiltered(filtered);
  }

  function onSearchPat(e) {
    const q = e.target.value;
    setQ(q);

    if (q.replace(" ", "") === "") {
      setListPatientsFiltered(listPatients);
      return;
    }

    const filtered = listPatients.filter((p, i) =>
      p.nom.toLowerCase().includes(q.toLowerCase() || p.phone.includes(q))
    );

    setListPatientsFiltered(filtered);
  }

  function onViewPatient(pat) {
    console.log(pat);
    setSelectedPatient(pat);
    setSelectedSection("viewpat");
  }

  function onCancel(e) {
    e.preventDefault();
    setSelectedSection("lspat");
  }

  function onUpdatePat(pat) {
    // console.log("updating id : " + id);

    const yes = confirm("Are you sure you want to update?");

    if (yes) {
      setLoading(true);
      UpdateItem(
        TABLE_NAME.PATIENTS,
        pat.id,
        pat,
        (d) => {
          loadPatList();
          setLoading(false);
        },
        (e) => {
          alert("Error\n", e);
          console.log(e);
          setLoading(false);
        }
      );

      console.log(pat);
    }
  }

  function onDelPat(pat) {
    const { nom, id } = pat;
    if (confirm(`Are you sure you want to delete " ${nom} "?`)) {
      DeleteItem(TABLE_NAME.PATIENTS, id, (r) => {
        console.log("del pat", r);
        if (r === null) {
          alert("Le patient a ete supprime avec succes!");
        }
        loadPatList();
        setSelectedSection(SECTIONS.LIST_PATIENTS);
      });
    }
  }

  function onSortieHopital(patientData, exitDateTime) {
    setLoading(true);

    console.log(exitDateTime);
    const { id: updateID } = patientData;
    const { date, time } = exitDateTime;

    if (date === undefined || time === undefined) {
      alert(`Veuillez bien selectioner la date et l'heure de sortie`);
      return;
    }

    if (
      !window.confirm(
        `Confirmez-vous que le patient " ${patientData.nom} " est sorti le " ${date} a ${time} "?`
      )
    ) {
    } else {
      const updateData = {
        exit_hospital_at: new Date().toISOString(),
        exit: `${date}|${time}`,
      };

      UpdateItem(
        TABLE_NAME.PATIENTS,
        updateID,
        updateData,
        (res) => {
          setLoading(false);
          alert("Update Success!");
          console.log(res);
        },
        (e) => {
          setLoading(false);
          alert("Error\n" + e);
          console.log(e);
        }
      );
    }
  }

  async function onSaveNewPat(newpat) {
    // e.preventDefault();

    if (newpat.nom === "" || newpat.phone === "") {
      alert("Please type the patient name and phone number!");
      return;
    }

    const yes = confirm("Are you sure with the details provided?");

    if (yes) {
      await AddNewItemToTable(
        newpat,
        TABLE_NAME.PATIENTS,
        (d) => {
          loadPatList();
          console.log(d);
        },
        (e) => {
          alert("Error\n" + e);
          console.log(e);
        }
      );
    }
  }

  return (
    <div className="p-8">
      <PageHeader
        loading={loading}
        title="Bienvenue chez LaLouise"
        sub="Enregistrement nouveux patients et liste de tous les patients"
      />
      <div className="mb-8 flex flex-col md:flex-row border border-white border-b-sky-500">
        <button
          name="lspat"
          onClick={onChangeSection}
          className={`px-2 md:mx-4 border border-white ${
            selectedSection === "lspat"
              ? " border-b-sky-500 bg-sky-500 text-white"
              : "hover:text-sky-500"
          }  hover:border-b-sky-500    md:rounded-t-[6pt] `}
        >
          Liste des Patients ({listPatientsFiltered.length})
        </button>

        <button
          name="newpat"
          onClick={onChangeSection}
          className={`px-2 md:mx-4 ml-0 border border-white  ${
            selectedSection === "newpat"
              ? " border-b-sky-500 bg-sky-500 text-white"
              : "hover:text-sky-500"
          }  hover:border-b-sky-500  md:rounded-t-[6pt] `}
        >
          Nouveau Patient
        </button>
      </div>

      {SECTIONS.LIST_PATIENTS === selectedSection ? (
        <div className="lspat mt-8">
          <ProgressView show={loading} />

          {false && (
            <div>
              Afficher patients de :
              <select
                value={filterDep || DEPARTEMENTS.SIN.code}
                className={StyleInputText}
                onChange={(e) => onSelectedFilterDep(e.target.value)}
              >
                <option value="all">Tous les patients</option>
                {Object.values(DEPARTEMENTS).map((dep, i) => (
                  <option key={i} value={dep.code}>
                    {dep.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <IconButtonsCont
            data={CATEGORIES_PATIENTS}
            onRadioButtonSelected={onRadioButtonSelected}
          />

          <div className=" flex gap-2  ">
            <input
              value={showSortis}
              onChange={(e) => setShowSortis(e.target.checked)}
              type="checkbox"
              defaultChecked={showSortis}
              className="toggle"
            />
            <span>SORTIS HIPTAL</span>
          </div>

          <div>
            {listPatients && listPatients.length > 0 ? (
              <div>
                <div className="m-2">
                  <input
                    className={StyleInputText}
                    type="search"
                    value={q}
                    onChange={onSearchPat}
                    placeholder="Search ..."
                  />
                </div>

                <div className="text-purple-500 text-xl font-mono pr-2 my-2">
                  {selectedPatientsCategorieData.title}(
                  {listPatientsFiltered.length})
                </div>

                <div className="md:flex gap-2 flex-wrap">
                  {listPatientsFiltered.map((pat, idx) => (
                    <PatientItem
                      onViewPatient={(e) => onViewPatient(pat)}
                      key={idx}
                      data={pat}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <EmptyList
                  title="Pas de patients"
                  sub="Veuillez ajouter des patients"
                />
                <button
                  onClick={(e) => setSelectedSection("newpat")}
                  className={StyleButton("green-500")}
                >
                  Nouveau Patient
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <FormPatient
          onSaveNewPat={onSaveNewPat}
          onSortieHopital={onSortieHopital}
          onDelPat={onDelPat}
          onUpdatePat={onUpdatePat}
          onCancel={onCancel}
          user={user}
          patient={selectedPatient}
          updating={SECTIONS.VIEW_PAT === selectedSection}
        />
      )}
    </div>
  );
}
