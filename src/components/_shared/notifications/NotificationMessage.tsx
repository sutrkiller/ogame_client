import * as React from 'react'
import {INotificationMessage, NotificationTypeEnum} from "../../../models/INotification";
import * as classNames from 'classnames';
import Timer = NodeJS.Timer;

interface INotificationMessageOwnProps {
  notification: INotificationMessage;
  onRemoveNotification: () => void;
}

interface INotificationMessageDataProps {
}

interface INotificationMessageDispatchProps {
}

type INotificationMessageProps = INotificationMessageDataProps & INotificationMessageDispatchProps & INotificationMessageOwnProps;

interface INotificationMessageState {
}

class NotificationMessage extends React.PureComponent<INotificationMessageProps, INotificationMessageState> {
  static displayName = 'NotificationMessage';

  _timer: Timer;
  _text: string;
  _type: NotificationTypeEnum;

  constructor(props: INotificationMessageProps) {
    super(props);

    this._text = props.notification.text;
    this._type = props.notification.type;
  }

  componentDidMount() {
    const {timeout} = this.props.notification;
    if (timeout !== 0) {
      this._timer = global.setTimeout(this._onTimeout, timeout);
    }
  }

  componentWillUnmount() {
    if (this._timer) {
      global.clearTimeout(this._timer);
    }
  }

  _onTimeout = () => {
    this.props.onRemoveNotification();
  };

  _onClick = () => {
    this.props.onRemoveNotification();
  };

  render() {
    return (
      <div className={classNames("notification-message", `notification-${this.props.notification ? this.props.notification.type : this._type}`)} role="alert" onClick={this._onClick}>
        <span className="fas fa-lg fa-exclamation-circle"/>
        <span>{this.props.notification ? this.props.notification.text : this._text}</span>
      </div>
    );
  }
}

export {NotificationMessage};
