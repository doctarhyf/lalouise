import { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import * as SB from "../db/sb";

import { DATE_TYPE, formatCDF, formatFrenchDateTime } from "../helpers/funcs";
import { GET_PAYMENT_TYPE } from "../helpers/flow";

/*
{
    "id": 840,
    "created_at": "2024-01-05T08:26:24.145",
    "type": "MAT",
    "foreign_key": 471,
    "foreign_table": "pat_",
    "amount": 75000,
    "description": null,
    "cash": false,
    "payed": true,
    "payed_at": "2024-01-06T08:49:43.5",
    "data": null,
    "cache_received": false
}

*/

const HEADERS = {
  IDX: "idx",
  "ID PAYMENT": "id",
  DATE: "created_at",
  "TYPE PAYMENT": "type",
  MONTANT: "amount",
  CASH: "cash",
  "DAJA PAYE": "payed",
};

const ITEMS_PER_PAGE = [10, 20, 50, 100];

const ROW_INDEX = {
  TOTAL: 4,
  DATE: 2,
  PAYMENT_TYPE: 3,
};

function Pagination({
  curpage,
  perpage,
  numpages,
  setcurpage,
  setperpage,
  filterbydate,
  setfilterbydate,
  datefilter,
  setdatefilter,
}) {
  const [date, setdate] = useState();

  function onDateChange(e) {
    const val = e.target.value;
    const [y, m, d] = val.split("-");
    const dt = `${d}/${m}/${y}`;
    console.log(dt);

    setdatefilter(val);
  }
  return (
    <div className=" flex gap-4 py-2 ">
      <div>
        <div className="flex flex-row-reverse">
          <div className=" text-xs font-bold uppercase ">Filter by Date</div>
          <input
            type="checkbox"
            value={filterbydate}
            onChange={(e) => setfilterbydate(e.target.checked)}
          />
        </div>
        {filterbydate && (
          <input type="date" value={date} onChange={onDateChange} />
        )}
      </div>
      <div className={` flex gap-4 ${filterbydate ? " hidden " : "block"}  `}>
        <div>
          <div className=" text-xs font-bold uppercase ">
            Current Page ({curpage}/{numpages})
          </div>

          <select
            className="border p-1 rounded-md"
            onChange={(e) => {
              let parsedValue = parseInt(e.target.value);

              if (parsedValue < 0) parsedValue = numpages;
              if (parsedValue > numpages) parsedValue = 0;
              setcurpage(parsedValue);
            }}
          >
            {[...Array(numpages)].map((it, i) => (
              <option value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <div className=" text-xs font-bold uppercase ">Items Per Page</div>
          <select
            className="border p-1 rounded-md"
            onChange={(e) => setperpage(parseInt(e.target.value))}
          >
            {ITEMS_PER_PAGE.map((it) => (
              <option selected={it === perpage} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function RowTotal({ total }) {
  return (
    <tr className={` hover:bg-slate-300 cursor-pointer  `}>
      {Object.values(HEADERS).map((paymentData, i) => (
        <td
          key={i}
          className={` ${"border-slate-500"} border bg-black text-white  `}
        >
          {i === ROW_INDEX.TOTAL
            ? total
            : ROW_INDEX.PAYMENT_TYPE === i
            ? "TOTAL"
            : ""}
        </td>
      ))}
    </tr>
  );
}

export default function Finances() {
  const [loading, setloading] = useState(false);
  const [payments, setpayments] = useState([]);
  const [curpage, setcurpage] = useState(1);
  const [perpage, setperpage] = useState(ITEMS_PER_PAGE[0]);
  const [numpages, setnumpages] = useState(0);
  const [slicedpayments, setslicedpayments] = useState([]);
  const [total, settotal] = useState(0);
  const [filterbydate, setfilterbydate] = useState(false);
  const [datefilter, setdatefilter] = useState();

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const pgslen = Math.floor(payments.length / perpage);
    setnumpages(pgslen);
    let curslicedpayments = payments.slice(
      curpage * perpage,
      curpage * perpage + perpage
    );

    if (filterbydate) {
      curslicedpayments = payments.filter((p) =>
        p.created_at.includes(datefilter)
      );
      console.log(payments[0].created_at.includes(datefilter));
    }

    //calculate total
    const totalAmount = curslicedpayments.reduce(
      (sum, item) =>
        item.payed === "OUI" ? sum + parseFloat(item.amount) : sum + 0,
      0
    );

    console.log(curslicedpayments[0].payed);
    settotal(formatCDF(totalAmount));

    setslicedpayments(curslicedpayments);
  }, [perpage, payments, curpage, filterbydate, datefilter]);

  useEffect(() => {}, [curpage]);
  // this is cool

  async function loadPayments() {
    setloading(true);
    let pts = await SB.GetAllItemsFromTable(SB.TABLE_NAME.PAYMENTS);
    pts = pts.map((it, i) => ({
      idx: i,
      ...it,
      cash: it.cash ? "OUI" : "NON",
      payed: it.payed ? "OUI" : "NON",
      type: GET_PAYMENT_TYPE(it.type).label,
    }));

    setpayments(pts);
    setloading(false);
  }

  return (
    <div className=" p-8 container ">
      <PageHeader
        title={`Finances (${payments.length})`}
        sub="Finances generales du centre"
        loading={loading}
      />

      <Pagination
        curpage={curpage}
        numpages={numpages}
        setcurpage={setcurpage}
        setperpage={setperpage}
        perpage={perpage}
        filterbydate={filterbydate}
        setfilterbydate={setfilterbydate}
        datefilter={datefilter}
        setdatefilter={setdatefilter}
      />

      <div>
        <table class="table-auto">
          <thead>
            <tr>
              {Object.keys(HEADERS).map((hd) => (
                <th key={hd} className=" border border-slate-500 ">
                  {hd}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <RowTotal total={total} />
            {slicedpayments.map((payment) => (
              <tr className={` hover:bg-slate-300 cursor-pointer  `}>
                {Object.entries(payment)
                  .filter((paymentItemData) =>
                    Object.values(HEADERS).includes(paymentItemData[0])
                  )
                  .map((paymentData, i) => (
                    <td
                      key={i}
                      className={` ${
                        payment.payed === "OUI"
                          ? "border-green-500 bg-green-100 text-green-800"
                          : "border-slate-500"
                      } border  `}
                    >
                      {ROW_INDEX.TOTAL === i
                        ? formatCDF(paymentData[1])
                        : ROW_INDEX.DATE === i
                        ? `${
                            formatFrenchDateTime(
                              paymentData[1],
                              DATE_TYPE.DATE_TIME_OBJECT
                            ).date
                          } - ${
                            formatFrenchDateTime(
                              paymentData[1],
                              DATE_TYPE.DATE_TIME_OBJECT
                            ).time
                          }`
                        : paymentData[1]}
                    </td>
                  ))}
              </tr>
            ))}

            <RowTotal total={total} />
          </tbody>
        </table>
      </div>

      <Pagination
        curpage={curpage}
        numpages={numpages}
        setcurpage={setcurpage}
        setperpage={setperpage}
        perpage={perpage}
        filterbydate={filterbydate}
        setfilterbydate={setfilterbydate}
        datefilter={datefilter}
        setdatefilter={setdatefilter}
      />
    </div>
  );
}
