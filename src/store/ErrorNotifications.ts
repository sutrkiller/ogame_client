import {IError} from "../models/IError";
import {Reducer} from "redux";
import {IAction} from "../models/IAction";
import {accountActions} from "./actionTypes";

export interface IErrorNotificationsState {
  errors: IError[];
}

const initialState : IErrorNotificationsState = {
  errors: [],
};

export const reducer: Reducer<IErrorNotificationsState> = (state: IErrorNotificationsState = initialState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_FAIL:
      return {
        ...state,
        errors: [...state.errors, ...action.payload.errors]
      };

    default:
      return state;
  }
};
