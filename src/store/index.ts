import * as Account from "./Account";
import * as Notifications from "./Notifications";
import {Dispatch} from "react-redux";

export interface IApplicationState {
  account: Account.IAccountState;
  notifications: Notifications.INotificationsState;
}

export const reducers = {
  account: Account.reducer,
  notifications: Notifications.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => IApplicationState): void;
}

type DispatchAction = Dispatch<IApplicationState>;
export {DispatchAction as Dispatch}
