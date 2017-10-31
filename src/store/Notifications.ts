import {ErrorScopeEnum, IErrorMessage} from "../models/IError";
import {Reducer} from "redux";
import {IAction} from "../models/IAction";
import {accountActions, notificationActions} from "./actionTypes";
import {Map, OrderedMap} from "immutable";
import {Guid} from "../models/Guid";
import {LOCATION_CHANGE} from "react-router-redux";
import {INotificationMessage, NotificationMessage, NotificationTypeEnum} from "../models/INotification";

export interface INotificationsState {
  validationErrors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>;
  alerts: OrderedMap<Guid, INotificationMessage>;
}

const initialState: INotificationsState = {
  validationErrors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>(),
  alerts: OrderedMap<Guid, INotificationMessage>(),
};

//ACTION CREATORS ---------------------------------------------------------------------------------------------------------

export const actionCreators = {
  notificationRemove: (id: Guid): IAction => {
    return {
      type: notificationActions.NOTIFICATION_REMOVE,
      payload: {
        id
      }
    }
  }
};

//REDUCERS ---------------------------------------------------------------------------------------------------------

export const reducer: Reducer<INotificationsState> = (state: INotificationsState = initialState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_FAIL:
      return {
        validationErrors: action.payload.errors.delete(ErrorScopeEnum.Application),
        alerts: state.alerts.merge(
          action.payload.errors.get(ErrorScopeEnum.Application).toArray().map((value: IErrorMessage) => ([
            value.id, new NotificationMessage({
              type: NotificationTypeEnum.Error,
              text: value.text,
              origin: action.type
            })
          ])))
      };

    case LOCATION_CHANGE: {
      return {
        validationErrors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>(),
        alerts: state.alerts
      };
    }

    case notificationActions.NOTIFICATION_REMOVE:
      return {
        ...state,
        alerts: state.alerts.delete(action.payload.id)
      };

    default:
      return state;
  }
};
