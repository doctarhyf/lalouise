
const DummyStats = [
    {
        title:'Nombre des malades',
        data:50
    },
    {
        title:'Nombre de lits vides',
        data:27
    },
    {
        title:'Nombre des femmes enceintes',
        data:2
    },
    {
        title:'Nombre des infirmiers',
        data:36
    },
    {
        title:'Stock medicamant a ajouter',
        data:14
    }
]



function GetNumDaysInMonth(year = -1, month = -1){

    let y = year === -1 ? new Date().getFullYear()  : year;
    let m = month === -1 ? new Date().getMonth() + 1 : month ;
    return new Date(y, m, 0).getDate();
}

function CalcAge(dob) { 
    var dob = new Date("05/15/1989");
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();
    
    //convert the calculated difference in date format
    var age_dt = new Date(month_diff); 
    
    //extract year from date    
    var year = age_dt.getUTCFullYear();
    
    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    
    //display the calculated age
   return age;
}

function GetCurrentMonthName(len = -1){
    const date = new Date();  // 2009-11-10
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    return FirstCapital( len === -1 ? month : month.substring(0,len) );
}

function GetNumDaysCurMonth(){
    return GetNumDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1);
}

function FirstCapital(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
    DummyStats,
    FirstCapital,
    CalcAge,
    GetCurrentMonthName,
    GetNumDaysInMonth,
    GetNumDaysCurMonth
}