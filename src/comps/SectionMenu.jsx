import React from "react"



export default function SectionMenu({ sectionsData, onChangeSection, selectedSection }){

    const selClass = 'text-sky-500 border-b-sky-500 bg-sky-500 text-white'

    return (
        <div className="mb-8 flex flex-col md:flex-row border border-white border-b-sky-500">
                
               
                {
                    Object.keys(sectionsData).map((k, i) => <button key={k} name={sectionsData[k].name} onClick={onChangeSection} className={`px-2 mx-4 border border-white ${ selectedSection === sectionsData[k].name ? selClass : 'hover:text-sky-500'}  hover:border-b-sky-500   rounded-tl-[6pt] rounded-tr-[6pt] `} >{ sectionsData[k].title }</button>)
                }
            </div>
    )
}