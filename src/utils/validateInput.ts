import {OrderedMap} from "immutable";
import {IErrorMessage, ErrorMessage, ErrorScopeEnum} from "../models/IError";
import {Guid} from "../models/Guid";

export const validatePassword = (value: string):OrderedMap<Guid, IErrorMessage> => {
  let errors = OrderedMap<Guid, IErrorMessage>();

  if (!value.length) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.Password,
      text: 'Please fill out this field.'
    });
    return errors.set(error.id, error);
  }

  let regExp = /[A-Z]/;
  if (!regExp.test(value)) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.Password,
      text: "Password must contain an upper-case letter."
    });
    errors = errors.set(error.id, error);
  }

  regExp = /\d/;
  if (!regExp.test(value)) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.Password,
      text: "Password must contain a digit character."
    });
    errors = errors.set(error.id, error);
  }

  const count = (<any>Object).values(value.split('').reduce((p:any, c) => ({...p, [c]: p[c] ? p[c] + 1: 1}) ,{})).map((k:any, v:any) => v).length;
  if (count < 6) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.Password,
      text: "Password must contain at least 6 unique characters."
    });
    errors = errors.set(error.id, error);
  }

  return errors;
};

export const validateConfirmPasswordValue = (password: string, confirmPassword: string) => {
  let errors = OrderedMap<Guid, IErrorMessage>();

  if (!confirmPassword.length) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.ConfirmPassword,
      text: 'Please fill out this field.'
    });
    return errors.set(error.id, error);
  }

  if (password !== confirmPassword) {
    const error = new ErrorMessage({
      scope: ErrorScopeEnum.ConfirmPassword,
      text: "The passwords must match.",
    });
    errors = errors.set(error.id, error);
  }
  return errors;
};
