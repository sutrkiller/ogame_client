import * as axios from 'axios';
import {AxiosResponse} from "axios";
import {Guid} from "../models/Guid";
import {guidGenerator} from "./guidGenerator";
import {ErrorMessage, ErrorScopeEnum, getErrorScope, IErrorMessage} from "../models/IError";
import {Map, OrderedMap} from "immutable";

export const client = {
  register: (userName: string, email: string, password: string, confirmPassword: string) => clientInstance.post('account/register', {
    userName,
    email,
    password,
    confirmPassword
  }),
};

const clientInstance = axios.default.create({
  baseURL: 'http://localhost:49318/api',
  validateStatus: (status) => status < 500,
});

clientInstance.defaults.headers.post['Content-Type'] = 'application/json; charset=utf8';

// client.defaults.headers.common['Authorization'] = window.localStorage.getItem('Token');

interface IParseFailedResponseDependencies {
  guidGenerator: () => Guid;
}

export const isSuccessStatus = (status: number) => status >= 200 && status < 300;

const parseFailedResponseCreator = (dependencies: IParseFailedResponseDependencies) => (response: AxiosResponse): Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>> => {
  if (!response) {
    debugger;
  }

  switch (response.status) {
    case 400:
      return extractDataErrors(response.data, dependencies.guidGenerator);
  }

  console.log(response);
  throw new Error("Unknown response format");
};

const extractDataErrors = (data: object, guidGenerator: () => Guid): Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>> => {
  return (<any>Object).entries(data).reduce((previous: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>, [name, messages]: [string, string[]]) => {
    return previous.set(getErrorScope(name), OrderedMap(messages.map(message => new ErrorMessage({
      text: message,
      scope: getErrorScope(name)
    })).map(error => OrderedMap([error.id, error]))));
  }, Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>());
};

export const parseFailedResponse = parseFailedResponseCreator({
  guidGenerator
});


