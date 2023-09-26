import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Login } from "../helpers/funcs";

const supabase = createClient(
  "https://akttdrggveyretcvkjmq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdHRkcmdndmV5cmV0Y3Zram1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0NDkxOTEsImV4cCI6MTk5MjAyNTE5MX0.TRlHZBaUdW_xbeGapzEJSgqMFiThymQqLsGGYEhRL5Q"
);

export async function RemoveAllItemsFromTable(tableName) {
  const { error } = await supabase.from(tableName).delete();

  ////console.log("RemoveAllItemsFromTable", error);
  return error;
}

export const EmptyTable = RemoveAllItemsFromTable;

export async function CountItemsInTable(tableName = TABLE_NAME.MEDS) {
  let count = "-";
  let { data: inf_, error } = await supabase.from(tableName).select("*");

  count = inf_.length;

  if (error) return "--";

  return count;
}

export async function UpdateInfRoulement(updateID, day, val) {
  //////console.log("UpdateInfRoulement");

  let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, updateID);
  let rl = inf.roulement;

  ////console.log("b4 --> roulement : ", rl, `, rl[${day}]`, rl[day]);

  rl[day] = val;
  inf.roulement = rl;

  UpdateItem(TABLE_NAME.INFIRMIERS, updateID, inf);

  ////console.log("aftr --> roulement : ", rl, `, rl[${day}]`, rl[day]);
}

export async function GetAllItemsFromTable(tableName = TABLE_NAME.MEDS) {
  let items = [];

  let { data, error } = await supabase.from(tableName).select("*");
  items = data;

  if (error) return error;
  ////console.log("GetAllItemsFromTable", data, error);
  return items;
}

export async function GetAllItemsFromTableByColEqVal(
  tableName = TABLE_NAME.MEDS,
  colName,
  val
) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq(colName, val);

  if (error) return error;

  return data;
}

export async function GetItemByID(tableName, itemID) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", itemID);

  if (error) return error;
  ////console.log("GetAllItemsFromTable", data, error);
  return data;
}

export async function UpdateItem(
  tableName,
  id,
  updData,
  onUpdateFinished,
  onUpdateError
) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updData)
    .eq("id", id)
    .select();

  if (error) {
    if (onUpdateError) onUpdateError(error);
    //console.log(error);
    return error;
  }
  if (onUpdateFinished) onUpdateFinished(data);

  //console.log(data);
  return data;
}

export async function DeleteFileFromBucket(
  storageFilePath,
  onFileDeleted,
  onFileDeleteError
) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAMES.PATIENTS_PHOTO)
    .remove([storageFilePath]);

  if (error) {
    if (onFileDeleteError) onFileDeleteError(error);
    //console.log(error);
    return;
  }

  onFileDeleted(data);
  //console.log(data);
}

export async function DeleteItem(tableName, id, onItemDeleted) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (onItemDeleted) onItemDeleted(error);

  return error;
}

export async function AddNewItemToTable(
  newItem,
  tableName = TABLE_NAME.MEDS,
  onItemAdded = null,
  onAddItemError
) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([newItem])
    .select();

  ////console.log("AddNewItemToTable", data, error);
  if (error) {
    //console.log(error);
    if (onAddItemError) onAddItemError(error);
    return;
  }

  if (onItemAdded) onItemAdded(data);

  return data;
}

export const TABLE_NAME = {
  MEDS: "med_",
  INFIRMIERS: "inf_",
  PATIENTS: "pat_",
  DEPENSES: "dep_",
  MED_SELLS_REC: "sellrec_",
  PAYMENTS: "payments",
  USERS: "users",
};

export const BUCKET_NAMES = {
  PATIENTS_PHOTO: "patients_photo",
};

export function GetBucketFilePublicUrl(filePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAMES.PATIENTS_PHOTO)
    .getPublicUrl(filePath);

  return data;
}

export async function UploadFile(
  file,
  onUploadProgress,
  onUploadError,
  onFileUploaded
) {
  //console.log("uploading ...");

  /*  const { data, error } = await supabase.storage.getBucket(
    BUCKET_NAMES.PATIENTS_PHOTO
  );
 */

  if (file === undefined) {
    console.log(
      "File load error file is undefined! Select another file please!"
    );
    return;
  }

  let fileName = `${uuidv4()}.${
    file.name.split(".")[file.name.split(".").length - 1]
  }`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAMES.PATIENTS_PHOTO)
    .upload(`photos/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    //console.log(error);
    onUploadError(error);
    return;
  }

  //console.log();
  onFileUploaded(data);
  return data;
}

const SIXTY_MIN_IN_MILLIS = 3.6e6;

export async function CheckUserExists(phone, password, onSuccess, onFailure) {
  // console.log("Trying to login ...\nphone ", phone, "\npassword: ", password);

  let { data, error } = await supabase
    .from(TABLE_NAME.USERS)
    .select("*")
    .eq("phone", phone)
    .eq("password", password);

  if (error || data.length !== 1) {
    const errordata = { error: error, data: data };

    //console.log(errordata);
    if (onFailure) onFailure(errordata);
    return errordata;
  }

  if (data.length === 1) {
    let userdata = data[0];
    userdata.last_login = new Date().getTime();
    userdata.login_expires = userdata.last_login + SIXTY_MIN_IN_MILLIS;

    if (onSuccess) onSuccess(userdata);
    //console.log(userdata);
  }
  return data;
}
