import { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import * as SB from "../db/sb";
import { formatCDF } from "../helpers/funcs";

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
  "PYT. ID.": "id",
  DATE: "created_at",
  //"PYT. TP.": "type",
  "AMT.": "amount",
  CASH: "cash",
  PAYED: "payed",
};

const BOOL = { TRUE: "OUI", FALSE: "NON" };

const BOOLS_COLS = [4, 5];

const ITEMS_PER_PAGE = [10, 20, 50];

const TOTAL_ROW_IDX = 3;

function Pagination({ curpage, perpage, numpages, setcurpage, setperpage }) {
  return (
    <div className=" flex gap-4 py-2 ">
      <div>
        <div className=" text-xs font-bold uppercase ">
          Current Page ({curpage}/{numpages})
        </div>
        <input
          className="border p-1 rounded-md"
          type="number"
          value={curpage}
          onChange={(e) => {
            let parsedValue = parseInt(e.target.value);

            if (parsedValue < 0) parsedValue = numpages;
            if (parsedValue > numpages) parsedValue = 0;
            setcurpage(parsedValue);
          }}
        />
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

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const pgslen = Math.floor(payments.length / perpage);
    setnumpages(pgslen);
    const curslicedpayments = payments.slice(
      curpage * perpage,
      curpage * perpage + perpage
    );

    const totalAmount = curslicedpayments.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    settotal(formatCDF(totalAmount));

    setslicedpayments(curslicedpayments);
  }, [perpage, payments, curpage]);

  useEffect(() => {}, [curpage]);

  async function loadPayments() {
    setloading(true);
    let pts = await SB.GetAllItemsFromTable(SB.TABLE_NAME.PAYMENTS);
    pts = pts.map((it, i) => ({ idx: i, ...it }));

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
                        payment.payed
                          ? "border-green-500 bg-green-100 text-green-800"
                          : "border-slate-500"
                      } border  `}
                    >
                      {BOOLS_COLS.includes(i)
                        ? paymentData[1]
                          ? BOOL.TRUE
                          : BOOL.FALSE
                        : TOTAL_ROW_IDX === i
                        ? formatCDF(paymentData[1])
                        : paymentData[1]}
                    </td>
                  ))}
              </tr>
            ))}

            <tr className={` hover:bg-slate-300 cursor-pointer  `}>
              {Object.values(HEADERS).map((paymentData, i) => (
                <td key={i} className={` ${"border-slate-500"} border  `}>
                  {i === TOTAL_ROW_IDX ? total : ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        curpage={curpage}
        numpages={numpages}
        setcurpage={setcurpage}
        setperpage={setperpage}
        perpage={perpage}
      />
    </div>
  );
}
