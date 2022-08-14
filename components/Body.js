import React from "react"
import { Button } from "web3uikit"
import { IoIosAddCircle } from "react-icons/io"
import UploaderImages from "./UploaderImages"

const Body = () => {
    return (
        <div className="bg-slate-400 h-full overflow-auto w-full pt-2">
            <div>
                <UploaderImages />
            </div>
        </div>
    )
}

export default Body
