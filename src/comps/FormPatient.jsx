import { useState } from "react";
import { CATEGORIES_PATIENTS, PAYMENTS_TYPES } from "../helpers/flow";
import { StyleButton, StyleFormBlockTitle, StyleInputText } from "../Styles";
import DOBInput from "./DOBInput";
import IconButtonsCont from "./IconButtonsCont";
import ProgressView from "./ProgressView";

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
  dob: "",
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

export default function FormPatient({ patient, updating }) {
  const [dobisvalid, setdobisvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatingPat, setUpdatingPat] = useState(patient || DEFAULT_PATIENT);
  //console.log(patient, updating);

  function onRadioButtonSelected(dt) {
    console.log(dt);
    const { code } = dt;
    onUpdatePatientData("code", code);
  }

  function onUpdatePatientData(dataKey, data) {
    //(e) => updatingPat.setNewPatNom(e.target.value)
    if (arguments.length < 2)
      throw new Error(`Arguments "dataKey & data" must be defined!`);
    console.log(`Data Key : ${dataKey}\nData : ${data}`);
  }

  return (
    <>
      <div className=" flex-col md:flex-row">
        <details className="info-blk w-full ">
          <summary className={StyleFormBlockTitle()}>
            Information du Patient
          </summary>

          <div>Departement (MAT, SIN, SOP)</div>
          {updatingPat.dep}

          <IconButtonsCont
            data={CATEGORIES_PATIENTS}
            onRadioButtonSelected={onRadioButtonSelected}
            hidefirst
            selectedcode={updatingPat.dep}
          />

          <div>Nom</div>
          <input
            className={StyleInputText}
            value={updatingPat.nom}
            onChange={onUpdatePatientData}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={updatingPat.phone}
            onChange={onUpdatePatientData}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={updatingPat.add}
            onChange={onUpdatePatientData}
            type="text"
          />

          <h5>Date de Naissance</h5>
          <input
            type="date"
            value={updatingPat.dob}
            onChange={onUpdatePatientData}
          />

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
            onChange={onUpdatePatientData}
            type="number"
          />
          <div>Taille</div>
          <input
            className={StyleInputText}
            value={updatingPat.taille}
            onChange={onUpdatePatientData}
            type="Number"
          />
        </details>

        {/* {updating && (
          <details className="info-blk w-full">
            <summary className={StyleFormBlockTitle()}>Payment</summary>

            {showFormNewMed && (
              <div className="CONT-NEW_PAYMENT  p-2 shadow outline outline-[1px]">
                <p className="text-sm font-bold text-sky-500">
                  NOUVEAU PAYEMENT
                </p>
                <form>
                  <div>
                    <select
                      onChange={(e) =>
                        setNewPayment((old) => ({
                          ...old,
                          type: e.target.value,
                        }))
                      }
                      value={newPayment.type}
                      className={StyleInputText}
                    >
                      <option value="-">- Type de payement -</option>
                      {PAYMENTS_TYPES.map(
                        (p, i) =>
                          p.code !== "DEP" && (
                            <option value={p.code}>{p.label}</option>
                          )
                      )}
                    </select>
                  </div>

                  <div>
                    <input
                      onChange={(e) =>
                        setNewPayment((old) => ({
                          ...old,
                          amount: Number.parseFloat(e.target.value),
                        }))
                      }
                      value={newPayment.amount}
                      className={StyleInputText}
                      type="number"
                      placeholder="Montant"
                    />
                  </div>

                  <div>
                    <div>
                      <input
                        type="checkbox"
                        checked={newPayment.cash}
                        onChange={(e) =>
                          setNewPayment((old) => ({
                            ...old,
                            cash: e.target.checked,
                            payed: e.target.checked,
                          }))
                        }
                      />
                      CASH{" "}
                      <span className="text-neutral-400">
                        (Veuillez cocher si c'est paye cash!)
                      </span>
                    </div>
                    {!newPayment.cash && (
                      <div className="bg-red-500 p-1 font-bold text-xs text-white rounded-md w-fit">
                        CREDIT: La facture sera paye ulterieurement.
                      </div>
                    )}
                    {newPayment.cash && (
                      <div className="bg-green-500 p-1 font-bold text-xs text-white rounded-md w-fit">
                        CASH: La facture est paye cash!
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => setShowFormNewMed(false)}
                    className="text-red-500 my-4 rounded-md border border-transparent hover:border hover:border-red-500 p-1"
                  >
                    ANNULER
                  </button>

                  {newPayment.amount >= 100 && (
                    <button
                      type="button"
                      onClick={onSaveNewPayement}
                      className={clBtn}
                    >
                      ENREGISTRER PAYMENT
                    </button>
                  )}
                </form>
              </div>
            )}

            {!showFormNewMed && (
              <div className="CONT-PAYMENTS-ALL outline-neutral-400 outline-[1px] outline-dashed p-2 ">
                {updatingPat.user.level <= 1 && (
                  <button
                    onClick={(e) => setShowFormNewMed(true)}
                    className={clBtn}
                  >
                    NOUVEAU PAYEMENT
                  </button>
                )}
                <p className="font-bold text-sm text-sky-500">
                  TABLEAU PAYEMENT
                </p>
                <table className="w-full hidden md:block">
                  <thead>
                    <tr>
                      {[
                        "No",
                        "Amount",
                        "Type",
                        "CASH/CREDIT.",
                        "Deja Paye",
                        "Date/Heure",
                        "Paye le",
                        "Confirmer Payement",
                      ].map((it, i) => (
                        <td className={` ${cltd} w-min `}>{it}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr
                        key={i}
                        className={` ${!p.payed ? "text-red-500 italic" : ""} `}
                      >
                        <td className={cltd}>{i + 1}</td>
                        <td className={cltd}>
                          {FormatNumberWithCommas(p.amount)}
                          {" FC"}
                        </td>
                        <td className={cltd}>{p.type}</td>
                        <td className={cltd}>
                          {p.cash ? (
                            <span>
                              {" "}
                              <img src={cash} width={30} />
                              CASH
                            </span>
                          ) : (
                            <span>
                              {" "}
                              <img src={debt} width={30} />
                              CREDIT
                            </span>
                          )}
                        </td>
                        <td className={cltd}>
                          {!p.payed ? (
                            <img src={close} width={30} />
                          ) : (
                            <img src={check} width={30} />
                          )}
                        </td>
                        <td className={cltd}>
                          {FormatDate(new Date(p.created_at))}
                        </td>
                        <td className={cltd}>
                          {p.payed_at && FormatDate(new Date(p.payed_at))}
                        </td>
                        <td className={cltd}>
                          {p.payed ? (
                            <img src={ok} width={30} />
                          ) : (
                            <>
                              <button
                                className={clBtn}
                                onClick={(e) => onConfirmPayment(p)}
                              >
                                CONFIRMER
                              </button>
                            </>
                          )}
                          <button
                            className={clBtn}
                            onClick={(e) => onDeletePayment(p)}
                          >
                            SUPPRIMER
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-neutral-100">
                      <td className={cltd}>TOTAL</td>
                      <td className={cltd} colSpan={7}>
                        {FormatNumberWithCommas(
                          payments.reduce((sum, record) => {
                            if (record.payed == true) {
                              return sum + record.amount;
                            }
                            return 0 + sum;
                          }, 0)
                        )}{" "}
                        {"FC"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        {" "}
                        <Link to={"/lalouise/finances"}>
                          Page Finances
                        </Link>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="PAYMENTS md:hidden ">
                  <div className="my-2 border-b">
                    {payments.map((p, i) => (
                      <div
                        className={`flex gap-4 ${
                          !p.payed ? "text-red-500" : ""
                        } `}
                      >
                        <div className="text-slate-600">{i + 1}.</div>
                        <div className="flex flex-col ">
                          <div className="text-lg font-bold">{p.amount} FC</div>
                          <div className="text-sm flex gap-2">
                            {" "}
                            {p.cash ? (
                              <img src={cash} width={20} />
                            ) : (
                              "CREDIT"
                            )},{" "}
                            {p.payed ? (
                              <img src={check} width={20} />
                            ) : (
                              <>
                                NON PAYE,{" "}
                                <button
                                  className={clBtn}
                                  onClick={(e) => onConfirmPayment(p)}
                                >
                                  CONFIRMER
                                </button>
                              </>
                            )}{" "}
                          </div>
                          <div className="text-slate-500 text-sm">
                            {p.payed && !p.cash && (
                              <div>
                                {" "}
                                Paye le : {FormatDate(new Date(p.payed_at))}
                              </div>
                            )}
                            {p.cash && (
                              <div>
                                Cash paye le :{" "}
                                {FormatDate(new Date(p.created_at))}{" "}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-neutral-300 font-bold text-lg">
                    TOTAL :{" "}
                    {FormatNumberWithCommas(
                      payments.reduce((sum, record) => {
                        if (record.payed == true) {
                          return sum + record.amount;
                        }
                        return 0 + sum;
                      }, 0)
                    )}{" "}
                    {"FC"}
                  </div>
                </div>
              </div>
            )}
          </details>
        )} */}

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>Contact d'urgence</summary>
          <div>Nom</div>
          <input
            className={StyleInputText}
            value={updatingPat.emergContact.nom}
            onChange={onUpdatePatientData}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={updatingPat.emergContact.phone}
            onChange={onUpdatePatientData}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={updatingPat.emergContact.add}
            onChange={onUpdatePatientData}
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
              value={updatingPat.vaccVaricelle}
              checked={updatingPat.vaccVaricelle}
              onChange={onUpdatePatientData}
            />
            Vaccin Varicelle
          </div>
          <div>
            <input
              type="checkbox"
              value={updatingPat.vaccMeasles}
              checked={updatingPat.vaccMeasles}
              onChange={onUpdatePatientData}
            />
            Vaccin Measles
          </div>
          <div>
            <input
              type="checkbox"
              value={updatingPat.hepC}
              checked={updatingPat.hepC}
              onChange={onUpdatePatientData}
            />
            Avez-vous deja eu l'Hpeatite C
          </div>

          <h5>Autres Maladies</h5>
          <textarea
            className={StyleInputText}
            value={updatingPat.autre}
            onChange={onUpdatePatientData}
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
