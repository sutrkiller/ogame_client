import * as React from 'react';
import {IApplicationState, Dispatch} from "../../../store/index";
import {connect} from "react-redux";
import {List} from "immutable";
import {Guid} from "../../../models/Guid";
import * as TransitionGroup from "react-transition-group/TransitionGroup";
import {NotificationMessage} from "./NotificationMessage";
import {SlideAnimation} from "./animations/SlideAnimation";
import {INotificationMessage} from "../../../models/INotification";
import {actionCreators} from "../../../store/Notifications";

interface INotificationContainerDataProps {
  notifications: List<INotificationMessage>;
}

interface INotificationContainerDispatchProps {
  onRemoveNotification: (id: Guid) => void;
}

type INotificationContainerProps = INotificationContainerDataProps & INotificationContainerDispatchProps;

interface INotificationContainerState {
}

class NotificationContainer extends React.PureComponent<INotificationContainerProps, INotificationContainerState> {
  static displayName = 'NotificationContainer';

  _renderNotifications = () => {
    return this.props.notifications.toArray().map(message => (
      <SlideAnimation key={message.id}>
        <NotificationMessage notification={message} onRemoveNotification={() => this.props.onRemoveNotification(message.id)}/>
      </SlideAnimation>
    ))
  };

  render() {
    return <div className="notification-container">
      <TransitionGroup>
        {this._renderNotifications()}
      </TransitionGroup>
    </div>
  }
}


const mapStateToProps = (state: IApplicationState): INotificationContainerDataProps => {
  return {
    notifications: state.notifications.messages.toList()
  };
};

const mapDispatchToProps = (dispatch: Dispatch): INotificationContainerDispatchProps => {
  return {
    onRemoveNotification: (id: Guid) => dispatch(actionCreators.notificationRemove(id))
  };
};

const registerContainer = connect<INotificationContainerDataProps, INotificationContainerDispatchProps>(mapStateToProps, mapDispatchToProps)(NotificationContainer);

export {registerContainer as NotificationContainer};
