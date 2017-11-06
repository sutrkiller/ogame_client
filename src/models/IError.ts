import {Guid} from "./Guid";
import {Record} from "immutable";
import {guidGenerator} from "../utils/guidGenerator";

export enum ErrorFieldEnum {
  Unknown = 'unknown',

  Email = 'email',
  Username = 'userName',
  Password = 'password',
  ConfirmPassword = 'confirmPassword',
}

export const getErrorField = (name: string): ErrorFieldEnum => {
  let camelCased = name.substring(0,1).toLowerCase().concat(name.substring(1));
  switch (camelCased) {
    case 'email':
      return ErrorFieldEnum.Email;

    case 'userName':
      return ErrorFieldEnum.Username;

    case 'password':
      return ErrorFieldEnum.Password;

    case 'confirmPassword':
      return ErrorFieldEnum.ConfirmPassword;

    default:
      debugger;
      console.log('Parsed scope: ' + camelCased);
      return ErrorFieldEnum.Unknown;
  }
};

export interface IFieldError {
  id: Guid;
  field: ErrorFieldEnum;
  text: string;
}

const FieldErrorInitialState: IFieldError = {
  id: '',
  field: ErrorFieldEnum.Unknown,
  text: ''
};

type FieldErrorParams = {
  field?: ErrorFieldEnum;
  text?: string;
}

export class FieldError extends Record(FieldErrorInitialState) {
  id: Guid;
  field: ErrorFieldEnum;
  text: string;

  constructor(params?: FieldErrorParams) {
    params ? super({id: guidGenerator(), ...params}) : super({id: guidGenerator()});
  }

  with(values: FieldErrorParams) {
    return this.merge(values) as this;
  }
}
