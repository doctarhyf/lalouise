import { useEffect, useState } from "react";
import { cltd, PAYMENTS_TYPES } from "../helpers/flow";
import { StyleFormBlockTitle, StyleInputText } from "../Styles";
import { GetAllItemsFromTableByColEqVal, TABLE_NAME } from "../db/sb";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";
import { Link } from "react-router-dom";

import cash from "../assets/cash.png";
import check from "../assets/check.png";
import close from "../assets/close.png";
import debt from "../assets/debt.png";
import ok from "../assets/ok.png";
import DOBInput from "./DOBInput";
import ProgressView from "./ProgressView";

export default function PaymenDetails({
  showFormNewMed,
  updatingPat,
  user,
  onDeletePayment,
  onConfirmPayment,
  setShowFormNewMed,
  onSaveNewPayement,
}) {
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
  const [loading, setLoading] = useState(false);
  const [dobisvalid, setdobisvalid] = useState(false);

  useEffect(() => {
    setNewPayment((old) => ({ ...old, foreign_key: updatingPat.id }));
    loadPayments();
    //console.log("form props : ", props);
  }, [updatingPat]);

  async function loadPayments() {
    setLoading(true);
    setPayments([]);
    const p = await GetAllItemsFromTableByColEqVal(
      TABLE_NAME.PAYMENTS,
      "foreign_key",
      updatingPat.id
    );

    //console.log(`Payments of id : ${updatingPat.id} \n`, p);

    setPayments(p);
    setLoading(false);
  }

  return (
    <details className="info-blk w-full">
      <summary className={StyleFormBlockTitle()}>Payment</summary>

      <ProgressView show={loading} />

      {showFormNewMed && (
        <div className="CONT-NEW_PAYMENT  p-2 shadow outline outline-[1px]">
          <p className="text-sm font-bold text-sky-500">NOUVEAU PAYEMENT</p>
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
                    amount: parseFloat(e.target.value),
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
                onClick={(e) => onSaveNewPayement(newPayment)}
                className={
                  "cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 "
                }
              >
                ENREGISTRER PAYMENT
              </button>
            )}
          </form>
        </div>
      )}

      {!showFormNewMed && (
        <div className="CONT-PAYMENTS-ALL outline-neutral-400 outline-[1px] outline-dashed p-2 ">
          {user.level <= 1 && (
            <>
              <button
                onClick={(e) => setShowFormNewMed(true)}
                className={
                  "cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 "
                }
              >
                NOUVEAU PAYEMENT
              </button>
              <button
                onClick={(e) => {
                  setLoading(true);
                  loadPayments();
                }}
                className={
                  "cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 "
                }
              >
                ACTUALISER
              </button>
            </>
          )}
          <p className="font-bold text-sm text-sky-500">TABLEAU PAYEMENT</p>
          <table className="w-full hidden md:block">
            <thead>
              <tr>
                {[
                  "No",
                  "PMT. ID",
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
                  key={p.payed_at}
                  className={` ${!p.payed ? "text-red-500 italic" : ""} `}
                >
                  <td className={cltd}>{i + 1}</td>
                  <td className={cltd}>{p.id}</td>
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
                  <td className={cltd}>{FormatDate(new Date(p.created_at))}</td>
                  <td className={cltd}>
                    {p.payed_at && FormatDate(new Date(p.payed_at))}
                  </td>
                  <td className={cltd}>
                    {p.payed ? (
                      <img src={ok} width={30} />
                    ) : (
                      <>
                        <button
                          className={`cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
                          onClick={(e) => onConfirmPayment(p)}
                        >
                          CONFIRMER
                        </button>
                      </>
                    )}
                    <button
                      className={
                        "cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 "
                      }
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
                  <Link to={"/lalouise/finances"}>Page Finances</Link>{" "}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="PAYMENTS md:hidden ">
            <div className="my-2 border-b">
              {payments.map((p, i) => (
                <div
                  className={`flex gap-4 ${!p.payed ? "text-red-500" : ""} `}
                >
                  <div className="text-slate-600">{i + 1}.</div>
                  <div className="flex flex-col ">
                    <div className="text-lg font-bold">{p.amount} FC</div>
                    <div className="text-sm flex gap-2">
                      {" "}
                      {p.cash ? <img src={cash} width={20} /> : "CREDIT"},{" "}
                      {p.payed ? (
                        <img src={check} width={20} />
                      ) : (
                        <>
                          NON PAYE,{" "}
                          <button
                            className={`cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-green-500 hover:text-white text-green-500  border border-green-500 `}
                            onClick={(e) => onConfirmPayment(p)}
                          >
                            CONFIRMER
                          </button>
                        </>
                      )}{" "}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {p.payed && !p.cash && (
                        <div> Paye le : {FormatDate(new Date(p.payed_at))}</div>
                      )}
                      {p.cash && (
                        <div>
                          Cash paye le : {FormatDate(new Date(p.created_at))}{" "}
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
  );
}
