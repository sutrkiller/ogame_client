import * as React from 'react'
import {IApplicationState, Dispatch} from "../../../store/index";
import {connect} from "react-redux";
import {INotificationMessage, NotificationTypeEnum} from "../../../models/INotification";
import {Guid} from "../../../models/Guid";
import {actionCreators} from "../../../store/Notifications";
import * as classNames from 'classnames';
import Timer = NodeJS.Timer;

interface INotificationMessageOwnProps {
  notificationId: Guid;
}

interface INotificationMessageDataProps {
  notification: INotificationMessage;
}

interface INotificationMessageDispatchProps {
  onRemoveNotification: () => void;
}

type INotificationMessageProps = INotificationMessageDataProps & INotificationMessageDispatchProps;

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
        <span className="fa fa-lg fa-exclamation-circle"/>
        <span>{this.props.notification ? this.props.notification.text : this._text}</span>
      </div>
    );
  }
}


const mapStateToProps = (state: IApplicationState, ownProps: INotificationMessageOwnProps): INotificationMessageDataProps => {
  return {
    notification: state.notifications.alerts.get(ownProps.notificationId)
  };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: INotificationMessageOwnProps): INotificationMessageDispatchProps => {
  return {
    onRemoveNotification: () => dispatch(actionCreators.notificationRemove(ownProps.notificationId))
  };
};

const registerContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationMessage);

export {registerContainer as NotificationMessage};
