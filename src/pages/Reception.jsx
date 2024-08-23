import { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import ProgressView from "../comps/ProgressView";
import { CATEGORIES_PATIENTS, DEPARTEMENTS } from "../helpers/flow";
import IconButtonsCont from "../comps/IconButtonsCont";
import EmptyList from "../comps/EmptyList";
import { StyleButton, StyleInputText } from "../Styles";
import { GetAllItemsFromTable, TABLE_NAME } from "../db/sb";
import PatientItem from "../comps/PatientItem";

export default function Reception() {
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [listPatients, setListPatients] = useState([]);
  const [listPatientsFiltered, setListPatientsFiltered] = useState([]);
  const [selectedSection, setSelectedSection] = useState("lspat");
  const [patsCount, setPatsCount] = useState(0);
  const [selectedPatientsCategorieData, setSelectedPatientsCategorieData] =
    useState(CATEGORIES_PATIENTS[0]);

  useEffect(() => {
    loadPatList();
  }, []);

  async function loadPatList() {
    setLoading(true);
    setListPatients([]);
    setListPatients([]);

    const list = await GetAllItemsFromTable(TABLE_NAME.PATIENTS);

    //setPatsCount(list.length);
    setListPatients(list);
    setListPatientsFiltered(Array.from(list));
    setSelectedSection("lspat");
    setLoading(false);

    //ParsePatientsCategories();
  }

  function onChangeSection(e) {
    const secName = e.target.name;
    setSelectedSection(secName);
    console.log(secName);
  }

  function onRadioButtonSelected(dt) {
    console.log(dt);
    const { code } = dt;
    props.setNewPatDep(code);
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

  return (
    <div className="p-8">
      <PageHeader
        title="Bienvenue chez LaLouise"
        sub="Enregistrement nouveux patients et liste de tous les patients"
      />
      <div className="mb-8 flex flex-col md:flex-row border border-white border-b-sky-500">
        <button
          name="lspat"
          onClick={onChangeSection}
          className={`px-2 mx-4 border border-white ${
            selectedSection === "lspat"
              ? " border-b-sky-500 bg-sky-500 text-white"
              : "hover:text-sky-500"
          }  hover:border-b-sky-500   rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Liste des Patients ({listPatientsFiltered.length})
        </button>

        <button
          name="newpat"
          onClick={onChangeSection}
          className={`px-2 mx-4 ml-0 border border-white  ${
            selectedSection === "newpat"
              ? " border-b-sky-500 bg-sky-500 text-white"
              : "hover:text-sky-500"
          }  hover:border-b-sky-500  rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Nouveau Patient
        </button>
      </div>

      {selectedSection === "lspat" && (
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
      )}
    </div>
  );
}
