import * as Account from "./Account";
import * as ErrorNotifications from "./ErrorNotifications";
import {Dispatch} from "react-redux";

export interface IApplicationState {
  account: Account.IAccountState;
  errorNotifications: ErrorNotifications.IErrorNotificationsState;
}

export const reducers = {
  account: Account.reducer,
  errorNotifications: ErrorNotifications.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => IApplicationState): void;
}

type DispatchAction = Dispatch<IApplicationState>;
export {DispatchAction as Dispatch}
