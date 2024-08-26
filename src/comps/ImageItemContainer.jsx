import { useEffect, useState } from "react";
import { ImageItem } from "./ImageItem";
import { GetAllItemsFromTable, TABLE_NAME } from "../db/sb";

export default function ImageItemContainer({
  count,
  defaults,
  onImageSelectChange,
}) {
  const [images, setImages] = useState({});

  useEffect(() => {
    onImageSelectChange(images);

    //console.log(images);
  }, [images]);

  function onImageDataSet(idx, data) {
    setImages((old) => ({ ...old, [idx]: data }));
  }

  return (
    <div className=" md:flex gap-2 flex-wrap ">
      {[...Array(count)].map((it, i) => (
        <ImageItem
          idx={i}
          onImageDataSet={onImageDataSet}
          def={defaults && defaults[i]?.url}
          title={`Photo ${i + 1}`}
        />
      ))}
    </div>
  );
}
