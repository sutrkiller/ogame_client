import {Reducer} from 'redux';
import {Guid} from "../models/Guid";
import {AppThunkAction} from "./index";
import {client, isSuccessStatus, parseFailedResponse, IParsedErrorResponse} from "../utils/client";
import {LOCATION_CHANGE, replace} from "react-router-redux";
import * as routes from "../config/routes";
import {AxiosResponse} from "axios";
import {IFieldError} from "../models/IError";
import {IAction} from '../models/IAction';
import {accountActions} from './actionTypes'
import {OrderedMap} from "immutable";
import {INotificationMessage, NotificationMessage, NotificationTypeEnum} from "../models/INotification";

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
  registerFail: (errors: IParsedErrorResponse) => IAction;
  registerSuccess: () => IAction;
  parseFailedResponse: (response: AxiosResponse) => IParsedErrorResponse;
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

const registerFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.REGISTER_FAIL,
    payload: {
      ...errors
    },
  }
};

const registerCreator = (dependencies: IRegisterDependencies) => (userName: string, email: string, password: string, confirmPassword: string): AppThunkAction<IAction> => (dispatch) => {
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
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/register',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.registerFail(result));
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
    parseFailedResponse,
    redirect: () => replace(routes.ROUTE_REGISTER_SUCCESS),
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
