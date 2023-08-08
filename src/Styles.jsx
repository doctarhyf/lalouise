

const StyleInputText = `p-2 border w-10/12 border-gray-100 rounded-[6pt] focus:border focus:border-sky-500 focus:outline-none`
const  StyleInputSelect =  `p-2 border w-10/12 border-gray-100 rounded-[6pt] focus:border focus:bg-sky-500 focus:text-white focus:border-sky-500 focus:outline-none`


function StyleFormBlockTitle(col = 'green-500'){
    let style = `text-${col} text-xl`
    return style;
}

function StyleButton(color = 'sky-500'){
    
    let style = `cool p-1 m-1 rounded-[6pt] text-sm px-4 mx-4 hover:bg-${color} hover:text-white text-${color}  border border-${color} `

    return style;
}

function StyleButtonSmall(color = 'sky-500'){
    let style = `cool p-1 m-1 rounded-[4pt] text-[8pt] px-2 mx-2 hover:bg-${color} hover:text-white text-${color}  border border-${color} `

    return style;
}

export {
    StyleFormBlockTitle,
    StyleInputText,
    StyleInputSelect,
    StyleButton,
    StyleButtonSmall
}