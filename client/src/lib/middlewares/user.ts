import { GET_AUTH_METAMASK, GET_USER_NFTS, GET_TAK, SWAP_ETH_TAK, IMPORT_TAK_METAMASK_WALLET, GET_BALANCES } from "../actions/types";
import {seedAuthMetamask, seedUserNFTS, seedBalances} from "../actions/user";
import {toggleNewUser} from "../actions/dashboard";
import detectEthereumProvider from '@metamask/detect-provider';
import getAccount from "./utils"
import {balanceTAK, addTAKToken} from "./utils/TakToken"
import getWeb3 from "./utils/getWeb3";
import MarketplaceInstanceCall from "./utils/Marketplace";
import axios from 'axios';

const URL = "http://localhost:8080/api/";

const customMiddleware = () => ({ dispatch, getState }: any) => (
  next: any
) => async (action: IAction) => {
  const {
    user: { accounts, web3, provider },
    contract: {Marketplace},
  } = getState();
  switch (action.type) {

  /*******************************/
  /* GET USER ACCOUNT in UTILS via web3/
  /*******************************/
    case GET_AUTH_METAMASK:
     try {
        const web3: any = await getWeb3();
        console.log("web3",web3)
        const accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts)
        const balance = await web3.eth.getBalance(accounts[0])
        console.log("balance", balance)
        const provider: any = await detectEthereumProvider()
        const resBalanceTAK: any = await balanceTAK(web3, provider, accounts[0])
        console.log("balancetak", resBalanceTAK)
        const MarketplaceInstance = await MarketplaceInstanceCall(web3);
        const admin: any = await MarketplaceInstance.methods.owner().call()
        const isAdmin = admin == accounts[0];
        dispatch(seedAuthMetamask(web3, accounts, balance, provider, resBalanceTAK, isAdmin));
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
      break;

    /*******************************/
  /* GET USER NFTS /
  /*******************************/

    case GET_USER_NFTS: {
        console.log("Passe par le MW GET USER NFTS")  
        console.log("user account", accounts[0])    
        const config: Object = {
          method: 'get',
          url: `${URL}accounts/${accounts[0]}`,
        }
        try {
          const response: any = await axios(config);
          console.log("response Api", response.data.cards)
          dispatch(seedUserNFTS(response.data.cards))
        } catch (error) {
          console.error(error);
        }
        break;
    }
      
   /*******************************/
  /* IMPORT TAK TOKEN TO METAMASK WALLET /
  /*******************************/

  case IMPORT_TAK_METAMASK_WALLET: {
    console.log("Passe par le MW GET USER NFTS")  
    try {
       const promise: any = await addTAKToken(provider);
      if(promise) {
        console.log("Wallet updated !", promise)
        dispatch(toggleNewUser());
        //TOAST
      }
    } catch (error) {
      console.error(error);
    }
    break;
  }

     /*******************************/
  /* GET TAK /
  /*******************************/

  case GET_TAK: { 
    console.log("Passe par le MW GET TAK")     
    try {
    //Ask by Faucet  
     const config: Object = {
      method: 'post',
      url: `${URL}faucet/`,
      body: {
       address: accounts[0]
      },
      data: {
        address: accounts[0]
       },
    }
      const response: any = await axios(config);
      console.log("response Api", response) 
      //TOAST

    } catch (error) {
      console.error(error);
    }
    break;
  }

     /*******************************/
  /* GET BALANCES /
  /*******************************/

  case GET_BALANCES: { 
    console.log("Passe par le MW GET Balances")     
    try {
     const config: Object = {
      method: 'get',
      url: `${URL}accounts/${accounts[0]}`,
    }
      const response: any = await axios(config);
      const balanceEther: any = await web3.eth.getBalance(accounts[0])
      console.log("response get balance", response.data, balanceEther)
      const {balance, cards} = response.data;
      dispatch(seedBalances(parseInt(balance, 10), cards, parseInt(balanceEther,10)));
    } catch (error) {
      console.error(error);
    }
    break;
  }

      /*******************************/
  /* SWAP ETHER TAK /
  /*******************************/

  case SWAP_ETH_TAK: { 
    console.log("Passe par le MW SWAP_ETH_TAK")    
    const value = action.payload;
    console.log('value à swap:', value)
    console.log("adress:", Marketplace.options.address)
    console.log("from: ", accounts[0])
    try {
      web3.eth.sendTransaction({
        from: accounts[0],
        to: Marketplace.options.address, 
        value: value, 
        }, (error: any, result:any) => {
          console.log("resultat de la transac:", result)
        })
    } catch (error) {
      console.error(error);
    }
    break;
  }
    default:
      return next(action);
  }
  return next(action);
};
const user = () => customMiddleware();
export default user();
