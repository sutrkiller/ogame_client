import * as Account from "./Account";
import {Dispatch} from "react-redux";

export interface ApplicationState {
  account: Account.AccountState;
}

export const reducers = {
  account: Account.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}

type DispatchAction = Dispatch<ApplicationState>;
export {DispatchAction as Dispatch}
