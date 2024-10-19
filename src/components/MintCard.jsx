import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';

  import 'react-toastify/dist/ReactToastify.css';





function MintCard() {

   useEffect(() => {
     if(!window.tronWeb) {
        setWalletStatus("Make sure you have tron link installed")
      }else if(walletAddress){
        setWalletStatus("Mint")
    }else(
        setWalletStatus("Connect Wallet")

    )
    
  }, []);
    

  const trxIcon = <img src='/trx-red.svg' alt="trx" className='trxIcon' />;

    const [images, setImages] = useState({
        img1: "/3617.png",
        img2: "/3663.png",
        img3: "/3695.png",
        img4: "/3755.png",

    })

    const[activeImg, setActiveImg] = useState(images.img1)

    const [amount, setAmount] =useState(1)
    const [max, setMax] = useState(5)
     const [walletAddress, setWalletAddress] = useState(false);
  const [contractConnected, setContractConnected] = useState("");
  const [walletStatus, setWalletStatus] = useState("Loading...");
  const [totalMinted, setTotalMinted] = useState(0);
  const [alreadyMintedIds, setAlreadyMintedIds] = useState([]);
  const [txHash, setTxHash] = useState("") 



    const alreadyMinted = async () => {
    if (contractConnected != null) {
      contractConnected.totalSupply().call().then(res => {
        setTotalMinted(res.toNumber())
        setMax(150 - totalMinted >= 4 ? 4 : 150 - totalMinted)
      })
      contractConnected.totalSupplyId().call().then(res => setAlreadyMintedIds(res))
    }
  }

    const random = () => {
    const allId = Array.from({ length: 150 }, (_, i) => i + 1) // array which holds all values
    let alreadyMintedIdsInt = []
    alreadyMintedIds.map(id => alreadyMintedIdsInt.push(parseInt(id._hex)))

    const toDeleteSet = new Set(alreadyMintedIdsInt); //
    const newArr = allId.filter(remained => {
      return !toDeleteSet.has(remained);
    });

    const shuffled = newArr.sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, amount);
    return selected;
  }




    const onConnect = async () => {
     if(!window.tronWeb) {
        setWalletStatus("Make sure you have tron link installed")
      }else{
        setWalletStatus("Connect Wallet")

        try {
                await window.tronWeb.request({ method: "tron_requestAccounts" });
                const accounts = window.tronWeb.defaultAddress.base58

          console.log("Found an account! Address: ", accounts);
          setWalletAddress(accounts)
          console.log(walletAddress)

          const contractAdd = await window.tronWeb.contract().at("TRrTW5zP5xVKaGh95AxJ92E62n9z9L8Jwp")
        setContractConnected(contractAdd.address)
        console.log(contractConnected)
        setWalletStatus("Mint")   
         return(accounts)

        } catch (error) {
          console.error(error)
        }
         
      }
  };


   const mint = async () =>{

    try {
      const contractAdd = await window.tronWeb.contract().at("TRrTW5zP5xVKaGh95AxJ92E62n9z9L8Jwp")
    setContractConnected(contractAdd)
    console.log(contractConnected)
    let cost = amount * 10000000;
    console.log(walletAddress);

    if (walletAddress && contractConnected) {
      console.log(contractConnected);
      let idsToMint = random()

     const tx = await contractConnected.safePublicMint(walletAddress, idsToMint)
      .send({ callValue: cost })
      .catch(err => {
        console.log(err)
      });

      alreadyMinted()
      console.log("transaction");
      setTxHash(tx)
        if(tx){
          
    toast.success(`Mint Successfull:  ${tx}`, {position: "bottom-right"})
  }
     
    }
      
    } catch (error) {
      console.log(error)
    }
  
      
  }



  return (
    <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center'>
        <div className='flex flex-col gap-6 lg:w-2/5'>
            <img src={activeImg} alt="" className='w-full h-full aspect-square object-cover rounded-xl'/>
            <div className='flex flex-row justify-between h-24'>
                <img src={images.img1} alt="" className='w-24 h-24 rounded-md cursor-pointer' onClick={() => setActiveImg(images.img1)}/>
                <img src={images.img2} alt="" className='w-24 h-24 rounded-md cursor-pointer' onClick={() => setActiveImg(images.img2)}/>
                <img src={images.img3} alt="" className='w-24 h-24 rounded-md cursor-pointer' onClick={() => setActiveImg(images.img3)}/>
                <img src={images.img4} alt="" className='w-24 h-24 rounded-md cursor-pointer' onClick={() => setActiveImg(images.img4)}/> 
            </div>
        </div>

        <div className='flex flex-col gap-4 lg:w-2/4'>
            <div>
                <span className='text-violet-600 font-semibold'>Launchpad</span>
                <h1 className='text-3xl font-bold'>TronPunk V2</h1>
            </div>
            <p className='text-white'>Contract Address: TRrTW5zP5xVKaGh95AxJ92E62n9z9L8Jwp</p>

            <h6 className='text-lg font-semibold'> {trxIcon}{100 * amount} Trx</h6>
            <div className='flex flex-row items-center gap-12'>
                <div className='flex flex-row items-center'>
                    <button className='bg-gray-200 py-2 px-4 rounded-lg text-2xl text-violet-800' onClick={() => { if (amount >= 2) setAmount(amount - 1) }}>-</button>
                    <span className=' py-4 px-6 rounded-lg'>{amount}</span>


                    <button className='bg-gray-200 py-2 px-4 rounded-lg text-2xl text-violet-800'onClick={() => { if (amount > 0 && amount <= max - 1) setAmount(amount + 1) }}>+</button>

                </div>

                <div>{contractConnected ? <button className='bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full' onClick={() => {mint()}}>{walletStatus}</button> : <button className='bg-violet-800 text-white font-semibold py-3 px-16 rounded-xl h-full' onClick={() => {onConnect()}}>{walletStatus}</button> }   <ToastContainer /> </div>

            </div>

        </div>


    </div>
  )
}

export default MintCard