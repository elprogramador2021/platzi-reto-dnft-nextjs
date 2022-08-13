import React from "react"
import { IoMdFlower } from "react-icons/io"
import { ConnectButton, Button } from "web3uikit"

const Header = () => {
    return (
        <header className="sticky top-0 z-50 h-14 flex bg-black text-slate-200 px-2 ">
            <div className="flex flex-row justify-start items-center w-screen">
                <IoMdFlower size={40} />
                <div className="text-1xl hover:text-base">platziretoDNFT</div>
            </div>

            <div className="flex flex-row justify-end items-center w-screen">
                <ConnectButton moralisAuth={false} />
            </div>
        </header>
    )
}

export default Header
