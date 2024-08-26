import { useRef, useState } from "react";
import ActionButton from "./ActionButton";
import upload from "../assets/upload.png";

export function ImageItem({ title, idx, def, onImageDataSet }) {
  const [imgdata, setimgdata] = useState({ b64: undefined, file: undefined });

  const reffile = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // setimgdata((old) => ({ ...old, file: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgb64 = reader.result;
        const imgdata = { file: file, b64: imgb64, idx: idx };
        setimgdata(imgdata);
        onImageDataSet(idx, imgdata);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div>{title || idx}</div>
      <div className=" w-full relative md:w-48 h-auto border shadow-lg shadow-black/25 bg-slate-600 rounded-md overflow-hidden border-slate-700    ">
        <img src={imgdata.b64 || def} className=" object-cover w-full  " />
      </div>
      <input
        hidden
        ref={reffile}
        type="file"
        className={
          "p-1 border rounded-md outline-none hover:border-sky-500 focus:border-purple-500"
        }
        onChange={handleFileChange}
      />

      <ActionButton
        icon={upload}
        title={"Selectioner Image"}
        onClick={(e) => reffile.current.click()}
      />
    </div>
  );
}
