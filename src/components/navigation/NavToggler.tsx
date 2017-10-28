import * as React from 'react';
import * as classNames from 'classnames';

interface INavTogglerDataProps {
  isOpen: boolean;
}

interface INavTogglerDispatchProps {
  onToggle: () => void;
  setInnerRef: (elementRef:any) => void;
}

type INavTogglerProps = INavTogglerDataProps & INavTogglerDispatchProps;

interface INavTogglerState {
}

export class NavToggler extends React.Component<INavTogglerProps, INavTogglerState> {
  static displayName = "NavToggler";

  render() {
    return (
      <div
        ref={element => this.props.setInnerRef(element)}
        className={classNames("nav-toggler", {"nav-toggler-open": this.props.isOpen})}
        onClick={this.props.onToggle}
      >
        <div className="nav-icon">
          <div className={classNames("nav-icon-bar nav-bar-top", {"nav-bar-top-open": this.props.isOpen})}/>
          <div className={classNames("nav-icon-bar nav-bar-middle", {"nav-bar-middle-open": this.props.isOpen})}/>
          <div className={classNames("nav-icon-bar nav-bar-bottom", {"nav-bar-bottom-open": this.props.isOpen})}/>
        </div>
        <span className="nav-toggler-text">{this.props.isOpen ? "CLOSE" : "MENU"}</span>
      </div>
    );
  }
}
