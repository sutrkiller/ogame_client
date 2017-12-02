import * as React from 'react';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account';
//types
import {Dispatch} from '../../store/index'
import {IApplicationState} from "../../store/index";

interface ISignOutDataProps {
}

interface ISignOutDispatchProps {
  onSignOut: () => void;
}

type ISignOutProps = ISignOutDataProps & ISignOutDispatchProps;

interface ISignOutState {
}

class SignOut extends React.PureComponent<ISignOutProps, ISignOutState> {
  static displayName = "SignOut";

  componentDidMount() {
    this.props.onSignOut();
  }

  render() {
    return <noscript/>;
  };
}

const mapStateToProps = (state: IApplicationState): ISignOutDataProps => {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ISignOutDispatchProps => {
  return {
    onSignOut: () => dispatch(actionCreators.signOut())
  };
};

const signOutContainer = connect<ISignOutDataProps, ISignOutDispatchProps>(mapStateToProps, mapDispatchToProps)(SignOut);

export {signOutContainer as SignOut};
