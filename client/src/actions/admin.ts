import { ADMIN_FORM_HANDLECHANGE, ADMIN_FORM_SUBMIT } from "./types";

interface IEventType {
  target: {
    name: string;
    value: number;
  };
}

export const changeField = ({ target: { name, value } }: IEventType) => ({
  type: ADMIN_FORM_HANDLECHANGE,
  payload: { [name]: value },
});
export const submitValue = ({ target: { value } }: IEventType) => ({
  type: ADMIN_FORM_SUBMIT,
  payload: { storageValue: value, inputValue: value },
});
