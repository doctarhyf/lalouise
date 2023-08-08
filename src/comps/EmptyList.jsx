import React from "react"

export default function EmptyList({title, sub}){
    return (
        <div className="flex p-8 text-center flex-col justify-center align-middle " >
            <div className=" text-3xl text-red-500 mb-8 text-center"> { title } </div>
            <div className=" text-gray-500"> { sub } </div>
        </div>
    )
}