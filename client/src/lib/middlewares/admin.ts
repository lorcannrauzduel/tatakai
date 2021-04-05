import { ADMIN_FORM_SUBMIT } from "../actions/types";
import { mintNFTSuccess } from "../actions/admin";
import CardItem from "../../contracts/CardItem.json";
import { getContract } from "./utils";
import axios from 'axios';

const URL = "http://localhost:8080/api/";

const customMiddleware = () => ({ dispatch, getState }: any) => (
  next: any
) => async (action: IAction) => {
  const {
    contract: { admin, web3 },
    admin: { token },
  } = getState();

  //const instance = await getContract(web3, CardItem);
  switch (action.type) {
    /* case ADMIN_FORM_SUBMIT:
      try {
        instance.methods
          .mintNFT(instance._address, "", token)
          .send({ from: admin })
          .then((result: any) => {
            if (result.status) {
              console.log(result);
              dispatch(mintNFTSuccess());
            }
          });
      } catch (error) {
        console.error(error);
      }
      break; */

  /*******************************/
  /* ADMIN_FORM_SUBMIT via API */
  /*******************************/

    case ADMIN_FORM_SUBMIT:
      console.log("Passe par le MW admin via ADMIN FORM SUBMIT")
      let data = action.data!;
      data.append("token", token);
      for (var value of data.values()) {
        console.log(value);
     }
      const config: Object = {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        }
      }
      try {
        const response: any = await axios.post(`${URL}cards`,data,config);
        console.log("response Api", response)
      } catch (error) {
        console.error(error);
      }
      break;
  
    default:
      return next(action);
  }
  return next(action);
};
const admin = () => customMiddleware();
export default admin();