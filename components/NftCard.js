import React, { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis, useMoralisQuery } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import Image from "next/image"
import { Button, Input, useNotification, Card, Skeleton, Loading } from "web3uikit"

const NftCard = ({ id, getAllMyTokensId }) => {
    const [tokenIdActual, setTokensIdActual] = useState(id)
    const [tokenActual, setTokenActual] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const keeperFlower = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

    //getURI of NFT
    const { runContractFunction: tokenURI } = useWeb3Contract({
        abi: abi,
        contractAddress: keeperFlower,
        functionName: "tokenURI",
        params: { tokenId: tokenIdActual },
    })
    //burn NFT
    const { runContractFunction: burnToken } = useWeb3Contract({
        abi: abi,
        contractAddress: keeperFlower,
        functionName: "burnToken",
        params: { tokenId: tokenIdActual },
    })

    useEffect(() => {
        getTokenURI()
    }, [])

    const getTokenURI = async () => {
        let uriIpfs = await tokenURI()
        let uriResponse = await (
            await fetch(uriIpfs.replace("ipfs://", "https://ipfs.io/ipfs/"))
        ).json()
        uriResponse.image = uriResponse.image.replace("ipfs://", "https://ipfs.io/ipfs/")

        setTokenActual(uriResponse)
    }

    const burnMyToken = async () => {
        await burnToken({ onSuccess: handleSuccess })
    }

    const handleSuccess = async (tx) => {
        setIsLoading(true)
        await tx.wait(1)
        hadleNewNotification(tx)
        setIsLoading(false)
        getAllMyTokensId()
    }

    const hadleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Completed!",
            title: "Tx Notification",
            position: "bottomR",
            icon: "bell",
        })
    }
    return (
        <div className="m-2 w-64" id={id}>
            <Card
                description={tokenActual.description}
                onClick={function noRefCheck() {}}
                setIsSelected={function noRefCheck() {}}
                title={tokenActual.name}
                tooltipText={
                    <div>
                        <div className="flex ">
                            {tokenActual.attributes &&
                                `${tokenActual.attributes[0]["trait-type"]}: ${tokenActual.attributes[0]["value"]}`}
                        </div>
                        <div className="flex pt-2">
                            {tokenActual.attributes &&
                                `${tokenActual.attributes[1]["trait-type"]}: ${tokenActual.attributes[1]["value"]}`}
                        </div>
                    </div>
                }
            >
                <div>
                    {tokenActual.image ? (
                        <Image
                            loader={() => tokenActual.image}
                            src={tokenActual.image}
                            height="200"
                            width="200"
                        />
                    ) : (
                        <Skeleton theme="image" height="200px" width="200px" />
                    )}
                </div>
                <div className="flex justify-center">
                    <div className="px-1">
                        <Button color="blue" onClick={getTokenURI} text="Update" theme="colored" />
                    </div>
                    <div className="px-1">
                        <Button
                            color="red"
                            onClick={burnMyToken}
                            text={
                                !isLoading ? (
                                    <span>Burn</span>
                                ) : (
                                    <div className="py-2">
                                        <Loading size={12} spinnerColor="red" spinnerType="wave" />
                                    </div>
                                )
                            }
                            theme="colored"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default NftCard
