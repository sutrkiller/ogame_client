import * as React from 'react';
import {IApplicationState, Dispatch} from "../../../store/index";
import {connect} from "react-redux";
import {List} from "immutable";
import {Guid} from "../../../models/Guid";
import * as TransitionGroup from "react-transition-group/TransitionGroup";
import {NotificationMessage} from "./NotificationMessage";
import {SlideAnimation} from "./animations/SlideAnimation";

interface INotificationContainerDataProps {
  notifications: List<Guid>;
}

interface INotificationContainerDispatchProps {
}

type INotificationContainerProps = INotificationContainerDataProps & INotificationContainerDispatchProps;

interface INotificationContainerState {

}

class NotificationContainer extends React.PureComponent<INotificationContainerProps, INotificationContainerState> {
  static displayName = 'NotificationContainer';

  _renderNotifications = () => {
    return this.props.notifications.toArray().map(id => (
      <SlideAnimation key={id}>
        <NotificationMessage notificationId={id}/>
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
    notifications: state.notifications.messages.keySeq().toList()
  };
};

const mapDispatchToProps = (): INotificationContainerDispatchProps => {
  return {};
};

const registerContainer = connect<INotificationContainerDataProps, INotificationContainerDispatchProps>(mapStateToProps, mapDispatchToProps)(NotificationContainer);

export {registerContainer as NotificationContainer};
