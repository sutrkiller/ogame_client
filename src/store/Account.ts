import { Reducer } from 'redux';
import {Guid} from "../models/Guid";
import {AppThunkAction} from "./index";
import {client, isSuccessStatus, parseFailedResponse} from "../utils/client";
import {replace} from "react-router-redux";
import * as routes from "../config/routes";
import {AxiosResponse} from "axios";
import {IError} from "../models/IError";
import {IAction} from '../models/IAction';
import {accountActions} from './actionTypes'

export interface IToken {
  value: Guid;
  expirationDate: Date;
}

export interface IUser {
  userName: string;
  email: string;
  joinDate: Date;
}

export interface IAccountState {
  isLoading: boolean;
  isSignedIn: boolean;
  token: IToken;
  user: IUser;
}

export interface IRegisterDependencies {
  registerStart: () => IAction;
  registerFail: (errors: IError[]) => IAction;
  registerSuccess: () => IAction;
  parseFailedResponse: (response: AxiosResponse) => IError[];
  redirect: () => IAction;
}

const registerStart = (): IAction => {
  return {
    type: accountActions.REGISTER_START,
    payload: {},
  }
};

const registerSuccess = (): IAction => {
  return {
    type: accountActions.REGISTER_SUCCESS,
    payload: {},
  }
};

const registerFail = (errors:IError[]): IAction => {
  return {
    type: accountActions.REGISTER_FAIL,
    payload: {
      errors
    },
  }
};

const registerCreator = (dependencies: IRegisterDependencies) => (userName: string, email: string, password: string, confirmPassword: string) : AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.registerStart());
  return client.register(userName, email, password, confirmPassword)
    .then(response => {
      if (isSuccessStatus(response.status)) {
        dispatch(dependencies.registerSuccess());
        dispatch(dependencies.redirect());
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.registerFail(errors));
      }
    })
    .catch(failed => {
      console.log(failed);
      throw new Error('This should not happen!');
    });
};

//ACTION CREATORS ---------------------------------------------------------------------------------------------------------

export const actionCreators = {
  register: registerCreator({
    registerStart,
    registerSuccess,
    registerFail,
    parseFailedResponse,
    redirect: () => replace(routes.ROUTE_SIGN_IN),
  })
};

//REDUCERS ---------------------------------------------------------------------------------------------------------


const initialState: IAccountState = {
  isSignedIn: false,
  isLoading: false,
  token: {
    value: "",
    expirationDate: new Date(),
  },
  user: {
    email: "",
    userName: "",
    joinDate: new Date(),
  },
};

export const reducer: Reducer<IAccountState> = (state: IAccountState = initialState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_START:
      return {...state, isLoading: true};

    case accountActions.REGISTER_SUCCESS:
    case accountActions.REGISTER_FAIL:
      return {...state, isLoading: false};

    default:
      return state;
  }
};
