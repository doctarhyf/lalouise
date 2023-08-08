import React, { useState } from "react"

import { createClient } from "@supabase/supabase-js"


const supabase = createClient(
    "https://akttdrggveyretcvkjmq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrdHRkcmdndmV5cmV0Y3Zram1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0NDkxOTEsImV4cCI6MTk5MjAyNTE5MX0.TRlHZBaUdW_xbeGapzEJSgqMFiThymQqLsGGYEhRL5Q"
)

export default function App2(){

    const [countries, setCountries] = useState([])

    useState(() => {
        getCountries();
    },[])


    async function getCountries(){
        const { data, error } = await supabase.from('pharm').select();
        setCountries(data)

        console.log(data,error)
    }

    return (
        <div>
            App 2
        </div>
    )
}