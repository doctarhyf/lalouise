
import React from "react"

export default function PageHeader({title, sub}){
    return (
        <div className="mb-8 border pb-2 border-b border-white border-b-sky-500">
            <h1 className="text-xl text-sky-500" >{title}</h1>
            <h5 className="text-gray-500">{sub}</h5>
        </div>
    )
}