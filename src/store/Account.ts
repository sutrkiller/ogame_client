// import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import {Guid} from "../models/Guid";
import {AppThunkAction} from "./index";
import {client} from "../utils/client";

export interface Token {
  value: Guid;
  expirationDate: Date;
}

export interface User {
  userName: string;
  email: string;
  joinDate: Date;
  emailConfirmed: boolean;

}

export interface AccountState {
  token: Token;
  user: User;
}

interface RegisterStartAction {type: 'REGISTER_START'}
interface RegisterSuccessAction {type: 'REGISTER_SUCCESS'}
interface RegisterFailAction {type: 'REGISTER_FAIL'}
interface RegisterAction {type: 'REGISTER', payload: {userName: string; email: string; password: string; passwordConfirmed: string;}}

type KnownAction = RegisterStartAction | RegisterSuccessAction | RegisterFailAction | RegisterAction

const registerStartAction = (): RegisterStartAction => {
  return {
    type: 'REGISTER_START',
  }
};

export const actionCreators = {
  registerAction: (userName: string, email: string, password: string, passwordConfirmed: string) : AppThunkAction<KnownAction> => (dispatch, getState) => {
    dispatch(registerStartAction());
    client.post('/values');
  }
};
