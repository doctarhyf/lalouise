import React, { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import { AddNewItemToTable, GetAllItemsFromTable, TABLE_NAME } from "../db/sb";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";

import { GetPaymentTypeLableFromCode, MOIS, cltd } from "../helpers/flow";
import ProgressView from "../comps/ProgressView";

export default function Finances() {
  const [payments, setPayments] = useState([]);
  const [paymentsFiltered, setPaymentsFiltered] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSpendsForm, setShowSpendsForm] = useState(false);
  const [spendData, setSpendData] = useState({ type: "OTH" });

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
    setLoading(false);
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
    data.amount = -data.amount;

    console.log(data);

    setLoading(true);
    AddNewItemToTable(data, TABLE_NAME.PAYMENTS, (d) => {
      console.log("on item added : ", d);
      setLoading(false);
      setShowSpendsForm(false);
      loadPayments();
    });
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
        <div className="flex">
          <p>AFFICHER TABLEAU DU MOIS : </p>
          <select value={selectedMonth} onChange={onSelectMonth}>
            {MOIS.map((m, i) => (
              <option value={i}>{m}</option>
            ))}
          </select>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <td
                colSpan={4}
                className="text-lg border-b border-l  text-center text-sky-500"
              >
                TABLEAU FINANCES - {MOIS[selectedMonth]}/
                {new Date().getFullYear()}
              </td>
            </tr>
            <tr>
              {["No", "Amount", "Type", "Date/Heure"].map((it, i) => (
                <td className={` ${cltd} w-min `}>{it}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentsFiltered.map((p, i) => (
              <tr
                key={i}
                className="hover:bg-sky-500 hover:text-white cursor-pointer"
              >
                <td className={cltd}>{i + 1}</td>
                <td
                  className={`${cltd} ${
                    p.amount <= 0 ? "text-red-500" : "text-green-600"
                  } `}
                >
                  {FormatNumberWithCommas(p.amount)}
                  {" FC"}
                </td>
                <td className={cltd}>{GetPaymentTypeLableFromCode(p.type)}</td>
                <td className={cltd}>{FormatDate(new Date(p.created_at))}</td>
              </tr>
            ))}
            <tr className="font-bold bg-neutral-100">
              <td className={cltd}>TOTAL</td>
              <td className={cltd} colSpan={3}>
                {FormatNumberWithCommas(
                  paymentsFiltered.reduce((acc, it) => acc + it.amount, 0)
                )}{" "}
                {"FC"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
