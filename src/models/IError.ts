import {Guid} from "./Guid";
import {Record} from "immutable";
import {guidGenerator} from "../utils/guidGenerator";

export enum ErrorScopeEnum {
  Application = 'application',

  Email = 'email',
  Username = 'userName',
  Password = 'password',
  ConfirmPassword = 'confirmPassword',
}

export const getErrorScope = (name: string): ErrorScopeEnum => {
  let camelCased = name.substring(0,1).toLowerCase().concat(name.substring(1));
  switch (camelCased) {
    case 'email':
      return ErrorScopeEnum.Email;

    case 'userName':
      return ErrorScopeEnum.Username;

    case 'password':
      return ErrorScopeEnum.Password;

    case 'confirmPassword':
      return ErrorScopeEnum.ConfirmPassword;

    default:
      return ErrorScopeEnum.Application;
  }
};

export interface IErrorMessage {
  id: Guid;
  scope: ErrorScopeEnum;
  text: string;
}

const ErrorInitialState: IErrorMessage = {
  id: '',
  scope: ErrorScopeEnum.Application,
  text: ''
};

type ErrorMessageParams = {
  scope?: ErrorScopeEnum;
  text?: string;
}

export class ErrorMessage extends Record(ErrorInitialState) {
  id: Guid;
  scope: ErrorScopeEnum;
  text: string;

  constructor(params?: ErrorMessageParams) {
    params ? super({id: guidGenerator(), ...params}) : super({id: guidGenerator()});
  }

  with(values: ErrorMessageParams) {
    return this.merge(values) as this;
  }
}
