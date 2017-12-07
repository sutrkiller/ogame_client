import * as axios from 'axios';
import {AxiosResponse} from "axios";
import {Guid} from "../models/Guid";
import {FieldError, getErrorField, IFieldError} from "../models/IError";
import {OrderedMap} from "immutable";
import {IErrorServerModel, ServerErrorCode} from "../models/server/IErrorServerModel";
import {INotificationMessage, NotificationMessage, NotificationTypeEnum} from "../models/INotification";
import {StorageKey_Token} from "./constants";

export const client = {
  register: (userName: string, email: string, password: string, confirmPassword: string) => post('account/register', {
    userName,
    email,
    password,
    confirmPassword
  }),
  confirmEmail: (userId: Guid, token: string) => post('account/confirmEmail', {
    userId,
    token
  }),
  signIn: (email: string, password: string) => post('account/signIn', {
    email,
    password
  }),
  signOut: () => postAuth('account/signOut', {
  }),
  accountDetails: () => getAuth('account/details'),
  forgotPassword: (email: string) => post('account/forgotPassword', {
    email
  }),
  resetPassword: (userId: Guid, token: string, password: string, confirmPassword: string) => post('account/resetPassword', {
    userId,
    token,
    password,
    confirmPassword
  }),
};

const post = (endpoint: string, data: any) => clientInstance.post(endpoint, data);

const postAuth = (endpoint: string, data: any) => {
  return clientInstance.post(endpoint, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(StorageKey_Token || '')}`
  }})
};

const getAuth = (endpoint: string) => {
  return clientInstance.get(endpoint, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(StorageKey_Token || '')}`
    }
  })
};

// noinspection JSUnusedGlobalSymbols
const clientInstance = axios.default.create({
  baseURL: 'http://localhost:49317/api',
  validateStatus: (status) => status < 500,
});

clientInstance.defaults.headers.post['Content-Type'] = 'application/json; charset=utf8';

// client.defaults.headers.common['Authorization'] = window.localStorage.getItem('Token');

export const isSuccessStatus = (status: number) => status >= 200 && status < 300;

export interface IParsedErrorResponse {
  notifications: OrderedMap<Guid, INotificationMessage>,
  validationErrors: OrderedMap<Guid, IFieldError>
}

export const parseFailedResponse = (response: AxiosResponse): IParsedErrorResponse => {
  if (!response) {
    debugger;
  }

  let notifications = OrderedMap<Guid, INotificationMessage>();
  let validationErrors = OrderedMap<Guid, IFieldError>();

  switch (response.status) {
    case 400: //Bad request
      validationErrors = extractServerValidationErrors(response.data);
      notifications = extractServerNotifications(response.data);
      break;

    default: {
      debugger;
      throw new Error("Unknown response format");
    }
  }

  return {
    notifications,
    validationErrors
  }
};

const extractServerValidationErrors = (content: IErrorServerModel): OrderedMap<Guid, IFieldError> => {
  switch (content.code) {
    case ServerErrorCode.DuplicateEmail:
    case ServerErrorCode.UnreachableEmail:
    case ServerErrorCode.InvalidModel:
    case ServerErrorCode.IncorrectSignInData:
    case ServerErrorCode.AccountNotFound:
    case ServerErrorCode.UnableToRecoverPassword:
    case ServerErrorCode.UnableToResetPassword:
      return OrderedMap<Guid, IFieldError>(content.data.map(v => new FieldError({
          field: getErrorField(v.name),
          text: v.message
        })).map(v => [v.id, v])
      );
  }

  return OrderedMap<Guid, IFieldError>();
};

const extractServerNotifications = (content: IErrorServerModel): OrderedMap<Guid, INotificationMessage> => {
  switch (content.code) {
    case ServerErrorCode.UnableToConfirmEmail:
    case ServerErrorCode.UnkownError:
      return OrderedMap<Guid, INotificationMessage>([new NotificationMessage({
        text: content.message,
        timeout: 10000,
        type: NotificationTypeEnum.Error,
        origin: `Server: ${content.code}`
      })].map(m => [m.id, m]));

    default:
      return OrderedMap<Guid, INotificationMessage>();
  }
};

