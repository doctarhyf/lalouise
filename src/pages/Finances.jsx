import React, { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import { GetAllItemsFromTable, TABLE_NAME } from "../db/sb";
import { FormatDate, FormatNumberWithCommas } from "../helpers/funcs";
import { cltd } from "../helpers/flow";

export default function Finances() {
  const [payments, setPayments] = useState([]);
  const [paymentsFiltered, setPaymentsFiltered] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setPayments([]);
    setPaymentsFiltered([]);
    const p = await GetAllItemsFromTable(TABLE_NAME.PAYMENTS);
    setPayments(p);
    setPaymentsFiltered(Array.from(p));
  }

  return (
    <div className="p-8">
      {" "}
      <PageHeader title="Finances" sub="Finances generales du centre" />
      <div>
        <table className="w-full">
          <thead>
            <tr>
              {["No", "Amount", "Type", "Date/Heure"].map((it, i) => (
                <td className={` ${cltd} w-min `}>{it}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentsFiltered.map((p, i) => (
              <tr key={i}>
                <td className={cltd}>{i + 1}</td>
                <td className={cltd}>
                  {FormatNumberWithCommas(p.amount)}
                  {" FC"}
                </td>
                <td className={cltd}>{p.type}</td>
                <td className={cltd}>{FormatDate(new Date(p.created_at))}</td>
              </tr>
            ))}
            <tr className="font-bold bg-neutral-100">
              <td className={cltd}>TOTAL</td>
              <td className={cltd} colSpan={3}>
                {FormatNumberWithCommas(
                  payments.reduce((acc, it) => acc + it.amount, 0)
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
