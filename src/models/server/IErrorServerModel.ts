export enum ServerErrorCode {
  InvalidModel = 401,
  DuplicateEmail = 402,
  UnreachableEmail = 403,
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