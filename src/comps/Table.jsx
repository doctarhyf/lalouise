import React from "react";


function Td({data, w = '40px'}){

   

    return (
        // <td className={` ${ w ? 'w-['+ w + '] inline-block' : ''} border border-slate-500 p-2  `}>{ data }</td>
        <td className="w-[100px] border border-slate-500">{ data }</td>
    )
}


function Tr({data, dataObj}){

    
    
    return(
        <tr>
            { data && data.map((d, i) => <Td key={i} data={d} /> ) }
            { dataObj && Object.keys(dataObj).sort().map((k, i) => <Td key={i} data={dataObj[k]} /> ) }
        </tr>
    )
}

export {Td, Tr}


