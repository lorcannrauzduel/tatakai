import { connect } from "react-redux";
import Home from "../../components/Home";

import { changeField, submitValue } from "../../actions/storage";

type IMapStateToPropsType = {
  contract: IContractState;
  storage: IStorageState;
};

const mapStateToProps = ({
  contract: { web3, accounts },
  storage: { storageValue, isLoading, inputValue },
}: IMapStateToPropsType) => {
  return {
    web3,
    accounts,

    storageValue,
    isLoading,
    inputValue,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  changeField: (e: any) => dispatch(changeField(e)),
  submitValue: (e: any) => dispatch(submitValue(e)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
