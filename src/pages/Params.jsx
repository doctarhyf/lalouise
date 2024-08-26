import React, { useEffect, useState } from "react";
import cloud from "../assets/cloud.png";
import ActionButton from "../comps/ActionButton";
import ImageItemContainer from "../comps/ImageItemContainer";
import PageHeader from "../comps/PageHeader";
import { GetAllItemsFromTable, supabase, TABLE_NAME, Upsert } from "../db/sb";
import { UploadFile } from "../helpers/FileUpload";
import { useNavigate } from "react-router-dom";

const MAX_PROMO_COUNT = 6;

export default function Params() {
  const [images, setimages] = useState();
  const [loading, setloading] = useState(false);
  const [count, setcount] = useState();
  const [defaults, setdefaults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadDefaults();
  }, []);

  async function loadDefaults() {
    let defs = await GetAllItemsFromTable(TABLE_NAME.PROMO, "id", true);

    console.log("DEFS", defs);
    setcount(defs.length);
    setdefaults(defs);
  }

  async function uploadFiles(supabase) {
    // try {
    setloading(true);

    const promos = Object.values(images);
    //1.upload images
    console.log("images", images);
    console.log("promos", promos);

    const uploadPromises = promos.map(async (img) => {
      const pms1 = UploadFile(supabase, img.file, "lalouise", true, img.idx);
      return pms1;
    });

    const uploadPromisesRes = await Promise.all(uploadPromises);

    console.log("uploadPromisesRes", uploadPromisesRes);

    const promisesSaveRecords = uploadPromisesRes.map(async (p, i) => {
      const data = { id: parseInt(p.tag), url: p.publicUrl, active: true };
      console.log("data", data);
      return await Upsert(data, TABLE_NAME.PROMO);
    });

    const promisesSaveRecordsRes = await Promise.all(promisesSaveRecords);

    if (promisesSaveRecordsRes.every((it) => it[0].id !== undefined)) {
      alert("Les photos promos ont etes toutes mises a jour avec succes!");
      setloading(false);
      navigate("/lalouise/");
    }

    console.log("promisesSaveRecordsRes", promisesSaveRecordsRes);
    setloading(false);
    return;
  }

  useEffect(() => {
    //console.log(images);
  }, [images]);

  function onImageSelectChange(d) {
    setimages(d);
  }

  return (
    <div className="p-8 container">
      <PageHeader
        title="Parametres"
        sub="Tous les parametres du systems"
        loading={loading}
      />

      <div>
        <div>Nombre de photos promo</div>
        <select
          onChange={(e) => {
            const parsedval = parseInt(e.target.value);
            setcount(parsedval);
          }}
        >
          {[...Array(MAX_PROMO_COUNT)].map(
            (it, i) =>
              i > 0 && (
                <option selected={i === count} value={i}>
                  {i} Image(s)
                </option>
              )
          )}
        </select>
      </div>

      <ImageItemContainer
        count={count}
        defaults={defaults}
        onImageSelectChange={onImageSelectChange}
      />

      {loading ? (
        <span className="loading" />
      ) : (
        <ActionButton
          icon={cloud}
          title={"SAVE"}
          onClick={(e) => uploadFiles(supabase)}
        />
      )}
    </div>
  );
}
