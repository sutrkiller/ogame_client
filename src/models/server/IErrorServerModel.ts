export enum ServerErrorCode {
  InvalidModel = 401,
  DuplicateEmail = 402,
  UnreachableEmail = 403,
  UnableToConfirmEmail = 404,
  IncorrectSignInData = 405,

  UnkownError = 500
}

export interface IErrorMessageServerModel {
  name: string;
  message: string;
}

export interface IErrorServerModel {
  code: ServerErrorCode;
  message: string;
  data: IErrorMessageServerModel[];
}