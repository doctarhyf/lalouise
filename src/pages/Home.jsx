import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import PageHeader from "../comps/PageHeader";
import { DummyStats } from "../Helper";
import { CountItemsInTable, TABLE_NAME } from "../db/sb";
import ProgressView from "../comps/ProgressView";
//import { CheckLogginExpired } from "../helpers/funcs";
import { GALLERY_IMAGES_URL, USERS_LEVELS } from "../helpers/flow";
import ImageGallery from "react-image-gallery";
import "../App.css";
import MyCarousel from "../comps/MyCarousel";

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

export default function Home({ user }) {
  const [loading, setLoading] = useState(true);
  const [infCount, setInfCount] = useState("-");
  const [medsCount, setMedsCount] = useState("-");
  const [patsCount, setPatsCount] = useState("-");
  const [time, setTime] = useState();

  useEffect(() => {
    async function loadCounts() {
      setLoading(true);
      setInfCount(await CountItemsInTable(TABLE_NAME.INFIRMIERS));
      setMedsCount(await CountItemsInTable());
      setPatsCount(await CountItemsInTable(TABLE_NAME.PATIENTS));
      setLoading(false);

      //CheckLogginExpired(user);

      //alert(window.location);
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
        title="Home (Upd v2.2.0) - [🎅] "
        sub={`Statistics du centre, le ${new Intl.DateTimeFormat(
          "fr-FR"
        ).format(new Date())}, ${time}`}
      />

      <div className="my-2">
        Bienvenue,{" "}
        <span className="text-sky-500">
          {user.displayname} ({user.phone})
        </span>
        <span className="text-white bg-sky-400 text-xs p-1 mx-2 rounded-md ">
          {USERS_LEVELS[user.level]}
        </span>
      </div>
      <ProgressView show={loading} />

      {false && (
        <div className="bg-neutral-100  max-h-[280pt] overflow-hidden mb-8 w-fit">
          <img
            className=" object-fit w-[100%] "
            src={
              "https://cdn-prod.medicalnewstoday.com/content/images/articles/327/327331/a-radiologist-busy-looking-at-some-x-rays.jpg"
            }
          />
          ;
        </div>
      )}

      <MyCarousel />

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
