import { INIT_MARKET, BUY_NFT } from "../actions/types";
import { seedMarket, buyNFTSuccess, isLoading } from "../actions/marketplace";
import MarketplaceInstanceCall from "./utils/Marketplace";
import CardItemInstanceCall from "./utils/cardItem";
import TakTokenInstanceCall from "./utils/TakToken";
import axios from "axios";


const URL = "http://localhost:8080/api/";

const customMiddleware = () => ({ dispatch, getState }: any) => (
  next: any
) => async (action: IAction) => {
  const {
    user: { accounts, web3 },
    contract: {TakToken, Marketplace, CardItem}
  } = getState();

  switch (action.type) {
    /*******************************/
    /* MARKET INIT via API / GET NFTS MARKETPLACE /
  /*******************************/
    case INIT_MARKET: {
      dispatch(isLoading());
      console.log("Passe par le MW MarketPLace via MarketINit");
      const config: Object = {
        method: "get",
        url: `${URL}cards`,
      };
      try {
        const response: any = await axios(config);
        console.log("response Api", response);
        dispatch(seedMarket(response.data));
      } catch (error) {
        console.error(error);
      }
      break;
    }

    /*******************************/
    /* USER BUY NFT
  /********************************/
  //VIa API:
    /* case BUY_NFT: {
      console.log("Passe par le MW MarketPLace via Buy NFT");
      const config: Object = {
        method: "post",
      };
      let data = { id: action.payload.id, address: action.payload.address };
      try {
        const response: any = await axios.post(`${URL}cards/buy`, data, config);
        console.log("response Api", response);
        if (response.status === 200) {
          dispatch(buyNFTSuccess());
        }
      } catch (error) {
        console.error(error);
      }
      break;
    } */
    case BUY_NFT: {
      let data = { id: action.payload.id, price: action.payload.price };
      try {
        //TODO mutualiser ca!
      const MarketplaceInstance = await MarketplaceInstanceCall(web3);
      const TakTokenInstance = await TakTokenInstanceCall(web3);
      const CardItemInstance = await CardItemInstanceCall(web3)

      await TakTokenInstance.methods.approve(MarketplaceInstance._address,parseInt(data.price, 10)).send({from: accounts[0]}).then(async (result: any) => {
        console.dir(result);
        if(result){
          console.log(CardItemInstance._address,accounts[0], data.id, data.price)

          await TakTokenInstance.methods.allowance(accounts[0], Marketplace.options.address).call({from: accounts[0]}).then(async (result: any) => {
            console.log("allowance", result);
          });

          await MarketplaceInstance.methods.buy(CardItemInstance._address, accounts[0], data.id, parseInt(data.price, 10)).send({from: accounts[0]}).then((response: any) => {
            console.dir(response)
          })
        }
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
const marketplace = () => customMiddleware();
export default marketplace();
