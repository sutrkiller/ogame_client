import {Guid} from "./Guid";
import {Record} from "immutable";
import {guidGenerator} from "../utils/guidGenerator";

export enum NotificationTypeEnum {
  Error = 'error',
  Success = 'success',
  Warning = 'warning',
  Info = 'info',
}

export const getNotificationType = (name: string): NotificationTypeEnum => {
  let camelCased = name.substring(0,1).toLowerCase().concat(name.substring(1));
  switch (camelCased) {
    case 'error':
      return NotificationTypeEnum.Error;

    case 'success':
      return NotificationTypeEnum.Success;

    case 'warning':
      return NotificationTypeEnum.Warning;

    default:
      return NotificationTypeEnum.Info;
  }
};

export interface INotificationMessage {
  id: Guid;
  type: NotificationTypeEnum;
  origin: string;
  timeout: number;
  text: string;
}

const NotificationMessageInitialState: INotificationMessage = {
  id: '',
  type: NotificationTypeEnum.Info,
  origin: 'Unknown',
  timeout: 5000,
  text: ''
};

type NotificationMessageParams = {
  type?: NotificationTypeEnum;
  origin?: string;
  timeout?: number;
  text?: string;
}

export class NotificationMessage extends Record(NotificationMessageInitialState) {
  id: Guid;
  type: NotificationTypeEnum;
  origin: string;
  timeout: number;
  text: string;

  constructor(params?: NotificationMessageParams) {
    params ? super({id: guidGenerator(), ...params}) : super({id: guidGenerator()});
  }

  with(values: NotificationMessageParams) {
    return this.merge(values) as this;
  }
}
