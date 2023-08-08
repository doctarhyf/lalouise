import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import PageHeader from "../comps/PageHeader";
import { DummyStats } from "../Helper";
//import { CountItemsInTable, GetAllItemsFromTable, TABLE_PREFIX } from "../db/DBManager";
// import { pbCountItemsInTable,  TABLE_NAME  } from "../db/pb";
import { CountItemsInTable, TABLE_NAME } from "../db/sb";

function StatItem({ statData }) {
  return (
    <div className="w-[140pt] p-2 h-[160pt] bg-white border border-sky-500 ">
      <div className="h-[12pt]">{statData.title}</div>
      <div className="text-[96pt] p-0 m-0 text-sky-500 text-center">
        {statData.data}
      </div>
    </div>
  );
}

export default function Home() {
  //const [stats, setStats] = useState(null)
  const [infCount, setInfCount] = useState(0);
  const [medsCount, setMedsCount] = useState(0);
  const [patsCount, setPatsCount] = useState(0);
  const [time, setTime] = useState();

  useEffect(() => {
    async function loadCounts() {
      setInfCount(await CountItemsInTable(TABLE_NAME.INFIRMIERS));
      setMedsCount(await CountItemsInTable());
      setPatsCount(await CountItemsInTable(TABLE_NAME.PATIENTS));
    }

    loadCounts();

    setInterval(function myTimer() {
      const t = new Date().toLocaleTimeString();
      setTime(t);
    }, 1000);
  }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="Home"
        sub={`Statistics du centre, le ${new Intl.DateTimeFormat(
          "fr-FR"
        ).format(new Date())}, ${time}`}
      />

      <div className="stats-cont flex flex-wrap gap-8 align-middle justify-center">
        <StatItem
          key={0}
          statData={{ title: "Nombre de medecins", data: infCount }}
        />
        <StatItem
          key={1}
          statData={{ title: "Nombre de produits", data: medsCount }}
        />
        <StatItem
          key={2}
          statData={{ title: `Nombre de patients`, data: patsCount }}
        />
      </div>
    </div>
  );
}
