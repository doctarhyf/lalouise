import React, { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import { AddNewItemToTable, GetAllItemsFromTable, TABLE_NAME } from "../db/sb";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";
import drugs from "../assets/drugs.png";
import invoice from "../assets/invoice.png";
import eye from "../assets/eye.png";

import {
  GetPaymentTypeLableFromCode,
  MOIS,
  PAYMENTS_TYPES,
  cltd,
} from "../helpers/flow";
import ProgressView from "../comps/ProgressView";

function TablePaymentGen({ selectedQuitDate, paymentsFiltered, showTableGen }) {
  return (
    <>
      <table className=" TABLEAU GEN w-full">
        <thead>
          <tr>
            <td
              colSpan={7}
              className="text-lg border-b border-l  text-center text-sky-500"
            >
              PAYEMENTS DE ({selectedQuitDate})
            </td>
          </tr>
          <tr>
            {[
              "No",
              "Date/Heure",
              "Amount",
              "Type",
              "Cash",
              "Deja Paye",
              "Paye le",
            ].map((it, i) => (
              <td className={` ${cltd} w-min `}>{it}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {paymentsFiltered.length > 10 && (
            <tr className={`font-bold bg-neutral-100  `}>
              <td className={cltd}>TOTAL</td>
              <td className={cltd} colSpan={7}>
                {FormatNumberWithCommas(
                  paymentsFiltered.reduce((acc, it) => acc + it.amount, 0)
                )}{" "}
                {"FC"}
              </td>
            </tr>
          )}
          {paymentsFiltered.map((p, i) => (
            <tr
              key={i}
              className={`hover:bg-sky-500 hover:text-white cursor-pointer   ${
                p.payed ? "" : "bg-red-100"
              }
              

                   
                      ${p.type === "DEP" ? "italic text-red-800 font-bold" : ""}
                      
                      `}
            >
              <td className={` ${cltd}  `}>
                <div className="flex">
                  <div> {i + 1} </div>
                  <img src={p.type === "PHA" ? drugs : invoice} width={24} />
                </div>
              </td>
              <td className={cltd}>{FormatDate(new Date(p.created_at))}</td>
              <td className={`${cltd} ${""} `}>
                {p.type === "DEP" ? "-" : ""}
                {FormatNumberWithCommas(p.amount)}
                {" FC"}
              </td>
              <td className={cltd}>
                {GetPaymentTypeLableFromCode(p.type)}{" "}
                {p.type === "DEP" ? `(${p.description})` : ""}
              </td>
              <td className={cltd}>{p.cash ? "CASH" : "DEPT"}</td>
              <td className={cltd}>
                {p.payed ? (
                  <span className="text-xs p-1 font-bold rounded-lg text-white bg-green-600 ">
                    PAYE
                  </span>
                ) : (
                  <span className="text-xs p-1 font-bold rounded-lg text-white bg-red-600 ">
                    NON
                  </span>
                )}
              </td>
              <td className={cltd}>
                {p.payed_at && FormatDate(new Date(p.payed_at))}
              </td>
            </tr>
          ))}
          <tr className="font-bold bg-neutral-100">
            <td className={cltd}>TOTAL</td>
            <td className={cltd} colSpan={7}>
              {FormatNumberWithCommas(
                //paymentsFiltered.reduce((acc, it) => acc + it.amount, 0)
                paymentsFiltered.reduce(function (acc, cv) {
                  if (cv.payed) {
                    return acc + cv.amount;
                  }

                  return acc + 0;
                }, 0)
              )}{" "}
              {"FC"}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default function Finances() {
  const [payments, setPayments] = useState([]);
  const [paymentsFiltered, setPaymentsFiltered] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSpendsForm, setShowSpendsForm] = useState(false);
  const [spendData, setSpendData] = useState({ type: "OTH" });
  const [showTableGen, setShowTableGen] = useState(false);
  const [quitancierData, setQuitancierData] = useState([]);
  const [selectedQuitDate, setSelectedQuitDate] = useState(false);
  const [viewPaymentsDetailsOnDate, setViewPaymentsDetailsOnDate] =
    useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setPayments([]);
    setPaymentsFiltered([]);
    const p = await GetAllItemsFromTable(TABLE_NAME.PAYMENTS);
    setPayments(p);
    setPaymentsFiltered(Array.from(p));

    CalculateQuitancier(p);

    setLoading(false);
  }

  function CalculateQuitancier(payments) {
    // console.log(payments);
    setQuitancierData({});

    let payments_groupeb_by_dates = {};
    let totals_groupedby_date_quit_pha = {};

    //group payments by dates
    for (let payment of payments) {
      const { created_at, payed_at } = payment;
      let using_date = payed_at;

      console.log("using_date ==> ", using_date);
      if (using_date === null) continue;

      const curDate = using_date.split("T")[0];

      let dayData = payments_groupeb_by_dates[curDate];
      if (dayData === undefined) {
        dayData = [payment];
      } else {
        dayData = [...dayData, payment];
      }

      payments_groupeb_by_dates[curDate] = dayData;

      console.log("dayData", "\n", payments_groupeb_by_dates);
    }

    Object.entries(payments_groupeb_by_dates).map((date_payments, i) => {
      const [date, payments] = date_payments;

      let tot_pha = 0;
      let tot_quit = 0;
      for (let payment of payments) {
        if (payment.type !== "PHA" && payment.type !== "DEP" && payment.payed) {
          // total quitancier

          tot_quit += payment.amount;
        }

        if (payment.type === "PHA" && payment.payed) {
          // tot pharmacie
          // quit data
          tot_pha += payment.amount;
        }

        if (payment.type === "DEP" && payment.payed) {
          // reduction depense from pharmacie
          // quit data
          tot_pha -= payment.amount;
        }
      }

      const day_data = { quit: tot_quit, pha: tot_pha };
      totals_groupedby_date_quit_pha[date] = day_data;

      // console.log("date", date, "tot_pha", tot_pha, "tot_quit", tot_quit);
    });

    console.log(
      "totals_groupedby_date_quit_pha => ",
      totals_groupedby_date_quit_pha
    );

    setQuitancierData(totals_groupedby_date_quit_pha);
  }

  function CalculateQuitancier1(payments) {
    setQuitancierData([]);

    let payementsConfirmed = [];
    let quitancier = {};

    for (let payment of payments) {
      let payed_at = payment.payed_at; // payment.payed_at;
      if (payed_at) {
        let date = payed_at.split("T")[0];
        quitancier[date] = [];
        payementsConfirmed.push(payment);
      }
    }
    console.log(quitancier);
    for (let payment of payementsConfirmed) {
      let payed_at = payment.payed_at; // payment.payed_at;
      let date = payed_at.split("T")[0];
      quitancier[date].push(payment);
    }

    let donneesTableauQuitancierPharmacie = [];

    Object.entries(quitancier).map((q, i) => {
      const key = q[0];
      const data = q[1];

      const totalPharmacie = data.reduce(function (acc, cv) {
        if (cv.type === "PHA" && cv.payed) {
          return acc + cv.amount;
        }

        return acc + 0;
      }, 0);

      const totalQuitancier = data.reduce(function (acc, cv) {
        if (cv.type !== "PHA" && cv.payed) {
          return acc + cv.amount;
        }

        return acc + 0;
      }, 0);

      console.log(key, "pha => ", totalPharmacie);
      console.log(key, "quit => ", totalQuitancier);

      donneesTableauQuitancierPharmacie[key] = [
        totalQuitancier,
        totalPharmacie,
      ];
    });

    setQuitancierData(donneesTableauQuitancierPharmacie);
  }

  function GetPaymentDateParts(payment) {
    let [y, m, d] = payment.created_at.split("T")[0].split("-");

    return {
      y: Number.parseInt(y) + 0,
      m: Number.parseInt(m) + 0,
      d: Number.parseInt(d) + 0,
    };
  }

  function onSelectMonth(e) {
    setPaymentsFiltered([]);
    const month = parseInt(e.target.value) + 0;
    setSelectedMonth(month);

    let filtered = Array.from(payments);
    setPaymentsFiltered(filtered);
    if (month === 0) return;

    filtered = payments.filter((p, i) => GetPaymentDateParts(p).m === month);
    setPaymentsFiltered(Array.from(filtered));

    //console.log(payments[0]);
  }

  function onInsererDep(e) {
    const data = spendData;
    data.type = "DEP";
    data.payed = true;
    data.cash = true;
    data.payed_at = data.created_at;

    setLoading(true);
    AddNewItemToTable(data, TABLE_NAME.PAYMENTS, (d) => {
      console.log("on item added : ", d);
      setLoading(false);
      setShowSpendsForm(false);
      loadPayments();
    });
  }

  function onQuitancierRowClicked(qd) {
    const [selectedDate] = qd;

    setSelectedQuitDate(selectedDate);

    console.log(selectedDate);

    const selectedDatePayements = payments.filter((p, i) =>
      p.created_at.includes(selectedDate)
    );

    setPaymentsFiltered(selectedDatePayements);
  }

  return (
    <div className="p-8">
      {" "}
      <PageHeader title="Finances" sub="Finances generales du centre" />
      <button
        className={` ${
          showSpendsForm ? "hidden" : "visible"
        } p-1 border-sky-500 border text-sky-500 hover:text-white my-2 hover:bg-sky-500 rounded-md `}
        onClick={(e) => {
          setShowSpendsForm(!showSpendsForm);
        }}
      >
        + INSERER DEPENSE
      </button>
      <div>
        <input
          type="checkbox"
          value={showTableGen}
          onChange={(e) => setShowTableGen(e.target.checked)}
        />
        SHOW TABLEAU GEN{" "}
      </div>
      <div
        className={` ${
          showSpendsForm ? "visible" : "hidden"
        }  flex flex-col gap-2 `}
      >
        <div className="text-sky-500">INSERER DEPENSE</div>

        <input
          className="outline outline-neutral-400 p-1 rounded-md outline-[1px] hover:outline-sky-500"
          type="number"
          value={spendData.amount || 0}
          onChange={(e) =>
            setSpendData((old) => ({
              ...old,
              amount: parseInt(e.target.value),
            }))
          }
          placeholder="Montant"
        />
        <input
          className="outline outline-neutral-400 p-1 rounded-md outline-[1px] hover:outline-sky-500"
          type="text"
          value={spendData.description || ""}
          onChange={(e) =>
            setSpendData((old) => ({
              ...old,
              description: e.target.value,
            }))
          }
          placeholder="Description ... "
        />
        <input
          className="outline outline-neutral-400 p-1 rounded-md outline-[1px] hover:outline-sky-500"
          type="datetime-local"
          value={spendData.created_at || new Date()}
          onChange={(e) =>
            setSpendData((old) => ({
              ...old,
              created_at: e.target.value,
            }))
          }
        />

        <div className="flex flex-col md:flex-row gap-2">
          <button
            className={` ${
              spendData.amount && spendData.description && spendData.created_at
                ? "visible"
                : "hidden"
            } p-1 border-sky-500 border text-sky-500 hover:text-white my-2 hover:bg-sky-500 rounded-md `}
            onClick={onInsererDep}
          >
            ENREGISTRER
          </button>

          <button
            className={` p-1 border-red-500 border text-red-500 hover:text-white my-2 hover:bg-red-500 rounded-md `}
            onClick={(e) => setShowSpendsForm(false)}
          >
            ANNULER
          </button>
        </div>
      </div>
      <div className={showSpendsForm ? "hidden" : "visible"}>
        <ProgressView show={loading} />

        {showTableGen && (
          <div className="flex">
            <p>AFFICHER TABLEAU DU MOIS : </p>
            <select value={selectedMonth} onChange={onSelectMonth}>
              {MOIS.map((m, i) => (
                <option value={i}>{m}</option>
              ))}
            </select>
          </div>
        )}

        {showTableGen && (
          <TablePaymentGen
            showTableGen={showTableGen}
            selectedQuitDate={selectedQuitDate}
            paymentsFiltered={paymentsFiltered}
          />
        )}

        {!showTableGen && (
          <div>
            <table>
              <thead>
                <tr>
                  <td
                    colSpan={5}
                    align="center"
                    className="text-lg border-b border-l text-center text-sky-500"
                  >
                    TABLEAU QUITANCIER
                  </td>
                </tr>
                <tr className="font-bold">
                  {[
                    "TOT. QUITANCIER",
                    "TOT. PHARMACIE",
                    /*   "View Details", */
                    "Date",
                  ].map((it, i) => (
                    <td className={cltd}>{it}</td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(quitancierData).map((qd, i) => (
                  <tr
                    className={`  ${
                      qd[0] === selectedQuitDate ? "bg-sky-500 text-white" : ""
                    } hover:bg-sky-500 hover:text-white cursor-pointer `}
                    onClick={(e) => onQuitancierRowClicked(qd)}
                  >
                    <td className={cltd}>
                      {FormatNumberWithCommas(qd[1].quit)} FC
                    </td>
                    <td className={cltd}>
                      {FormatNumberWithCommas(qd[1].pha)} FC
                    </td>
                    {/*   <td className={cltd}>
                      <img
                        onClick={(e) => setViewDetailsTable(viewDetailsTable)}
                        src={eye}
                        width={30}
                      />
                    </td> */}
                    <td className={cltd}>{qd[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <input
                type="checkbox"
                onChange={(e) => setViewPaymentsDetailsOnDate(e.target.checked)}
              />{" "}
              SHOW/HIDE Details{" "}
            </div>
            {selectedQuitDate && viewPaymentsDetailsOnDate && (
              <TablePaymentGen
                selectedQuitDate={selectedQuitDate}
                paymentsFiltered={paymentsFiltered}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
