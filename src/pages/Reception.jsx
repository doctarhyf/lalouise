import React, { useEffect, useRef, useState } from "react";
import { CalcAge } from "../Helper";
import { StyleButton, StyleFormBlockTitle, StyleInputText } from "../Styles";
import logo from "../assets/patient.png";
import EmptyList from "../comps/EmptyList";
import PageHeader from "../comps/PageHeader";
import ProgressView from "../comps/ProgressView";
import patient from "../assets/patient.png";
import {
  GetAllItemsFromTable,
  TABLE_NAME,
  UpdateItem,
  DeleteItem,
  AddNewItemToTable,
  GetAllItemsFromTableByColEqVal,
  UploadFile,
  BUCKET_NAMES,
  GetBucketFilePublicUrl,
} from "../db/sb";
import { DEPARTEMENTS, PAYMENTS_TYPES, cltd } from "../helpers/flow";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";
import { Link } from "react-router-dom";

import cash from "../assets/cash.png";
import check from "../assets/check.png";
import close from "../assets/close.png";
import ok from "../assets/ok.png";
import debt from "../assets/debt.png";
import loading from "../assets/loading.gif";

const clBtn = `cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `;

function FileUploader({ auto, id, notifyUploadDone }) {
  const [file, setFile] = useState();
  const [pct, setpct] = useState(0);
  const [uploadFinished, setUploadFinished] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [storageFilePath, setStorageFilePath] = useState();

  function onChange(e) {
    const f = e.target.files[0];
    setFile(f);

    //console.log(e);

    if (auto) {
      startUpload();
    }
  }

  async function startUpload() {
    UploadFile(file, onUploadProgress, onUploadError, onFileUploaded);

    /*setStorageFilePath(undefined);
    setShowProgress(true);
    setpct(0);
    UploadFile(file, onUploadProgress, onUploadError, onFileUploaded);
    setUploadFinished(false);*/
  }

  function onUploadProgress(pct) {
    console.log("onProgress - pct : ", pct);
    setpct(pct);
  }

  function onUploadError(error) {
    console.log("onError", error);
    //alert(error);
    setShowProgress(false);
    setStorageFilePath(undefined);
  }

  function onFileUploaded(storeInfo) {
    //console.log("onDone", JSON.stringify(stroreInfo));
    //alert(downloadLink);
    setShowProgress(false);
    setUploadFinished(true);
    setStorageFilePath(storeInfo.storageFilePath);
    notifyUploadDone({ ...storeInfo, id: id });
  }

  function onFileDeleted() {
    alert("File deleted!");
    console.log("File deleted!");
  }

  function onFileDeleteError(error) {
    console.log("onFileDeleteError", error);
  }

  async function onReset(e) {
    const res = await DeleteFileFromBucket(
      storageFilePath,
      onFileDeleted,
      onFileDeleteError
    );
    console.log("Res delete : ", res);
    setStorageFilePath(undefined);
    setUploadFinished(false);
    setFile(undefined);
    console.log(e);
  }

  async function onUploadFile(e) {
    if (file !== undefined) {
      startUpload();
    } else {
      //alert("Please select a file first!");
    }
  }

  return (
    <div className="flex flex-col">
      <input
        accept=".jpg, .jpeg, .png, .gif"
        className={` ${uploadFinished ? "hidden" : ""} `}
        type="file"
        onChange={onChange}
      />
      <div className={` ${!uploadFinished ? "hidden" : ""} `}>
        <button
          className="p-1 text-xs bg-green-800 rounded-full text-white"
          onClick={(e) => {
            //onReset(e)
          }}
        >
          FILE UPLOADED
        </button>
      </div>

      <div
        className={`w-full bg-neutral-800 h-[12pt]  rounded-full my-2 overflow-hidden ${
          showProgress ? "visible" : "invisible"
        } `}
      >
        <div
          className={` w-[${pct}%]  bg-green-700 h-full text-white text-[9pt] `}
        ></div>
      </div>

      {auto || <button onClick={onUploadFile}>Upload File</button>}
    </div>
  );
}

function MultiFileUploaderCont({ notifyUploadDone, count = 3 }) {
  return (
    <div>
      {[...Array(count)].fill(0).map((it, i) => (
        <FileUploader auto id={i} notifyUploadDone={notifyUploadDone} />
      ))}
    </div>
  );
}

function PatientItem({ data, onViewPatient }) {
  return (
    <div className=" md:w-[30%] md:border flex gap-x-4 hover:bg-sky-100  rounded-md p-2 cursor-pointer ">
      <div className=" w-[30pt] h-[30pt] rounded-md overflow-hidden">
        <img src={data.photo || logo} className=" h-[100%] " />
      </div>

      <div className="grow">
        <div className="text-black">{data.nom}</div>
        <div className=" text-sm">
          <span className="text-slate-500">{data.emergContact.phone}</span>
          <span>{`, ${CalcAge(new Date(data.dob))} ans`}</span>
        </div>
      </div>

      <div>
        <button onClick={(e) => onViewPatient(data)} className={clBtn}>
          View Details
        </button>
      </div>
    </div>
  );
}

function FormNewPat(props) {
  const [showFormNewMed, setShowFormNewMed] = useState(false);
  let refPaymentAmount = useRef();
  const [newPayment, setNewPayment] = useState({
    created_at: new Date().toISOString(),
    type: PAYMENTS_TYPES[0].code,
    foreign_table: TABLE_NAME.PATIENTS,
    foreign_key: "",
    amount: "",
    cash: false,
    payed: false,
  });
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    setNewPayment((old) => ({ ...old, foreign_key: props.updateID }));
    loadPayments();
    console.log("form props : ", props);
  }, []);

  async function loadPayments() {
    const p = await GetAllItemsFromTableByColEqVal(
      TABLE_NAME.PAYMENTS,
      "foreign_key",
      props.updateID
    );

    console.log(`Payments of id : ${props.updateID} \n`, p);

    setPayments(p);
  }

  async function onSaveNewPayement(e) {
    AddNewItemToTable(newPayment, TABLE_NAME.PAYMENTS, (data) => {
      loadPayments();
      alert("Payment added successfuly!");
      setShowFormNewMed(false);
      console.log(data);
    });
    // setShowFormNewMed(false);
  }

  function notifyUploadDone(storeInfo, id) {
    console.log(storeInfo, id);

    let { publicUrl } = GetBucketFilePublicUrl(storeInfo.path);

    props.setNewPatPhoto(publicUrl);

    console.log("file uploaded => \n", publicUrl);
    props.loadPatList();
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
  return (
    <>
      <div className=" flex-col md:flex-row">
        <details className="info-blk w-full ">
          <summary className={StyleFormBlockTitle()}>
            Information du Patient
          </summary>

          {false && (
            <div>
              <div>Photo</div>
              <div>
                <img src={props.newPatPhoto || patient} width={200} />
              </div>

              <MultiFileUploaderCont
                count={1}
                notifyUploadDone={notifyUploadDone}
              />
            </div>
          )}

          <div>Departement (MAT, SIN, SOP)</div>
          <select
            value={props.newPatDep || DEPARTEMENTS.SIN.code}
            className={StyleInputText}
            onChange={(e) => props.setNewPatDep(e.target.value)}
          >
            {Object.values(DEPARTEMENTS).map((dep, i) => (
              <option key={i} value={dep.code}>
                {dep.label}
              </option>
            ))}
          </select>

          <div>Nom</div>
          <input
            className={StyleInputText}
            value={props.newPatNom}
            onChange={(e) => props.setNewPatNom(e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={props.newPatPhone}
            onChange={(e) => props.setNewPatPhone(e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={props.newPatAdd}
            onChange={(e) => props.setNewPatAdd(e.target.value)}
            type="text"
          />

          <h5>Date de Naissance</h5>
          <input
            type="date"
            value={props.newPatDOB}
            onChange={(e) => props.setNewPatDOB(e.target.value)}
          />
          <div>Poids</div>
          <input
            className={StyleInputText}
            value={props.newPatPoids}
            onChange={(e) => props.setNewPatPoids(e.target.value)}
            type="number"
          />
          <div>Taille</div>
          <input
            className={StyleInputText}
            value={props.newPatTaille}
            onChange={(e) => props.setNewPatTaille(e.target.value)}
            type="Number"
          />
        </details>

        {props.updateID && (
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
                      {PAYMENTS_TYPES.map((p, i) => (
                        <option value={p.code}>{p.label}</option>
                      ))}
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
                        {" "}
                        La facture sera paye ulterieurement (credit){" "}
                      </div>
                    )}
                    {newPayment.cash && (
                      <div className="bg-green-500 p-1 font-bold text-xs text-white rounded-md w-fit">
                        {" "}
                        La facture sera paye CASH!{" "}
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
                <button
                  onClick={(e) => setShowFormNewMed(true)}
                  className={clBtn}
                >
                  NOUVEAU PAYEMENT
                </button>
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
                            <button
                              className={clBtn}
                              onClick={(e) => onConfirmPayment(p)}
                            >
                              CONFIRMER
                            </button>
                          )}
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
                              <div> Paye le : {FormatDate(p.payed_at)}</div>
                            )}
                            {p.cash && (
                              <div>
                                Cash paye le : {FormatDate(p.created_at)}{" "}
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
        )}

        <details className="info-blk w-full">
          <summary className={StyleFormBlockTitle()}>Contact d'urgence</summary>
          <div>Nom</div>
          <input
            className={StyleInputText}
            value={props.emergNom}
            onChange={(e) => props.setEmergNom(e.target.value)}
            type="text"
          />
          <div>Phone</div>
          <input
            className={StyleInputText}
            value={props.emergPhone}
            onChange={(e) => props.setEmergPhone(e.target.value)}
            type="tel"
          />
          <div>Addresse</div>
          <input
            className={StyleInputText}
            value={props.emergAdd}
            onChange={(e) => props.setEmergAdd(e.target.value)}
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
              value={props.vaccVaricelle}
              checked={props.vaccVaricelle}
              onChange={(e) => props.setVaccVaricelle(e.target.checked)}
            />
            Vaccin Varicelle
          </div>
          <div>
            <input
              type="checkbox"
              value={props.vaccMeasles}
              checked={props.vaccMeasles}
              onChange={(e) => props.setVaccMeasles(e.target.checked)}
            />
            Vaccin Measles
          </div>
          <div>
            <input
              type="checkbox"
              value={props.hepC}
              checked={props.hepC}
              onChange={(e) => props.setHepC(e.target.checked)}
            />
            Avez-vous deja eu l'Hpeatite C
          </div>

          <h5>Autres Maladies</h5>
          <textarea
            className={StyleInputText}
            value={props.autre}
            onChange={(e) => props.setAutre(e.target.value)}
          ></textarea>
        </details>
      </div>

      {!props.editing && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
          onClick={props.onSaveNewPat}
        >
          ENREGISTRER
        </button>
      )}
      {props.editing && (
        <button
          className={StyleButton("green-500")}
          onClick={(e) => props.onUpdatePat(props.updateID)}
        >
          UPDATE
        </button>
      )}
      {props.editing && (
        <button
          className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-red-500 hover:text-white text-red-500  border border-red-500 `}
          onClick={(e) => props.onDelPat(props.updateID)}
        >
          DELETE RECORD
        </button>
      )}
      <button
        className={`cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-gray-500 hover:text-white text-gray-500  border border-gray-500 `}
        onClick={props.onCancel}
      >
        ANNULER
      </button>
    </>
  );
}

export default function Reception() {
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [listPatients, setListPatients] = useState([]);
  const [listPatientsFiltered, setListPatientsFiltered] = useState([]);

  const selClass = "text-sky-500 border-b-sky-500 bg-sky-500 text-white";

  const [newPatPhoto, setNewPatPhoto] = useState("");

  const [newPatDep, setNewPatDep] = useState(DEPARTEMENTS.SIN.label);
  const [newPatNom, setNewPatNom] = useState("Franvale Mutunda");
  const [newPatPhone, setNewPatPhone] = useState("0893092849");
  const [newPatAdd, setNewPatAdd] = useState("2220 Av des aviat II");

  const [newPatDOB, setNewPatDOB] = useState(new Date());
  const [newPatPoids, setNewPatPoids] = useState(65);
  const [newPatTaille, setNewPatTaille] = useState(165);

  const [emergNom, setEmergNom] = useState("Alice Liwena");
  const [emergPhone, setEmergPhone] = useState("0812651723");
  const [emergAdd, setEmergAdd] = useState("USA Maryland");

  const [vaccVaricelle, setVaccVaricelle] = useState(true);
  const [vaccMeasles, setVaccMeasles] = useState(true);
  const [hepC, setHepC] = useState(false);

  const [autre, setAutre] = useState("Pas d'autres maladies ");
  const [patsCount, setPatsCount] = useState(0);

  //const [curViewPat, setCurViewPat] = useState(null)
  const [updateID, setUpdateID] = useState(-1);

  useEffect(() => {
    loadPatList();
  }, []);

  function onUpdatePat(id) {
    console.log("updating id : " + id);

    const yes = confirm("Are you sure you want to update?");

    if (yes) {
      let newPat = { emergContact: {} };
      newPat.id = updateID;

      newPat.photo = newPatPhoto;

      newPat.dep = newPatDep;
      newPat.nom = newPatNom;
      newPat.phone = newPatPhone;
      newPat.add = newPatAdd;

      newPat.dob = newPatDOB;
      newPat.poids = newPatPoids;
      newPat.taille = newPatTaille;

      newPat.emergContact.nom = emergNom;
      newPat.emergContact.phone = emergPhone;
      newPat.emergContact.add = emergAdd;

      newPat.vaccVaricelle = vaccVaricelle;
      newPat.vaccMeasles = vaccMeasles;
      newPat.hepC = hepC;

      newPat.autre = autre;

      UpdateItem(TABLE_NAME.PATIENTS, id, newPat);
      loadPatList();
      console.log(newPat);
    }
  }

  async function onSaveNewPat(e) {
    e.preventDefault();

    const yes = confirm("Are you sure with the details provided?");

    if (yes) {
      let newPat = { emergContact: {} };

      newPat.dep = newPatDep;
      newPat.nom = newPatNom;
      newPat.phone = newPatPhone;
      newPat.add = newPatAdd;

      newPat.dob = newPatDOB;
      newPat.poids = newPatPoids;
      newPat.taille = newPatTaille;

      newPat.emergContact.nom = emergNom;
      newPat.emergContact.phone = emergPhone;
      newPat.emergContact.add = emergAdd;

      newPat.vaccVaricelle = vaccVaricelle;
      newPat.vaccMeasles = vaccMeasles;
      newPat.hepC = hepC;

      newPat.autre = autre;

      console.log(newPat);

      await AddNewItemToTable(newPat, TABLE_NAME.PATIENTS, (d) => {
        loadPatList();
        console.log(d);
      });
    }
  }

  async function loadPatList() {
    setLoading(true);
    setListPatients([]);
    setListPatients([]);

    const list = await GetAllItemsFromTable(TABLE_NAME.PATIENTS);

    setPatsCount(list.length);
    setListPatients(list);
    setListPatientsFiltered(Array.from(list));
    setSelectedSection("lspat");
    setLoading(false);
  }

  function onCancel(e) {
    e.preventDefault();
    setSelectedSection("lspat");
  }

  const [selectedSection, setSelectedSection] = useState("lspat");

  function onChangeSection(e) {
    const secName = e.target.name;
    setSelectedSection(secName);
    console.log(secName);
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
    //setCurViewPat(pat)
    setUpdateID(pat.id);

    let curViewPat = pat;

    setNewPatPhoto(curViewPat.photo);
    setNewPatDep(curViewPat.dep);
    setNewPatNom(curViewPat.nom);
    setNewPatPhone(curViewPat.phone);
    setNewPatAdd(curViewPat.add);

    setNewPatDOB(curViewPat.dob);
    setNewPatPoids(curViewPat.poids);
    setNewPatTaille(curViewPat.taille);

    setEmergNom(curViewPat.emergContact.nom);
    setEmergPhone(curViewPat.emergContact.phone);
    setEmergAdd(curViewPat.emergContact.add);

    setVaccVaricelle(curViewPat.vaccVaricelle);
    setVaccMeasles(curViewPat.vaccMeasles);
    setHepC(curViewPat.hepC);

    setAutre(curViewPat.autre);

    setSelectedSection("viewpat");
  }

  function onDelPat(id) {
    if (confirm("Are you sure you want to delete?")) {
      DeleteItem(TABLE_NAME.PATIENTS, id);
      loadPatList();
      setSelectedSection("lspat");
    }
  }

  const [filterDep, setFilterDep] = useState(DEPARTEMENTS.SIN.code);
  function onSelectedFilterDep(filterDep) {
    console.log(filterDep);

    setFilterDep(filterDep);

    if (filterDep === "all") {
      setListPatientsFiltered(listPatients);
      return;
    }

    setListPatientsFiltered(listPatients.filter((p, i) => p.dep === filterDep));
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
            selectedSection === "lspat" ? selClass : "hover:text-sky-500"
          }  hover:border-b-sky-500   rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Liste des Patients ({patsCount})
        </button>

        <button
          name="newpat"
          onClick={onChangeSection}
          className={`px-2 mx-4 ml-0 border border-white  ${
            selectedSection === "newpat" ? selClass : "hover:text-sky-500"
          }  hover:border-b-sky-500  rounded-tl-[6pt] rounded-tr-[6pt] `}
        >
          Nouveau Patient
        </button>
      </div>

      {selectedSection === "lspat" && (
        <div className="lspat mt-8">
          <ProgressView show={loading} />

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

      {selectedSection === "newpat" && (
        <div className="new-pat-form">
          <FormNewPat
            loadPatList={loadPatList}
            editing={false}
            newPatNom={newPatNom}
            setNewPatNom={setNewPatNom}
            newPatDep={newPatDep}
            setNewPatDep={setNewPatDep}
            newPatPhone={newPatPhone}
            setNewPatPhone={setNewPatPhone}
            newPatAdd={newPatAdd}
            setNewPatAdd={setNewPatAdd}
            newPatDOB={newPatDOB}
            setNewPatDOB={setNewPatDOB}
            newPatPoids={newPatPoids}
            setNewPatPoids={setNewPatPoids}
            newPatTaille={newPatTaille}
            setNewPatTaille={setNewPatTaille}
            emergNom={emergNom}
            setEmergNom={setEmergNom}
            emergPhone={emergPhone}
            setEmergPhone={setEmergPhone}
            emergAdd={emergAdd}
            setEmergAdd={setEmergAdd}
            vaccVaricelle={vaccVaricelle}
            setVaccVaricelle={setVaccVaricelle}
            vaccMeasles={vaccMeasles}
            setVaccMeasles={setVaccMeasles}
            hepC={hepC}
            setHepC={setHepC}
            autre={autre}
            setAutre={setAutre}
            onSaveNewPat={onSaveNewPat}
            onCancel={onCancel}
            onUpdatePat={onUpdatePat}
            newPatPhoto={newPatPhoto}
            setNewPatPhoto={setNewPatPhoto}
          />
        </div>
      )}

      {selectedSection === "viewpat" && (
        <div className="view-pat">
          <FormNewPat
            loadPatList={loadPatList}
            updateID={updateID}
            editing={true}
            newPatNom={newPatNom}
            setNewPatNom={setNewPatNom}
            newPatDep={newPatDep}
            setNewPatDep={setNewPatDep}
            newPatPhone={newPatPhone}
            setNewPatPhone={setNewPatPhone}
            newPatAdd={newPatAdd}
            setNewPatAdd={setNewPatAdd}
            newPatDOB={newPatDOB}
            setNewPatDOB={setNewPatDOB}
            newPatPoids={newPatPoids}
            setNewPatPoids={setNewPatPoids}
            newPatTaille={newPatTaille}
            setNewPatTaille={setNewPatTaille}
            emergNom={emergNom}
            setEmergNom={setEmergNom}
            emergPhone={emergPhone}
            setEmergPhone={setEmergPhone}
            emergAdd={emergAdd}
            setEmergAdd={setEmergAdd}
            vaccVaricelle={vaccVaricelle}
            setVaccVaricelle={setVaccVaricelle}
            vaccMeasles={vaccMeasles}
            setVaccMeasles={setVaccMeasles}
            hepC={hepC}
            setHepC={setHepC}
            autre={autre}
            setAutre={setAutre}
            onSaveNewPat={onSaveNewPat}
            onCancel={onCancel}
            onUpdatePat={onUpdatePat}
            onDelPat={onDelPat}
            newPatPhoto={newPatPhoto}
            setNewPatPhoto={setNewPatPhoto}
          />
        </div>
      )}
    </div>
  );
}
