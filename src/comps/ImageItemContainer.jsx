import { useEffect, useState } from "react";
import { ImageItem } from "./ImageItem";

export default function ImageItemContainer({
  count,
  titles,
  onImageSelectChange,
}) {
  const [images, setImages] = useState({});

  useEffect(() => {
    onImageSelectChange(images);
  }, [images]);

  function onImageDataSet(idx, data) {
    setImages((old) => ({ ...old, [idx]: data }));
  }

  return (
    <div className=" md:flex ">
      {[...Array(count)].map((it, i) => (
        <ImageItem idx={i} onImageDataSet={onImageDataSet} title={titles[i]} />
      ))}
    </div>
  );
}
