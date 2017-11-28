import {Guid} from "../models/Guid";

export const ROUTE_HOME = "/";

export const ROUTE_SIGN_IN = "/account/sign-in";
export const ROUTE_REGISTER = "/account/register";
export const ROUTE_REGISTER_SUCCESS = (registerToken: Guid) => `${ROUTE_REGISTER}?token=${registerToken}`;
export const ROUTE_REGISTER_CONFIRM = "/account/confirm-email";
export const ROUTE_REGISTER_CONFIRM_SUCCESS = "/account/confirm-email/success";
export const ROUTE_FORGOT_PASSWORD = "/account/forgot-password";
