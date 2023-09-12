import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://akttdrggveyretcvkjmq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdHRkcmdndmV5cmV0Y3Zram1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0NDkxOTEsImV4cCI6MTk5MjAyNTE5MX0.TRlHZBaUdW_xbeGapzEJSgqMFiThymQqLsGGYEhRL5Q"
);

////console.log(supabase);

export async function RemoveAllItemsFromTable(tableName) {
  const { error } = await supabase.from(tableName).delete();

  //console.log("RemoveAllItemsFromTable", error);
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
  ////console.log("UpdateInfRoulement");

  let inf = await GetItemByID(TABLE_NAME.INFIRMIERS, updateID);
  let rl = inf.roulement;

  //console.log("b4 --> roulement : ", rl, `, rl[${day}]`, rl[day]);

  rl[day] = val;
  inf.roulement = rl;

  UpdateItem(TABLE_NAME.INFIRMIERS, updateID, inf);

  //console.log("aftr --> roulement : ", rl, `, rl[${day}]`, rl[day]);
}

export async function GetAllItemsFromTable(tableName = TABLE_NAME.MEDS) {
  let items = [];

  let { data, error } = await supabase.from(tableName).select("*");
  items = data;

  if (error) return error;
  //console.log("GetAllItemsFromTable", data, error);
  return items;
}

export async function GetItemByID(tableName, itemID) {
  let { data, error } = await supabase
    .from(tableName)
    .select("*")
    .eq("id", itemID);

  if (error) return error;
  //console.log("GetAllItemsFromTable", data, error);
  return data;
}

export async function UpdateItem(tableName, id, updData) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updData)
    .eq("id", id)
    .select();

  if (error) return error;
  //console.log("UpdateItem", data, error);
  return data;
}

export async function DeleteItem(tableName, id) {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  //console.log("DeleteItem", error);

  return error;
}

export async function AddNewItemToTable(
  newItem,
  tableName = TABLE_NAME.MEDS,
  onItemAdded = null
) {
  const { data, error } = await supabase
    .from(tableName)
    .insert([newItem])
    .select();

  //console.log("AddNewItemToTable", data, error);
  if (error) {
    //console.log(error);
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
};
