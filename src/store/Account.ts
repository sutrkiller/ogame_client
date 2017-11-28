import {Reducer} from 'redux';
import {Guid} from "../models/Guid";
import {AppThunkAction, IServerRequestDependencies} from "./index";
import {client, isSuccessStatus, parseFailedResponse, IParsedErrorResponse} from "../utils/client";
import {LOCATION_CHANGE, replace} from "react-router-redux";
import * as routes from "../config/routes";
import {IFieldError} from "../models/IError";
import {IAction} from '../models/IAction';
import {accountActions} from './actionTypes'
import {OrderedMap} from "immutable";
import {INotificationMessage, NotificationMessage, NotificationTypeEnum} from "../models/INotification";
import {guidGenerator} from "../utils/guidGenerator";
import {GuidEmpty} from "../utils/constants";

export interface IToken {
  value: Guid;
  expirationDate: Date;
}

export interface IUser {
  userName: string;
  email: string;
  joinDate: Date;
  emailConfirmed: boolean;
}

export interface IAccountState {
  isLoading: boolean;
  isSignedIn: boolean;
  registerToken: Guid;
  token: IToken;
  user: IUser;
}

export interface IRegisterDependencies extends IServerRequestDependencies {
  registerStart: () => IAction;
  registerFail: (errors: IParsedErrorResponse) => IAction;
  registerSuccess: (succeessGuid: Guid) => IAction;
  generateGuid: () => Guid;
  redirect: (succeessGuid: Guid) => IAction;
}

export interface IConfirmEmailDependecies  extends  IServerRequestDependencies {
  confirmEmailStart: () => IAction;
  confirmEmailFail: (errors: IParsedErrorResponse) => IAction;
  confirmEmailSuccess: () => IAction;
  onSuccess: () => IAction;
  onFail: () => IAction;
  onSkip: () => IAction;
}

const registerStart = (): IAction => {
  return {
    type: accountActions.REGISTER_START,
    payload: {},
  }
};

const registerSuccess = (registerToken: Guid): IAction => {
  return {
    type: accountActions.REGISTER_SUCCESS,
    payload: {
      registerToken
    },
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

const confirmEmailStart = (): IAction => {
  return {
    type: accountActions.CONFIRM_EMAIL_START,
    payload: {},
  }
};

const confirmEmailSuccess = (): IAction => {
  return {
    type: accountActions.CONFIRM_EMAIL_SUCCESS,
    payload: {},
  }
};

const confirmEmailFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.CONFIRM_EMAIL_FAIL,
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
        const registerToken = dependencies.generateGuid();
        dispatch(dependencies.registerSuccess(registerToken));
        dispatch(dependencies.redirect(registerToken));
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

const confirmEmailCreator = (dependencies: IConfirmEmailDependecies) => (userId: Guid, token: string): AppThunkAction<IAction> => (dispatch, getState) => {
  if (getState().account.user.emailConfirmed) {
    dispatch(dependencies.onSkip());
  }

  dispatch(dependencies.confirmEmailStart());
  return client.confirmEmail(userId, token)
    .then(response => {
      if (isSuccessStatus(response.status)) {
        dispatch(dependencies.confirmEmailSuccess());
        dispatch(dependencies.onSuccess());
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.confirmEmailFail(errors));
        dispatch(dependencies.onFail());
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/register/confirm',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.confirmEmailFail(result));
        dispatch(dependencies.onFail());
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
    generateGuid: guidGenerator,
    redirect: (registerToken) => replace(routes.ROUTE_REGISTER_SUCCESS(registerToken)),
  }),
  confirmEmail: confirmEmailCreator({
    confirmEmailStart,
    confirmEmailSuccess,
    confirmEmailFail,
    parseFailedResponse,
    onSuccess: () => replace(routes.ROUTE_REGISTER_CONFIRM_SUCCESS),
    onFail: () => replace(routes.ROUTE_HOME),
    onSkip: () => replace(routes.ROUTE_SIGN_IN),
  })
};

//REDUCERS ---------------------------------------------------------------------------------------------------------

const initialUserState: IUser = {
    email: "",
    userName: "",
    joinDate: new Date(),
    emailConfirmed: false,
};

const initialState: IAccountState = {
  isSignedIn: false,
  isLoading: false,
  registerToken: GuidEmpty,
  token: {
    value: "",
    expirationDate: new Date(),
  },
  user: initialUserState,
};

const userReducer: Reducer<IUser> = (state: IUser = initialUserState, action: IAction) => {
  switch (action.type) {
    case accountActions.CONFIRM_EMAIL_SUCCESS:
      return {...state, emailConfirmed: true};

    default:
      return state;
  }
};

export const reducer: Reducer<IAccountState> = (state: IAccountState = initialState, action: IAction) => {
  let newState = {...state};

  switch (action.type) {
    case accountActions.REGISTER_START:
    case accountActions.CONFIRM_EMAIL_START:
      newState.isLoading = true;
      break;

    case accountActions.REGISTER_SUCCESS:
    case LOCATION_CHANGE:
      newState.isLoading = false;
      newState.registerToken = action.payload.registerToken;
      break;

    case accountActions.REGISTER_FAIL:
    case accountActions.CONFIRM_EMAIL_SUCCESS:
    case accountActions.CONFIRM_EMAIL_FAIL:
      newState.isLoading = false;
      break;

    default:
      break;
  }
  newState.user = userReducer(state.user, action);

  return newState;
};
