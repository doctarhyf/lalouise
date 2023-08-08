


async function AddNewItemToTable(newItem, tbPref = 'med_'){
    
    const id = tbPref + RandID();
    newItem.id = id;
    await localStorage.setItem(id, JSON.stringify(newItem))
    //const size = localStorage.length;

    console.warn(`adding new item with prefix ${tbPref}`, newItem)
}

async function DeleteItem(id){
    localStorage.removeItem(id);
}

async function EmptyTable(tablePrefix){
   

    for (var i = 0; i < localStorage.length; ++i){

        const key = localStorage.key(i)
       
        if(key.startsWith(tablePrefix)){
            localStorage.removeItem(key)
        }
        
        
    }

}

async function UpdateMed(newMed){
    
    
    localStorage.removeItem(newMed.id);
    await localStorage.setItem(newMed.id, JSON.stringify(newMed))
   
}

async function UpdateItem(id, data){
    
    data.id = id;
    localStorage.removeItem(id);
    await localStorage.setItem(id, JSON.stringify(data))
   
}

function RandID(){
    return (Math.random() + 1).toString(36).substring(7);
}

function GetAllItemsFromTable(tablePrefix = TABLE_PREFIX.MEDS){

    //console.warn(`loading items starting with ${tablePrefix}`)

    var items  =  [];

    for (var i = 0; i < localStorage.length; i++){

        const key = localStorage.key(i)
        const it = localStorage.getItem(key);
        
        if(key.startsWith(tablePrefix)){
            items.push(JSON.parse(it));
        }
        
        
    }

    //l(items);
    return items;
}

async function RemoveAllItemsFromTable(tbPref = 'med_'){
    l(`count : ${localStorage.length}`)
    for (var i = 0; i < localStorage.length; i++){

        const key = localStorage.key(i)
        const it = localStorage.getItem(key);
        
        if(key.startsWith(tbPref)){
            localStorage.removeItem(key)
        }
        //l(it);
    }
}

function CountItemsInTable(tbPref){
    const items = GetAllItemsFromTable(tbPref);

    return items && items.length;
}

function l(d){
    //console.warn ('Pharmacy manager ...\n');
    console.log(d);
}

function GetItemByID(id){
    return localStorage.getItem(id);
}

function UpdateInfRoulement(updateID, day, val){

    

    let inf = JSON.parse(GetItemByID(updateID))
    let rl = inf.roulement;

    console.log('b4 --> roulement : ', rl, `, rl[${day}]`, rl[day])

    rl[day] = val;
    inf.roulement = rl;

    UpdateItem(updateID, inf);

    console.log('aftr --> roulement : ', rl, `, rl[${day}]`, rl[day])
    
}

const TABLE_PREFIX = { MEDS:'med_', INFIRMIERS: 'inf_', PATIENTS:'pat_', DEPENSES:'dep_', MED_SELLS_REC:'sellrec_' }

export {
    TABLE_PREFIX,
    EmptyTable,
    UpdateItem,
    CountItemsInTable,
    GetAllItemsFromTable,
    AddNewItemToTable,
    RemoveAllItemsFromTable,
    RandID,
    UpdateMed,
    DeleteItem,
    GetItemByID,
    UpdateInfRoulement
}