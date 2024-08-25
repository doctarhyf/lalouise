import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../comps/PageHeader";
import ImageItemContainer from "../comps/ImageItemContainer";
import { UploadFile } from "../helpers/FileUpload";
import { supabase, AddNewItemToTable, TABLE_NAME, Upsert } from "../db/sb";
import ActionButton from "../comps/ActionButton";
import cloud from "../assets/cloud.png";

export default function Params() {
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const [images, setimages] = useState();
  const [loading, setloading] = useState(false);

  async function uploadFiles(supabase) {
    try {
      setloading(true);
      const [img1, img2, img3] = Object.values(images);
      //1.upload images
      const pms1 = await UploadFile(supabase, img1.file, "lalouise", true);
      const pms2 = await UploadFile(supabase, img2.file, "lalouise", true);
      const pms3 = await UploadFile(supabase, img3.file, "lalouise", true);
      //2.save data
      const photos = [pms1.publicUrl, pms2.publicUrl, pms3.publicUrl];

      const r = photos.map(
        async (p, i) =>
          await Upsert({ id: i, url: p, active: true }, TABLE_NAME.PROMO)
      );
      console.log(r);
      const pr = await Promise.all(r);

      console.log(pr);
      setloading(false);
    } catch (e) {
      alert(`Error upload data \n ${JSON.stringify(e)} `);
      setloading(false);
    }
  }

  useEffect(() => {
    console.log(images);
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

      <ImageItemContainer
        count={3}
        titles={["Bon", "Truck Front", "Truck Side"]}
        onImageSelectChange={onImageSelectChange}
      />

      <ActionButton
        icon={cloud}
        title={"SAVE"}
        onClick={(e) => uploadFiles(supabase)}
      />

      {/* <div className=" flex gap-4 flex-col sm:flex-row ">
        {[...Array(4)].map((promoSlide, i) => (
          <ImageItem
            idx={i}
            title={`Image ${i}`}
            onImageDataSet={(e) => console.log(e)}
          />
        ))}
      </div> */}
    </div>
  );
}
