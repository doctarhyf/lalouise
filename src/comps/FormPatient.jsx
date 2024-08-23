import { useState } from "react";
import {
  CATEGORIES_PATIENTS,
  DEPARTEMENTS,
  PAYMENTS_TYPES,
} from "../helpers/flow";
import { StyleButton, StyleFormBlockTitle, StyleInputText } from "../Styles";
import DOBInput from "./DOBInput";
import IconButtonsCont from "./IconButtonsCont";
import ProgressView from "./ProgressView";
import PaymenDetails from "./PaymentDetails";

const DEFAULT_PATIENT = {
  //"id": 816,
  // "created_at": "2024-08-14T11:51:03.540147+00:00",
  emergContact: {
    nom: "",
    phone: "",
    add: "",
  },
  nom: "",
  phone: "",
  add: "",
  dob: "2024-08-28",
  poids: 0,
  taille: 0,
  vaccVaricelle: true,
  vaccMeasles: true,
  hepC: false,
  autre: "Pas d'autres maladies ",
  photo: null,
  dep: "MAT",
  exit_hospital_at: null,
  exit: null,
};

export default function FormPatient({ patient, updating, user }) {
  const [dobisvalid, setdobisvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingPat, setUpdatingPat] = useState(patient || DEFAULT_PATIENT);
  const [showFormNewMed, setShowFormNewMed] = useState(false);

  function onRadioButtonSelected(dt) {
    console.log(dt);
    const { code } = dt;
    onUpdatePatientData("dep", code);
  }

  function onUpdatePatientData(dataKey, data, type) {
    if (arguments.length < 2)
      throw new Error(`Arguments "dataKey & data" must be defined!`);

    if (type === "float") {
      data = parseFloat(data);
    }

    if (type === "int") {
      data = parseInt(data);
    }

    const updPat = { ...updatingPat };
    updPat[dataKey] = data;

    console.log("updPat => \n", updPat);
    setUpdatingPat(updPat);
  }

  return (
    <>
      <div className=" flex-col md:flex-row">
        <details className="info-blk w-full ">
          <summary className={StyleFormBlockTitle()}>
            Information du Patient
          </summary>

          <div>Departement (MAT, SIN, SOP)</div>
          {DEPARTEMENTS[updatingPat.dep].label}

          <IconButtonsCont
            data={CATEGORIES_PATIENTS}
            onRadioButtonSelected={onRadioButtonSelected}
            hidefirst
            selectedcode={updatingPat.dep}
          />

          <div>Nom</div>
          <input
            className={StyleInputText}
            name="nom"
            value={updatingPat.nom}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            name="phone"
            value={updatingPat.phone}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            name="add"
            value={updatingPat.add}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />

          <h5>Date de Naissance</h5>
          <input
            type="date"
            value={updatingPat.dob}
            name="dob"
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
          />
          {updatingPat.dob && (
            <div className=" font-bold   ">{updatingPat.dob}</div>
          )}

          {/* <DOBInput
            setDateIsValid={(v) => setdobisvalid(v)}
            initDate={updatingPat.newPatDOB}
            onNewDate={(d) => {
              console.log(d);
              updatingPat.setNewPatDOB(d);
            }}
          /> */}

          <div>Poids</div>
          <input
            className={StyleInputText}
            value={updatingPat.poids}
            onChange={(e) =>
              onUpdatePatientData(e.target.name, e.target.value, "int")
            }
            name="poids"
            type="number"
          />
          <div>Taille</div>
          <input
            className={StyleInputText}
            name="taille"
            value={updatingPat.taille}
            onChange={(e) =>
              onUpdatePatientData(e.target.name, e.target.value, "float")
            }
            type="Number"
          />
        </details>

        {updating && (
          <PaymenDetails
            user={user}
            showFormNewMed={showFormNewMed}
            updatingPat={updatingPat}
          />
        )}

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>Contact d'urgence</summary>
          <div>Nom</div>
          <input
            className={StyleInputText}
            name="emergContact.nom"
            value={updatingPat.emergContact.nom}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            name="emergContact.phone"
            value={updatingPat.emergContact.phone}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            name="emergContact.add"
            value={updatingPat.emergContact.add}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />
        </details>

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>
            Historique Medical
          </summary>
          <div>
            <input
              type="checkbox"
              name="vaccVaricelle"
              value={updatingPat.vaccVaricelle}
              checked={updatingPat.vaccVaricelle}
              onChange={(e) =>
                onUpdatePatientData(e.target.name, e.target.value)
              }
            />
            Vaccin Varicelle
          </div>
          <div>
            <input
              type="checkbox"
              name="vaccMeasles"
              value={updatingPat.vaccMeasles}
              checked={updatingPat.vaccMeasles}
              onChange={(e) =>
                onUpdatePatientData(e.target.name, e.target.value)
              }
            />
            Vaccin Measles
          </div>
          <div>
            <input
              type="checkbox"
              value={updatingPat.hepC}
              name="hepC"
              checked={updatingPat.hepC}
              onChange={(e) =>
                onUpdatePatientData(e.target.name, e.target.value)
              }
            />
            Avez-vous deja eu l'Hpeatite C
          </div>

          <h5>Autres Maladies</h5>
          <textarea
            className={StyleInputText}
            name="autre"
            value={updatingPat.autre}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
          ></textarea>
        </details>
      </div>
      {!updating && dobisvalid && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
          onClick={updatingPat.onSaveNewPat}
        >
          ENREGISTRER
        </button>
      )}
      {updating && (
        <>
          <button
            className={StyleButton("green-500")}
            onClick={(e) => updatingPat.onUpdatePat(updatingPat.updateID)}
          >
            UPDATE
          </button>

          <button
            className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-red-500 hover:text-white text-red-500  border border-red-500 `}
            onClick={(e) => updatingPat.onDelPat(updatingPat.updateID)}
          >
            DELETE RECORD
          </button>
        </>
      )}
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={updatingPat.onCancel}
      >
        ANNULER
      </button>
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={(e) => onSortieHopital()}
      >
        SORTIE HOPITAL
      </button>
      <ProgressView show={loading} />
    </>
  );
}
