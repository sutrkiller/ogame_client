// import { fetch, addTask } from 'domain-task';
import { Reducer, ActionCreator } from 'redux';
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
}

export interface AccountState {
  isLoading: boolean;
  isSignedIn: boolean;
  token: Token;
  user: User;
}

export const actions = {
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAIL: 'REGISTER_FAIL',
};
// interface RegisterStartAction {type: 'REGISTER_START'}
// interface RegisterSuccessAction {type: 'REGISTER_SUCCESS'}
// interface RegisterFailAction {type: 'REGISTER_FAIL'}
// interface RegisterAction {type: 'REGISTER', payload: {userName: string; email: string; password: string; passwordConfirmed: string;}}

interface Action {
  type: string;
  payload: object;
}

// type KnownAction = RegisterStartAction | RegisterSuccessAction | RegisterFailAction

const registerStartAction = (): Action => {
  return {
    type: actions.REGISTER_START,
    payload: {},
  }
};

export const actionCreators = {
  register: (userName: string, email: string, password: string, confirmPassword: string) : AppThunkAction<Action> => (dispatch, getState) => {
    dispatch(registerStartAction());
    client.post('/register', {
      userName,
      email,
      password,
      confirmPassword
    }).then(response => {console.log(response)})
      .catch(response => {console.log(response)});
  }
};


const initialState: AccountState = {
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

export const reducer: Reducer<AccountState> = (state: AccountState = initialState, action: Action) => {
  switch (action.type) {
    case actions.REGISTER_START:
      return {...state, isLoading: true};

    default: return state;
  }
};
