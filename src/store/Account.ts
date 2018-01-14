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
import {GuidEmpty, StorageKey_Token} from "../utils/constants";
import {ROUTE_HOME} from "../config/routes";

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

export interface ISuccessTokens {
  registerToken: Guid;
  confirmToken: Guid;
  forgotToken: Guid;
  resetToken: Guid;
}

export interface IAccountState {
  isLoading: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  successTokens: ISuccessTokens;
  token: IToken;
  user: IUser;
}


// DEPENDENCIES ---------------------------------------------------------------------------------------------------------

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
  confirmEmailSuccess: (confirmToken: Guid) => IAction;
  generateGuid: () => Guid;
  onSuccess: (confirmToken: Guid) => IAction;
  onFail: () => IAction;
  onSkip: () => IAction;
}

export interface ISignInDependecies  extends  IServerRequestDependencies {
  signInStart: () => IAction;
  signInFail: (errors: IParsedErrorResponse) => IAction;
  signInSuccess: (token: IToken, user: IUser) => IAction;
  onSuccess: () => IAction;
}

export interface ISignOutDependencies  extends  IServerRequestDependencies {
  signOutStart: () => IAction;
  signOutFail: (errors: IParsedErrorResponse) => IAction;
  signOutSuccess: () => IAction;
  onSuccess: () => IAction;
}

export interface IGetDetailsDependencies  extends  IServerRequestDependencies {
  getDetailsStart: () => IAction;
  getDetailsFail: (errors: IParsedErrorResponse) => IAction;
  getDetailsSuccess: (token: IToken, user: IUser) => IAction;
  redirect: ((redirectAddress: string) => IAction);
}

export interface IForgotPasswordDependencies  extends  IServerRequestDependencies {
  forgotPasswordStart: () => IAction;
  forgotPasswordFail: (errors: IParsedErrorResponse) => IAction;
  forgotPasswordSuccess: (forgotToken: Guid) => IAction;
  generateGuid: () => Guid;
  onSuccess: (forgotToken: Guid) => IAction;
}

export interface IResetPasswordDependencies  extends  IServerRequestDependencies {
  resetPasswordStart: () => IAction;
  resetPasswordFail: (errors: IParsedErrorResponse) => IAction;
  resetPasswordSuccess: (forgotToken: Guid) => IAction;
  generateGuid: () => Guid;
  onSuccess: (resetToken: Guid) => IAction;
}

// ACTIONS ---------------------------------------------------------------------------------------------------------

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

const confirmEmailSuccess = (confirmToken: Guid): IAction => {
  return {
    type: accountActions.CONFIRM_EMAIL_SUCCESS,
    payload: {
      confirmToken
    },
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

const signInStart = (): IAction => {
  return {
    type: accountActions.SIGN_IN_START,
    payload: {},
  }
};

const signInSuccess = (token: IToken, user: IUser): IAction => {
  return {
    type: accountActions.SIGN_IN_SUCCESS,
    payload: {
      token,
      user
    },
  }
};

const signInFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.SIGN_IN_FAIL,
    payload: {
      ...errors
    },
  }
};

const signOutStart = (): IAction => {
  return {
    type: accountActions.SIGN_OUT_START,
    payload: {},
  }
};

const signOutSuccess = (): IAction => {
  return {
    type: accountActions.SIGN_OUT_SUCCESS,
    payload: {
    },
  }
};

const signOutFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.SIGN_OUT_FAIL,
    payload: {
      ...errors
    },
  }
};

const getDetailsStart = (): IAction => {
  return {
    type: accountActions.ACCOUNT_DETAILS_START,
    payload: {},
  }
};

const getDetailsSuccess = (token: IToken, user: IUser): IAction => {
  return {
    type: accountActions.ACCOUNT_DETAILS_SUCCESS,
    payload: {
      token,
      user
    },
  }
};

const getDetailsFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.ACCOUNT_DETAILS_FAIL,
    payload: {
      ...errors
    },
  }
};


const forgotPasswordStart = (): IAction => {
  return {
    type: accountActions.FORGOT_PASSWORD_START,
    payload: {},
  }
};

const forgotPasswordSuccess = (forgotToken: Guid): IAction => {
  return {
    type: accountActions.FORGOT_PASSWORD_SUCCESS,
    payload: {
      forgotToken
    },
  }
};

const forgotPasswordFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.FORGOT_PASSWORD_FAIL,
    payload: {
      ...errors
    },
  }
};

const resetPasswordStart = (): IAction => {
  return {
    type: accountActions.RESET_PASSWORD_START,
    payload: {},
  }
};

const resetPasswordSuccess = (resetToken: Guid): IAction => {
  return {
    type: accountActions.RESET_PASSWORD_SUCCESS,
    payload: {
      resetToken
    },
  }
};

const resetPasswordFail = (errors: IParsedErrorResponse): IAction => {
  return {
    type: accountActions.RESET_PASSWORD_FAIL,
    payload: {
      ...errors
    },
  }
};

// PRIVATE ACTION CREATORS ---------------------------------------------------------------------------------------------------------

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
        const confirmToken = dependencies.generateGuid();
        dispatch(dependencies.confirmEmailSuccess(confirmToken));
        dispatch(dependencies.onSuccess(confirmToken));
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

const signInCreator = (dependencies: ISignInDependecies) => (email: string, password: string): AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.signInStart());
  return client.signIn(email, password)
    .then(response => {
      if (isSuccessStatus(response.status)) {
        const token = response.data.token as IToken;
        const user = response.data.user as IUser;
        localStorage.setItem(StorageKey_Token, token.value);
        dispatch(dependencies.signInSuccess(token, user));
        dispatch(dependencies.onSuccess());
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.signInFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/sign-in',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.signInFail(result));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

const signOutCreator = (dependencies: ISignOutDependencies) => (): AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.signOutStart());
  return client.signOut()
    .then(response => {
      if (isSuccessStatus(response.status)) {
        localStorage.removeItem(StorageKey_Token);
        dispatch(dependencies.signOutSuccess());
        dispatch(dependencies.onSuccess());
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.signOutFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/sign-out',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.signOutFail(result));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

const forgotPasswordCreator = (dependencies: IForgotPasswordDependencies) => (email: string): AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.forgotPasswordStart());
  return client.forgotPassword(email)
    .then(response => {
      if (isSuccessStatus(response.status)) {
        const forgotToken = dependencies.generateGuid();
        dispatch(dependencies.forgotPasswordSuccess(forgotToken));
        dispatch(dependencies.onSuccess(forgotToken));
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.forgotPasswordFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/forgot-password',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.forgotPasswordFail(result));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

const getDetailsCreator = (dependencies: IGetDetailsDependencies) => (redirectAddress: string): AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.getDetailsStart());
  return client.accountDetails()
    .then(response => {
      if (isSuccessStatus(response.status)) {
        const token = response.data.token as IToken;
        const user = response.data.user as IUser;
        localStorage.setItem(StorageKey_Token, token.value);
        dispatch(dependencies.getDetailsSuccess(token, user));
        dispatch(dependencies.redirect(redirectAddress || ROUTE_HOME));
      } else {
        localStorage.removeItem(StorageKey_Token);
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.getDetailsFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        localStorage.removeItem(StorageKey_Token);
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'GET /account/getDetails',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.getDetailsFail(result));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

const resetPasswordCreator = (dependencies: IResetPasswordDependencies) => (userId: Guid, token: string, password: string, confirmPassword: string): AppThunkAction<IAction> => (dispatch) => {
  dispatch(dependencies.resetPasswordStart());
  return client.resetPassword(userId, token, password, confirmPassword)
    .then(response => {
      if (isSuccessStatus(response.status)) {
        const resetToken = dependencies.generateGuid();
        dispatch(dependencies.resetPasswordSuccess(resetToken));
        dispatch(dependencies.onSuccess(resetToken));
      } else {
        const errors = dependencies.parseFailedResponse(response);
        dispatch(dependencies.resetPasswordFail(errors));
      }
    })
    .catch(failed => {
      if (!failed.response) {
        const error = new NotificationMessage({
          text: 'There was a network error when communicating with the server.',
          origin: 'POST /account/resetPassword',
          timeout: 5000,
          type: NotificationTypeEnum.Error
        });

        const result = {
          notifications: OrderedMap<Guid, INotificationMessage>({
            [error.id]: error
          }),
          validationErrors: OrderedMap<Guid, IFieldError>()
        };

        dispatch(dependencies.resetPasswordFail(result));
        return;
      }
      debugger;
      throw new Error('This should not happen!');
    });
};

// PUBLIC ACTION CREATORS ---------------------------------------------------------------------------------------------------------

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
    generateGuid: guidGenerator,
    onSuccess: (confirmToken) => replace(routes.ROUTE_REGISTER_CONFIRM_SUCCESS(confirmToken)),
    onFail: () => replace(routes.ROUTE_HOME),
    onSkip: () => replace(routes.ROUTE_SIGN_IN),
  }),
  signIn: signInCreator({
    signInStart,
    signInSuccess,
    signInFail,
    parseFailedResponse,
    onSuccess: () => replace(routes.ROUTE_HOME),
  }),
  signOut: signOutCreator({
    signOutStart,
    signOutSuccess,
    signOutFail,
    parseFailedResponse,
    onSuccess: () => replace(routes.ROUTE_SIGN_IN)
  }),
  getDetails: getDetailsCreator({
    getDetailsStart,
    getDetailsSuccess,
    getDetailsFail,
    parseFailedResponse,
    redirect: replace
  }),
  forgotPassword: forgotPasswordCreator({
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFail,
    parseFailedResponse,
    generateGuid: guidGenerator,
    onSuccess: (forgotToken) => replace(routes.ROUTE_FORGOT_PASSWORD_SUCCESS(forgotToken)),
  }),
  resetPassword: resetPasswordCreator({
    resetPasswordStart,
    resetPasswordSuccess,
    resetPasswordFail,
    parseFailedResponse,
    generateGuid: guidGenerator,
    onSuccess: (resetToken => replace(routes.ROUTE_RESET_PASSWORD_SUCCESS(resetToken)))
  })
};

//REDUCERS ---------------------------------------------------------------------------------------------------------

const initialUserState: IUser = {
    email: "",
    userName: "",
    joinDate: new Date(),
    emailConfirmed: false,
};

const initialTokenState: IToken = {
  value: '',
  expirationDate: new Date()
};

const initialSuccessTokensState: ISuccessTokens = {
  registerToken: GuidEmpty,
  confirmToken: GuidEmpty,
  forgotToken: GuidEmpty,
  resetToken: GuidEmpty,
};

const initialState: IAccountState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isLoading: false,
  successTokens: initialSuccessTokensState,
  token: initialTokenState,
  user: initialUserState,
};

//TODO: when signed in, show bar if email not confirmed
const userReducer: Reducer<IUser> = (state: IUser = initialUserState, action: IAction) => {
  switch (action.type) {
    case accountActions.CONFIRM_EMAIL_SUCCESS:
      return {...state, emailConfirmed: true};

    case accountActions.SIGN_IN_SUCCESS:
    case accountActions.ACCOUNT_DETAILS_SUCCESS:
      return {...action.payload.user};

    case accountActions.SIGN_OUT_SUCCESS:
      return initialUserState;

    default:
      return state;
  }
};

const successTokensReducer: Reducer<ISuccessTokens> = (state: ISuccessTokens = initialSuccessTokensState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_SUCCESS:
      return {...state, registerToken: action.payload.registerToken};

    case accountActions.CONFIRM_EMAIL_SUCCESS:
      return {...state, confirmToken: action.payload.confirmToken};

    case accountActions.FORGOT_PASSWORD_SUCCESS:
      return {...state, forgotToken: action.payload.forgotToken};

    case accountActions.RESET_PASSWORD_SUCCESS:
      return {...state, resetToken: action.payload.resetToken};

    case LOCATION_CHANGE:
      return initialSuccessTokensState;

    default:
      return state;
  }
};

export const reducer: Reducer<IAccountState> = (state: IAccountState = initialState, action: IAction) => {
  let newState = {...state};

  switch (action.type) {
    case accountActions.REGISTER_START:
    case accountActions.CONFIRM_EMAIL_START:
    case accountActions.FORGOT_PASSWORD_START:
    case accountActions.RESET_PASSWORD_START:
      newState.isLoading = true;
      break;

    case accountActions.SIGN_IN_START:
    case accountActions.SIGN_OUT_START:
    case accountActions.ACCOUNT_DETAILS_START:
      newState.isAuthenticating = true;
      newState.isLoading = true;
      break;

    case accountActions.SIGN_IN_SUCCESS:
    case accountActions.ACCOUNT_DETAILS_SUCCESS:
      newState.isLoading = false;
      newState.isAuthenticating = false;
      newState.isAuthenticated = true;
      newState.token = action.payload.token;
      break;

    case accountActions.SIGN_OUT_SUCCESS:
      newState.isLoading = false;
      newState.isAuthenticated = false;
      newState.isAuthenticating = false;
      newState.token = initialTokenState;
      break;

    case accountActions.REGISTER_SUCCESS:
    case accountActions.REGISTER_FAIL:
    case accountActions.SIGN_IN_FAIL:
    case accountActions.CONFIRM_EMAIL_SUCCESS:
    case accountActions.CONFIRM_EMAIL_FAIL:
    case accountActions.SIGN_OUT_FAIL:
    case accountActions.ACCOUNT_DETAILS_FAIL:
    case accountActions.FORGOT_PASSWORD_SUCCESS:
    case accountActions.FORGOT_PASSWORD_FAIL:
    case accountActions.RESET_PASSWORD_SUCCESS:
    case accountActions.RESET_PASSWORD_FAIL:
    case LOCATION_CHANGE:
      newState.isLoading = false;
      newState.isAuthenticating = false;
      break;

    default:
      break;
  }
  newState.user = userReducer(state.user, action);
  newState.successTokens = successTokensReducer(state.successTokens, action);

  return newState;
};
