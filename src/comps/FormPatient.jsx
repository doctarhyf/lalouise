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
import { AddNewItemToTable, TABLE_NAME } from "../db/sb";

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

export default function FormPatient({
  patient,
  onUpdatePat,
  onDelPat,
  updating,
  user,
  onSortieHopital,
  onCancel,
  onSaveNewPat,
}) {
  /* const [loading, setLoading] = useState(false); */
  const [patientData, setPatientData] = useState(patient || DEFAULT_PATIENT);
  const [showFormNewMed, setShowFormNewMed] = useState(false);
  const [rdk, setrdk] = useState(Math.random());

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

    const updPat = { ...patientData };
    updPat[dataKey] = data;

    console.log("updPat => \n", updPat);
    setPatientData(updPat);
  }

  async function onDeletePayment(p) {
    if (!confirm("Etes-vous sur de vouloir supprimer ce payement?")) {
      return;
    }

    DeleteItem(TABLE_NAME.PAYMENTS, p.id, (r) => {
      alert("Item deleted!Res : ", r);
      loadPayments();
    });
  }

  async function onConfirmPayment(p) {
    if (!confirm("Etes vous sure de vouloir confirmer ce payement?")) {
      return;
    }

    let upd = { ...p, payed: true, payed_at: new Date().toISOString() };

    // console.dir(upd);

    //return;
    UpdateItem(
      TABLE_NAME.PAYMENTS,
      p.id,
      upd,
      (r) => {
        alert("Credit paye!");
        loadPayments();
        console.log(r);
      },
      (e) => {
        alert("Error confirmation\n" + e);
        console.log(e);
      }
    );
  }

  async function onSaveNewPayement(newPayment) {
    newPayment.payed_at = newPayment.cash ? newPayment.created_at : null;

    AddNewItemToTable(newPayment, TABLE_NAME.PAYMENTS, (data) => {
      // loadPayments();
      alert("Payment added successfuly!");
      setShowFormNewMed(false);
      console.log(data);
      GenRDK();
    });
  }

  function GenRDK() {
    setrdk(Math.random());
  }

  return (
    <>
      <div className=" flex-col md:flex-row">
        {!updating && (
          <div role="alert" className="alert my-1 alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Veuillez entrer toutes les identites du nouveau patient SVP!
            </span>
          </div>
        )}

        <details className="info-blk w-full ">
          <summary className={StyleFormBlockTitle()}>
            {!updating
              ? "Identites du Nouveau Patient"
              : "Information du Patient"}
          </summary>

          <div>Selectioner Departement</div>
          {DEPARTEMENTS[patientData.dep].label}

          <IconButtonsCont
            data={CATEGORIES_PATIENTS}
            onRadioButtonSelected={onRadioButtonSelected}
            hidefirst
            selectedcode={patientData.dep}
          />

          <div>Nom</div>
          <input
            className={StyleInputText}
            name="nom"
            value={patientData.nom}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            name="phone"
            value={patientData.phone}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            name="add"
            value={patientData.add}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />

          <h5>Date de Naissance</h5>
          <input
            type="date"
            value={patientData.dob}
            name="dob"
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
          />
          {patientData.dob && (
            <div className=" font-bold   ">{patientData.dob}</div>
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
            value={patientData.poids}
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
            value={patientData.taille}
            onChange={(e) =>
              onUpdatePatientData(e.target.name, e.target.value, "float")
            }
            type="Number"
          />
        </details>

        {updating && (
          <PaymenDetails
            key={rdk}
            onSaveNewPayement={onSaveNewPayement}
            setShowFormNewMed={setShowFormNewMed}
            onDeletePayment={onDeletePayment}
            onConfirmPayment={onConfirmPayment}
            user={user}
            showFormNewMed={showFormNewMed}
            updatingPat={patientData}
          />
        )}

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>Contact d'urgence</summary>
          <div>Nom</div>
          <input
            className={StyleInputText}
            name="emergContact.nom"
            value={patientData.emergContact.nom}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            name="emergContact.phone"
            value={patientData.emergContact.phone}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            name="emergContact.add"
            value={patientData.emergContact.add}
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
              value={patientData.vaccVaricelle}
              checked={patientData.vaccVaricelle}
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
              value={patientData.vaccMeasles}
              checked={patientData.vaccMeasles}
              onChange={(e) =>
                onUpdatePatientData(e.target.name, e.target.value)
              }
            />
            Vaccin Measles
          </div>
          <div>
            <input
              type="checkbox"
              value={patientData.hepC}
              name="hepC"
              checked={patientData.hepC}
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
            value={patientData.autre}
            onChange={(e) => onUpdatePatientData(e.target.name, e.target.value)}
          ></textarea>
        </details>
      </div>
      {!updating && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
          onClick={(e) => onSaveNewPat(patientData)}
        >
          ENREGISTRER
        </button>
      )}
      {updating && (
        <>
          <button
            className={StyleButton("green-500")}
            onClick={(e) => onUpdatePat(patientData)}
          >
            ENREGISTER MIS A JOUR
          </button>

          <button
            className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-red-500 hover:text-white text-red-500  border border-red-500 `}
            onClick={(e) => onDelPat(patientData.updateID)}
          >
            SUPPRIMER PATIENT
          </button>
          <button
            className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
            onClick={(e) => onSortieHopital()}
          >
            SORTIE HOPITAL
          </button>
        </>
      )}
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={onCancel}
      >
        ANNULER
      </button>

      {/*  <ProgressView show={loading} /> */}
    </>
  );
}
