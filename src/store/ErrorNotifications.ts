import {ErrorScopeEnum, IErrorMessage} from "../models/IError";
import {Reducer} from "redux";
import {IAction} from "../models/IAction";
import {accountActions} from "./actionTypes";
import {Map, OrderedMap} from "immutable";
import {Guid} from "../models/Guid";
import {LOCATION_CHANGE} from "react-router-redux";

export interface IErrorNotificationsState {
  errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>;
}

const initialState : IErrorNotificationsState = {
  errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>(),
};

export const reducer: Reducer<IErrorNotificationsState> = (state: IErrorNotificationsState = initialState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_FAIL:
      return { errors: action.payload.errors };

    case LOCATION_CHANGE: {
      return { errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>() };
    }

    default:
      return state;
  }
};
