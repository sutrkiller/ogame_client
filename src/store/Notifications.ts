import {IFieldError} from "../models/IError";
import {Reducer} from "redux";
import {IAction} from "../models/IAction";
import {accountActions, notificationActions} from "./actionTypes";
import {OrderedMap} from "immutable";
import {Guid} from "../models/Guid";
import {LOCATION_CHANGE} from "react-router-redux";
import {INotificationMessage, NotificationMessage, NotificationTypeEnum} from "../models/INotification";

export interface INotificationsState {
  validationErrors: OrderedMap<Guid, IFieldError>;
  messages: OrderedMap<Guid, INotificationMessage>;
}

const initialState: INotificationsState = {
  validationErrors: OrderedMap<Guid, IFieldError>(),
  messages: OrderedMap<Guid, INotificationMessage>(),
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
  },
  notificationCreate: (type: NotificationTypeEnum, text: string, timeout: number = 0, origin: string = "unknown"): IAction => {
    return {
      type: notificationActions.NOTIFICATION_CREATE,
      payload: {
        notification: new NotificationMessage({type, text, timeout, origin})
      }
    };
  }
};

//REDUCERS ---------------------------------------------------------------------------------------------------------

export const reducer: Reducer<INotificationsState> = (state: INotificationsState = initialState, action: IAction) => {
  switch (action.type) {
    case accountActions.REGISTER_FAIL:
    case accountActions.CONFIRM_EMAIL_FAIL:
      return {
        validationErrors: action.payload.validationErrors,
        messages: state.messages.merge(action.payload.notifications)
      };

    case LOCATION_CHANGE: {
      return {
        validationErrors: OrderedMap<Guid, IFieldError>(),
        messages: state.messages
      };
    }

    case notificationActions.NOTIFICATION_CREATE:
      return {
        ...state,
        messages: state.messages.set(action.payload.notification.id, action.payload.notification)
      };

    case notificationActions.NOTIFICATION_REMOVE:
      return {
        ...state,
        messages: state.messages.delete(action.payload.id)
      };

    default:
      return {
        validationErrors: OrderedMap<Guid, IFieldError>(),
        messages: state.messages
      };
  }
};
