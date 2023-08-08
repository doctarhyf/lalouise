import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false)

async function pbCountItemsInTable(tableName = TABLE_NAME.MEDS){
   
    const items = await pbGetAllItemsFromTable(tableName)
    return items.length
}

async function pbGetAllItemsFromTable(tableName = TABLE_NAME.MEDS){
    let resultList = null;
    try{
        resultList = await pb.collection(tableName).getList(1, 50, {'$autoCancel': false });
    }catch(e){
        console.warn("❌Pocket base error!x Check pocket base connection please.❌\n'😥Try to run './pocketbase' on your terminal, to start pocketbase server😥", e)
    } 
    return resultList.items;
}

async function pbUpdateItem(tableName, id, data){
    
    data.id = id;
    const rec = await pb.collection(tableName).update(id, data);
   
    return rec;
}

async function pbDeleteItem(tableName, id){
    const rec  = await pb.collection(tableName).delete(id)

    return rec;
}

async function pbAddNewItemToTable(newItem, tableName = TABLE_NAME.MEDS){
    
    const rec = await pb.collection(tableName).create(newItem)
    console.warn(rec);
    console.warn(`adding new item to table ${tableName}`, newItem)
}

async function pbGetItemByID(tableName, itemID){
    const item = await pb.collection(tableName).getOne(itemID);

    console.log('Getting item ==> '   , tableName, itemID)

    return item;
}

async function pbUpdateInfRoulement(updateID, day, val){
    let inf = await pbGetItemByID(TABLE_NAME.INFIRMIERS, updateID)
    let rl = inf.roulement;

    console.log('b4 --> roulement : ', rl, `, rl[${day}]`, rl[day])

    rl[day] = val;
    inf.roulement = rl;

    pbUpdateItem(TABLE_NAME.INFIRMIERS, updateID, inf);

    console.log('aftr --> roulement : ', rl, `, rl[${day}]`, rl[day])
    
}

async function pbRemoveAllItemsFromTable(tableName){
    const items = await pbGetAllItemsFromTable(tableName);

    items.map(async (it, i) => {
        await pbDeleteItem(tableName, it.id);
    })
}

async function pUpdateInfRoulement(updateID, day, val){

    let inf = await pGetItemByID(TABLE_NAME.INFIRMIERS, updateID)
    let rl = inf.roulement;

    console.log('b4 --> roulement : ', rl, `, rl[${day}]`, rl[day])

    rl[day] = val;
    inf.roulement = rl;

    pbUpdateItem(TABLE_NAME.INFIRMIERS, updateID, inf);

    console.log('aftr --> roulement : ', rl, `, rl[${day}]`, rl[day])
}

async function pbEmptyTable(tableName){
    return
}

const TABLE_NAME = { MEDS:'med_', INFIRMIERS: 'inf_', PATIENTS:'pat_', DEPENSES:'dep_', MED_SELLS_REC:'sellrec_' }


export {
    pbEmptyTable,
    pUpdateInfRoulement,
    pbUpdateInfRoulement,
    pbGetItemByID,
    pbRemoveAllItemsFromTable,
    pbAddNewItemToTable,
    pbUpdateItem,
    pbDeleteItem,
    pbGetAllItemsFromTable,
    pbCountItemsInTable,
    TABLE_NAME

}


//schemas

const dep_ = {
    "desc": "carburant",
    "amount": "75000",
    "date": "2023-06-27",
    "id": "dep_q3t1d"
}

const inf_ = {
    "nom": "Gracia Liwena",
    "phone": "0892125047",
    "grade": "IT",
    "team": "D",
    "roulement": [
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J",
        "J"
    ],
    "id": "inf_fhx82"
}

const pat_ = {
    "emergContact": {
        "nom": "Alice Liwena",
        "phone": "0812651723",
        "add": "USA Maryland"
    },
    "nom": "Franvale Mutunda",
    "phone": "0893092849",
    "add": "2220 Av des aviat II",
    "dob": "2023-06-27T00:06:11.124Z",
    "poids": 65,
    "taille": 165,
    "vaccVaricelle": true,
    "vaccMeasles": true,
    "hepC": false,
    "autre": "Pas d'autres maladies ",
    "id": "pat_s1ox9"
}

const med_ = {
    "medName": "quinine ",
    "medAmount": "10",
    "medType": "comprime",
    "medPrice": "2500",
    "medSoldBy": "",
    "id": "med_o991y"
}