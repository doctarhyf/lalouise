import { useEffect, useState } from "react";
import PageHeader from "../comps/PageHeader";
import * as SB from "../db/sb";
import {
  arrayToObject,
  DATE_TYPE,
  formatCDF,
  formatFrenchDateTime,
  formatNumberWithCDF,
} from "../helpers/funcs";
import { GET_PAYMENT_TYPE } from "../helpers/flow";
import print from "../assets/print.png";
import del from "../assets/delete.png";
import refresh from "../assets/refresh.png";
import check from "../assets/check.png";
import { printTable } from "../helpers/print";
import ActionButton from "../comps/ActionButton";

const HEADERS = {
  IDX: "idx",
  ID: "id",
  DATE: "created_at",
  "TYPE PAYMENT": "type",
  MONTANT: "amount",
  CASH: "cash",
  PAYE: "payed",
  ACTION: "action",
};

const ITEMS_PER_PAGE = [10, 20, 50, 100];

const ROW_INDEX = {
  TOTAL: 4,
  DATE: 2,
  PAYMENT_TYPE: 3,
  PAYED: 6,
  AMOUNT: 4,
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
  reload,
  onPrint,
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
    <div className=" flex md:flex-row flex-col gap-4 py-2 ">
      <div>
        <div className="flex ">
          <input
            type="checkbox"
            value={filterbydate}
            onChange={(e) => setfilterbydate(e.target.checked)}
          />
          <div className=" text-xs font-bold uppercase ">Filter by Date</div>
        </div>
        {filterbydate && (
          <input
            type="date"
            className="border border-purple-600 rounded-md p-1"
            value={date}
            onChange={onDateChange}
          />
        )}
      </div>
      {/* <div className={` flex gap-4 ${filterbydate ? " hidden " : "block"}  `}> */}
      <div className={`  ${filterbydate ? " hidden " : "block"} `}>
        <div className={` text-xs font-bold uppercase `}>
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

      <div className={` ${filterbydate ? " hidden " : "block"} `}>
        <div className={` text-xs font-bold uppercase  `}>Items Per Page</div>
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

      <ActionButton icon={refresh} title={"Refresh"} onClick={reload} />
      <ActionButton icon={print} title={"print"} onClick={onPrint} />
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
  const [curpage, setcurpage] = useState(0);
  const [perpage, setperpage] = useState(ITEMS_PER_PAGE[0]);
  const [numpages, setnumpages] = useState(0);
  const [filteredpayments, setfilteredpayments] = useState([]);
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
    }

    const totalAmount = curslicedpayments.reduce(
      (sum, item) =>
        item.payed === "OUI" ? sum + parseFloat(item.amount) : sum + 0,
      0
    );

    settotal(formatCDF(totalAmount));

    setfilteredpayments(curslicedpayments);
  }, [perpage, payments, curpage, filterbydate, datefilter]);

  async function loadPayments() {
    setloading(true);
    setpayments([]);
    setfilteredpayments([]);
    let pts = await SB.GetAllItemsFromTable(SB.TABLE_NAME.PAYMENTS);
    pts = pts.map((it, i) => ({
      idx: i,
      ...it,
      cash: it.cash ? "OUI" : "NON",
      payed: it.payed ? "OUI" : "NON",
      type: GET_PAYMENT_TYPE(it.type).label,
      action: !it.payed && (
        <ActionButton
          icon={del}
          title={"Delete"}
          onClick={(e) => onDelPayment(it)}
        />
      ),
    }));

    setpayments(pts);
    setloading(false);
  }

  function onPrint(payments) {
    const TABLE_HEADERS = [Object.keys(HEADERS)];

    TABLE_HEADERS[0].pop();

    let paymentsToPrint = payments.map((payment) =>
      Object.entries(payment).filter((paymentItemData) =>
        Object.values(HEADERS).includes(paymentItemData[0])
      )
    );

    //console.log(paymentsToPrint[0][ROW_INDEX.DATE][1]);

    const [date, time] = formatFrenchDateTime(
      paymentsToPrint[0][ROW_INDEX.DATE][1]
    ).split("à");
    let TITLE = `Payment du ${date}`.toUpperCase();

    let total = 0;
    let DATA = paymentsToPrint.map((payment) => {
      const p = payment.map((paymentVal, i) => {
        const v =
          ROW_INDEX.DATE === i
            ? ` ${
                formatFrenchDateTime(paymentVal[1], DATE_TYPE.DATE_TIME_OBJECT)
                  .date
              } - ${
                formatFrenchDateTime(paymentVal[1], DATE_TYPE.DATE_TIME_OBJECT)
                  .time
              }`
            : ROW_INDEX.AMOUNT === i
            ? formatNumberWithCDF(paymentVal[1])
            : paymentVal[1];

        return v;
      });
      if (p[ROW_INDEX.PAYED] === "OUI")
        total += parseInt(
          p[ROW_INDEX.AMOUNT].replaceAll(", ", "").replace(" CDF", "")
        );
      delete p.action;
      return p;
    });

    const totalRow = [, , , "TOTAL", formatNumberWithCDF(total)];

    DATA.push(totalRow);

    if (!filterbydate) {
      TITLE = `PAYMENTS [${curpage} - ${curpage + perpage}]`;
    }

    let FILE_NAME = `${TITLE.replaceAll(" ", "_")}.pdf`;

    printTable(DATA, TITLE, TABLE_HEADERS, FILE_NAME);
  }

  function onDelPayment(payment) {
    console.log(payment);
    if (window.confirm("Etes-vous sure de vouloir supprimer ce payement?")) {
      SB.DeleteItem(SB.TABLE_NAME.PAYMENTS, payment.id, (s) => {
        alert("Payment deleted!");
        loadPayments();
        console.log(s);
      });
    }
  }

  return (
    <div className=" p-8 container ">
      <PageHeader
        title={`Finances (${payments.length})`}
        sub="Finances generales du centre"
        loading={loading}
      />

      <Pagination
        onPrint={(e) => onPrint(filteredpayments)}
        curpage={curpage}
        numpages={numpages}
        setcurpage={setcurpage}
        setperpage={setperpage}
        perpage={perpage}
        filterbydate={filterbydate}
        setfilterbydate={setfilterbydate}
        datefilter={datefilter}
        setdatefilter={setdatefilter}
        reload={loadPayments}
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
            {filteredpayments.map((payment) => (
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
                      {ROW_INDEX.TOTAL === i ? (
                        formatCDF(paymentData[1])
                      ) : ROW_INDEX.DATE === i ? (
                        `${
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
                      ) : ROW_INDEX.PAYED === i ? (
                        paymentData[1] === "OUI" ? (
                          <img src={check} className="w-4 h-4" />
                        ) : (
                          paymentData[1]
                        )
                      ) : (
                        paymentData[1]
                      )}
                    </td>
                  ))}
              </tr>
            ))}

            <RowTotal total={total} />
          </tbody>
        </table>
      </div>

      {perpage > ITEMS_PER_PAGE[ITEMS_PER_PAGE.length - 2] && (
        <Pagination
          onPrint={(e) => onPrint(filteredpayments)}
          curpage={curpage}
          numpages={numpages}
          setcurpage={setcurpage}
          setperpage={setperpage}
          perpage={perpage}
          filterbydate={filterbydate}
          setfilterbydate={setfilterbydate}
          datefilter={datefilter}
          setdatefilter={setdatefilter}
          reload={loadPayments}
        />
      )}
    </div>
  );
}
