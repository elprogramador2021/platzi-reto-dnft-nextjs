import React from "react"
import { AiFillGithub } from "react-icons/ai"
import { IoMdFlower } from "react-icons/io"

const Footer = () => {
    return (
        <div className="p-2 bg-black">
            <footer class=" bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-black">
                <span class="text-sm text-slate-200 sm:text-center dark:text-slate-200">
                    <a href="https://flowbite.com/" class="hover:underline flex items-center">
                        <IoMdFlower size={26} />
                        platziretoDNFT - 2022
                    </a>
                </span>
                <ul class="flex flex-wrap items-center mt-3 text-sm text-slate-200 dark:text-slate-200 sm:mt-0">
                    <li>
                        <a
                            href="https://github.com/elprogramador2021"
                            target="_blank"
                            class="mr-4 hover:underline md:mr-6 flex items-center"
                        >
                            <AiFillGithub size={26} /> Follow me in my Github
                        </a>
                    </li>
                </ul>
            </footer>
        </div>
    )
}

export default Footer
