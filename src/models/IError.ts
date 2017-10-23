import {Guid} from "./Guid";

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

export interface IError {
  id: Guid;
  scope: ErrorScopeEnum;
  text: string;
}
