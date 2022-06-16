//React Imports
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

import { ETHERSCANKEY } from "../keys";

//Ethers Imports
import { ethers } from "ethers";

//Hooks
import { allTransactions } from "../hooks/endpoints";
import { SiIterm2, SiMomenteo } from "react-icons/si";




export default function CorrelateTool({currentEthPrice}) {


  //Hook Assignment
  const { walletAddress } = useParams();

  //State Assignment

    // Wallet 1
  const [walletAddress1, setWalletAddress1] = useState('');
    const [balance1, setBalance1] = useState();
    const [resolver1, setResolver1] = useState({});
    // Wallet 2
  const [walletAddress2, setWalletAddress2] = useState('');
    const [balance2, setBalance2] = useState();
    const [resolver2, setResolver2] = useState({});

  // Shared State
  const [stateTransactions, setTransactions] = useState({});

  //Ether Network and key
  const network = 'homestead';
  const provider = ethers.getDefaultProvider(network, {
    etherscan: ETHERSCANKEY,
  });

  //Async Hook Assignment

  //Returns the name associated with a hexidecimal address if reverse lookup is enabled
  async function getEthNamespace(hexidecimalAddress) {
    const nameString = await provider.lookupAddress(hexidecimalAddress);
    return nameString;
  }
  //Takes an ENS and returns an formatted eth balance
  async function getBalance(nameString) {
    console.log('ran ballance getter')
    const balance = await provider.getBalance(nameString)
    const finalBalance = await ethers.utils.formatUnits(balance, 'ether')
    return finalBalance;
  }
  //Get resolver ens contract resolver by name
  async function resolveByName(address) {
      const resolver = await provider.getResolver(address)
      return resolver
  }
  //Get email by resolver
  async function getEmailByResolver(resolver) {
    const email = await resolver.getText('email');
    return email
  }
  //get transaction data
  async function getTransactionData(address) {
    const response = await fetch(allTransactions(address, ETHERSCANKEY) )
      if (response.ok) {
        const transactions = await response.json();
        setTransactions(transactions.result)
      }
  }

  const parseAddress = () => {
    if ( !walletAddress1 ){ 
      if (walletAddress.slice(0,2) === '0x'){
        setWalletAddress1(walletAddress.slice(0,41))
        if (walletAddress.slice(43, 45) === '0x') {
          setWalletAddress2(walletAddress.slice(43,-1))
        }
      }
    }
  }
  async function getData() {
    console.log('getting data')
    console.log(walletAddress1, !balance1)
    if (walletAddress1 && !balance1){
      console.log('ran')
      let resp = await getBalance(walletAddress1)
      setBalance1(resp)
      console.log(balance1)
      console.log('set balance')
    }

    if (walletAddress2 && !balance2) {
      let resp = await getBalance(walletAddress2)
      setBalance2(resp)
    }

  }


  //On-Page-Load
  useEffect(() => {
    parseAddress()
    getData()
  }, [walletAddress1, walletAddress2]);


  return (
    <div className="justify-center rounded-1 bg-gray-200 w-10/12 p-3 min-w-fit">
      {/* <div className="Address rounded-sm bg-white drop-shadow p-2">{" Address: "+ walletAddress}</div> */}
      <div className="flex">

        <div className="grid-flex rounded-sm bg-white drop-shadow w-6/12 mr-2 p-4 ">
          <div className="font-medium">Wallet 1</div>
          <div className="font-light mb-0">{walletAddress1}</div>
          <div className="text-md mb-1">Ens Name</div>
          <div className="flex border-b p-1"> <div className="grow">ETH Balance: </div> <div>{walletAddress1 ? balance1 +' ETH' : "Loading..." } </div> </div>
          <div className="flex border-b p-1"> <div className="grow">USD Est. Value: </div> <div>{walletAddress1 ? "$"+(Math.round((balance1 * currentEthPrice) * 100) / 100).toFixed(2) : "Loading..."}</div></div>
          <div className="flex border-b p-1"> <div className="grow">Wallet Type</div> <div>Unknown</div> </div>
        </div>

        <div className="grid-flex rounded-sm bg-white drop-shadow w-6/12 ml-2 p-4 ">
          <div className="mb font-medium">Wallet 2</div>
          <div className="font-light mb-0">{walletAddress2}</div>
          <div className="text-md mb-1">Ens Name</div>
          <div className="flex border-b p-1"> <div className="grow">ETH Balance: </div> <div>{walletAddress2 ? balance2 +' ETH' : "Loading..." }</div> </div>
          <div className="flex border-b p-1"> <div className="grow">USD Est. Value: </div> <div>{walletAddress2 ? "$"+(Math.round((balance2*currentEthPrice) * 100) / 100).toFixed(2) : "Loading..."}</div></div>
          <div className="flex border-b p-1"> <div className="grow">Wallet Type</div> <div>Unknown</div> </div>
        </div>
      </div>
      <div className="rounded-sm bg-white drop-shadow w-full mt-3 p-4 ">
        <div className="mb-2 border-b text-medium font-semibold ">Transactions</div>
        <div>
          <table className="w-full">
            <tr className="font-semibold m-2" > <td>Tx Hash</td> <td>Date</td> <td>Eth Value</td> <td>Wallet 1</td> <td>Wallet 2</td>  </tr>
            { stateTransactions ? Object.entries(stateTransactions).map(item => {
              // console.log(stateTransactions)
              return (
              <tr className="border-b p-2 m-2">

                <td className="p-2 w-0">{ item[1].hash?.substring(0,22) + "..." }</td>

                <td>{ (new Date(item[1].timeStamp * 1000).toString().substring(3,16))    }</td>

                {/* <td>{ walletAddress1?.substring(0,22) + "..." || null }</td> */}

                <td>{ (Math.round((item[1].value) ) / 1000000000000000000 ).toFixed(2) } Ether</td>

                {/* <td>{ walletAddress2?.substring(0,22)  + "..." || null }</td> */}

              </tr> )
            }) : null }
          </table>
        </div>
      </div>
    </div>
  )
}


// let resp0 = await getEthNamespace(walletAddress)
// setEnsName(resp0)

// //Get balance of wallet
// let resp1 = await getBalance(walletAddress)
// setEthBalance(resp1)

// // get email 
// if (resolverInstance) { //exp
//   let resp = await getEmailByResolver(resolverInstance)
//   setEmail(resp)
// }

// if (ensName && !resolverInstance) {
//   let resp = await resolveByName(ensName)
//   setResolverInstance(resp)
// }