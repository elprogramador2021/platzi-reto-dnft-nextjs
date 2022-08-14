import React, { useState, useEffect } from "react"
import ImageUploading from "react-images-uploading"
import { Button, Input, useNotification, Card, Skeleton, Typography, CopyButton } from "web3uikit"
import NftCard from "./NftCard"
import { useWeb3Contract, useMoralis, useMoralisQuery } from "react-moralis" //import { useMoralisQuery, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { BsFillFileEarmarkImageFill } from "react-icons/bs"
import { IoIosAddCircle, IoIosRemoveCircle } from "react-icons/io"

const UploaderImages = () => {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const keeperFlower = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [imagesObj, setImagesObj] = useState([])
    const [imagesURI, setImagesURI] = useState([])
    const [crearNFTs, setCrearNFTs] = useState(false)
    const maxNumber = 5

    //
    const [tokensId, setTokensId] = useState([])

    const [isLoadingSuccess, setIsLoadingSucess] = useState(false)

    const dispatch = useNotification()

    const templateURI = {
        name: "",
        description: "",
        image: "",
        attributes: [
            {
                "trait-type": "AtributoUno",
                value: "",
            },
            {
                "trait-type": "AtributoDos",
                value: "",
            },
        ],
    }
    //
    //Get NFTs by Address
    const { runContractFunction: getTokensId } = useWeb3Contract({
        abi: abi,
        contractAddress: keeperFlower,
        functionName: "getTokensId",
        params: {},
    })
    //Mint NFT
    const {
        runContractFunction: safeMint,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: keeperFlower,
        functionName: "safeMint",
        params: { to: account, _ifpsUris: imagesURI },
    })

    const getAllMyTokensId = async () => {
        let tokensId = await getTokensId()

        let myTokensId = []
        tokensId.map((t) => {
            myTokensId.push(parseInt(t))
        })

        setTokensId(myTokensId)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getAllMyTokensId()
        }
    }, [isWeb3Enabled])

    const onChange = (imageList, addUpdateIndex) => {
        imageList.map((i) => {
            if (i.metadata == undefined) {
                i.metadata = templateURI
            }
        })
        setImagesObj(imageList)
    }

    const onChangeMetaData = (index, field, idx, value) => {
        let newImages = [...imagesObj]
        if (field) newImages[index].metadata[field] = value
        else newImages[index].metadata.attributes[idx].value = value
        setImagesObj(newImages)
    }

    const UploadMetaData = async () => {
        //Upload Images To Pinata
        let urisimg = []
        await Promise.all(
            imagesObj.map(async (obj) => {
                await sendFileToIPFS(obj, urisimg)
            })
        )
        setImagesURI(urisimg)
    }

    const MinNFT = async () => {
        //Mintear NFT
        await safeMint({ onSuccess: handleSuccess })
    }

    const sendFileToIPFS = async (obj, urisimg) => {
        await fetch("https://dnft-platzi-reto-pinata.herokuapp.com/api", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        })
            .then((response) => response.json())
            .then((response) => {
                urisimg.push(`ipfs://${response.IpfsHash}`)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleSuccess = async (tx) => {
        setIsLoadingSucess(true)
        await tx.wait(1)
        hadleNewNotification(tx)

        setIsLoadingSucess(false)
        //Limpiar Campos
        LimpiarCampos()

        setCrearNFTs(false)
        //Refrescar TokensId
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

    const LimpiarCampos = () => {
        setImagesObj([])
        setImagesURI([])
    }
    return (
        <div className="App">
            <div className="px-4 flex justify-center">
                <Button
                    size="large"
                    color="blue"
                    onClick={() => setCrearNFTs(!crearNFTs)}
                    text={
                        <span className="flex">
                            <IoIosAddCircle />
                            {crearNFTs ? "Ver NFT" : "Crear NFTs"}
                        </span>
                    }
                    theme="colored"
                />
            </div>
            {isLoading ||
                isFetching ||
                (isLoadingSuccess && (
                    <div
                        style={{
                            padding: "20px 0 20px 0",
                        }}
                    >
                        <div className="text-center">
                            <div role="status">
                                <svg
                                    className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-50 fill-gray-50 dark:fill-gray-300"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            </div>
                            <div className="pt-5 text-white">
                                {isLoadingSuccess ? (
                                    <span>Processing Transaction...</span>
                                ) : (
                                    <span>Loading...</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            {crearNFTs ? (
                <ImageUploading
                    multiple
                    value={imagesObj}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                    acceptType={["jpg", "png"]}
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                    }) => (
                        <div className="upload__image-wrapper">
                            <div className="w-screen flex flex-row justify-evenly p-2">
                                <div>
                                    <div className="pb-2 pr-2">
                                        <Button
                                            size="large"
                                            color={isDragging ? "red" : "blue"}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                            text={
                                                <span className="flex">
                                                    <BsFillFileEarmarkImageFill />
                                                    Choose one by one
                                                </span>
                                            }
                                            theme="colored"
                                        />
                                    </div>
                                    <div className="pb-2 pr-2">
                                        <Button
                                            size="large"
                                            color="red"
                                            onClick={onImageRemoveAll}
                                            {...dragProps}
                                            text={
                                                <span className="flex">
                                                    <BsFillFileEarmarkImageFill />
                                                    Remove All Images
                                                </span>
                                            }
                                            theme="colored"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="pb-2 pr-2">
                                        <Button
                                            color="blue"
                                            onClick={
                                                imagesObj.length == maxNumber
                                                    ? UploadMetaData
                                                    : function noRefCheck() {}
                                            }
                                            text={
                                                imagesObj.length == maxNumber
                                                    ? "Upload NFT"
                                                    : `You must add ${maxNumber} images`
                                            }
                                            theme={
                                                imagesObj.length == maxNumber
                                                    ? "colored"
                                                    : "translucent"
                                            }
                                        />
                                    </div>
                                    <div className="pb-2 pr-2">
                                        <Button
                                            color="blue"
                                            onClick={
                                                imagesURI.length == maxNumber
                                                    ? MinNFT
                                                    : function noRefCheck() {}
                                            }
                                            text="Mint my NFT"
                                            theme={
                                                imagesURI.length == 4 ? "colored" : "translucent"
                                            }
                                        />
                                    </div>
                                    {imagesObj.length == 0 && (
                                        <div className="pb-2 pr-2">
                                            <Button
                                                color="blue"
                                                onClick={MinNFT}
                                                text="Mint NFT Flower"
                                                theme="colored"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center">
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item p-2">
                                        <div className="flex flex-col  bg-white">
                                            <img
                                                src={image.data_url}
                                                alt=""
                                                className="object-fit h-48  w-full"
                                            />
                                            <div>
                                                <div className="py-4 px-2">
                                                    <Input
                                                        label="Name"
                                                        name="Name"
                                                        onBlur={function noRefCheck() {}}
                                                        onChange={(e) =>
                                                            onChangeMetaData(
                                                                index,
                                                                "name",
                                                                null,
                                                                e.target.value
                                                            )
                                                        }
                                                        value={image.metadata.name}
                                                    />
                                                </div>
                                                <div className="py-4 px-2">
                                                    <Input
                                                        label="Description"
                                                        name="Description"
                                                        onBlur={function noRefCheck() {}}
                                                        onChange={(e) =>
                                                            onChangeMetaData(
                                                                index,
                                                                "description",
                                                                null,
                                                                e.target.value
                                                            )
                                                        }
                                                        value={image.metadata.description}
                                                    />
                                                </div>
                                                <div className="py-4 px-2">
                                                    <Input
                                                        label="Atribute 1"
                                                        name="Atribute1"
                                                        onBlur={function noRefCheck() {}}
                                                        onChange={(e) =>
                                                            onChangeMetaData(
                                                                index,
                                                                null,
                                                                0,
                                                                e.target.value
                                                            )
                                                        }
                                                        value={image.metadata.attributes[0].value}
                                                    />
                                                </div>
                                                <div className="py-4 px-2">
                                                    <Input
                                                        label="Atribute 2"
                                                        name="Atribute2"
                                                        onBlur={function noRefCheck() {}}
                                                        onChange={(e) =>
                                                            onChangeMetaData(
                                                                index,
                                                                null,
                                                                1,
                                                                e.target.value
                                                            )
                                                        }
                                                        value={image.metadata.attributes[1].value}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-evenly bg-white pb-3  image-item__btn-wrapper">
                                            <Button
                                                size="regular"
                                                color="blue"
                                                onClick={() => onImageUpdate(index)}
                                                text={<IoIosAddCircle />}
                                                theme="colored"
                                            />
                                            <Button
                                                size="regular"
                                                color="red"
                                                onClick={() => onImageRemove(index)}
                                                text={<IoIosRemoveCircle />}
                                                theme="colored"
                                            />
                                        </div>
                                        <div className="text-center rounded-b-lg bg-white pb-2">
                                            {imagesURI[index] && <NftURI URI={imagesURI[index]} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ImageUploading>
            ) : (
                <div className="flex flex-wrap justify-center ">
                    {tokensId.map((t) => {
                        return <NftCard key={t} id={t} getAllMyTokensId={getAllMyTokensId} />
                    })}
                </div>
            )}
        </div>
    )
}

const NftURI = ({ URI }) => {
    const notify = useNotification()

    return (
        <div>
            <Typography variant="body18">
                {URI.slice(0, 10)}...{URI.slice(URI.length - 6)}
            </Typography>
            <CopyButton
                text={URI}
                revertIn={6500}
                onCopy={() =>
                    notify({
                        type: "success",
                        message: "Copied to clipboard",
                        title: "New Notification",
                        position: "bottomR",
                    })
                }
            />
        </div>
    )
}

export default UploaderImages
