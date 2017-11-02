import { Reducer } from 'redux';
import {Guid} from "../models/Guid";
import {AppThunkAction} from "./index";
import {client, isSuccessStatus, parseFailedResponse} from "../utils/client";
import {LOCATION_CHANGE, replace} from "react-router-redux";
import * as routes from "../config/routes";
import {AxiosResponse} from "axios";
import {ErrorMessage, ErrorScopeEnum, IErrorMessage} from "../models/IError";
import {IAction} from '../models/IAction';
import {accountActions} from './actionTypes'
import {Map, OrderedMap} from "immutable";
import {NotificationTypeEnum} from "../models/INotification";
import {actionCreators as notificationActionCreators} from './Notifications';

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
  registerFail: (errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>) => IAction;
  registerSuccess: () => IAction;
  createNotification: (type: NotificationTypeEnum, text: string, timeout: number, origin: string) => IAction;
  parseFailedResponse: (response: AxiosResponse) => Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>;
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

const registerFail = (errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>): IAction => {
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
        dispatch(dependencies.createNotification(NotificationTypeEnum.Success, `Account created. Please confirm your account by following instructions in an email we sent to an address ${email}.`, 60000, 'registerAccount'));
        dispatch(dependencies.redirect());
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.registerFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new ErrorMessage({
          text: "There was a network error when communicating with the server.",
          scope: ErrorScopeEnum.Application,
        });
        const errors = Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>({
          [error.scope]: OrderedMap<Guid, IErrorMessage>({
            [error.id]: error
          })
        });

        dispatch(dependencies.registerFail(errors));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

//ACTION CREATORS ---------------------------------------------------------------------------------------------------------

export const actionCreators = {
  register: registerCreator({
    registerStart,
    registerSuccess,
    registerFail,
    createNotification: notificationActionCreators.notificationCreate,
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
    case LOCATION_CHANGE:
      return {...state, isLoading: false};

    default:
      return state;
  }
};
