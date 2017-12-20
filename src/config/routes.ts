import {Guid} from "../models/Guid";

export const ROUTE_HOME = "/";

export const ROUTE_SIGN_IN = "/account/sign-in";
export const ROUTE_SIGN_OUT = "/account/sign-out";
export const ROUTE_REGISTER = "/account/register";
export const ROUTE_REGISTER_SUCCESS = (registerToken: Guid) => `${ROUTE_REGISTER}?token=${registerToken}`;
export const ROUTE_REGISTER_CONFIRM = "/account/confirm-email";
export const ROUTE_REGISTER_CONFIRM_SUCCESS = (confirmToken: Guid) => `${ROUTE_REGISTER_CONFIRM}?token=${confirmToken}`;
export const ROUTE_FORGOT_PASSWORD = "/account/forgot-password";
export const ROUTE_FORGOT_PASSWORD_SUCCESS = (forgotToken: Guid) => `${ROUTE_FORGOT_PASSWORD}?token=${forgotToken}`;
export const ROUTE_RESET_PASSWORD = '/account/reset-password';
export const ROUTE_RESET_PASSWORD_SUCCESS = (resetToken: Guid) => `${ROUTE_RESET_PASSWORD}?token=${resetToken}`;
export const ROUTE_SETTINGS = "/account/settings";

export const ROUTE_RUNNER = "/runner";


