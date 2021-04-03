interface IAction {
  type: string;
  payload: any | null;
}

interface ContractJSON {
  networks: any;
  address: any;
  index: any;
}

interface IContractState {
  admin: any | null;
  web3: any | null;
  accounts: Array<string> | null;
}
interface IContractAction {
  newInstance: Function;
}

interface IStorageState {
  storageValue: number;
  inputValue: number;
  isLoading: boolean;
}
interface IStorageAction {
  changeField: Function;
  submitValue: Function;
}

interface IAdminState {
  token: any;
  isLoading: boolean;
}

interface IAdminAction {
  changeField: Function;
  submitValue: Function;
}
