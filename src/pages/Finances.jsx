import React, { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import { GetAllItemsFromTable, TABLE_NAME } from "../db/sb";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";

import { GetPaymentTypeLableFromCode, MOIS, cltd } from "../helpers/flow";
import ProgressView from "../comps/ProgressView";

export default function Finances() {
  const [payments, setPayments] = useState([]);
  const [paymentsFiltered, setPaymentsFiltered] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-8">
      {" "}
      <PageHeader title="Finances" sub="Finances generales du centre" />
      <div>
        <div className="text-lg text-sky-500">RECHERCHE/FILTRE</div>
        <div>
          <p>Mois</p>
          <select value={selectedMonth} onChange={onSelectMonth}>
            {MOIS.map((m, i) => (
              <option value={i}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <ProgressView show={loading} />
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
                <td className={cltd}>
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
