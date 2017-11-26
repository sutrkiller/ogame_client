import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Guid} from "../../models/Guid";
import {IApplicationState} from "../../store/index";
import {Dispatch} from "../../store/index";
import {actionCreators} from "../../store/Account";
import {connect} from "react-redux";
import {GuidEmpty} from "../../utils/constants";

interface IRegisterConfirmDataProps {
  isConfirming: boolean;
}

interface IRegisterConfirmDispatchProps {
  onConfirmEmail: (userId: Guid, token: string) => void;
}

type IRegisterConfirmRoutedProps = RouteComponentProps<IRegisterConfirmDataProps>
type IRegisterConfirmProps = IRegisterConfirmRoutedProps & IRegisterConfirmDataProps & IRegisterConfirmDispatchProps;

interface IRegisterConfirmState {

}

class RegisterConfirm extends React.PureComponent<IRegisterConfirmProps, IRegisterConfirmState> {
  static displayName = "RegisterConfirm";

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const userId = params.get("userId") || GuidEmpty;
    const token = params.get("token") || "";
    this.props.onConfirmEmail(userId, token);
  }

  render() {
    return this.props.isConfirming ? <noscript/> : <div className="text-message">
      <p className="text-center"><strong>Congratulations,<br/> you have successfully confirmed an account!</strong></p>
      <p className="text-center">Go to login.</p>
    </div>
  }
}

const mapStateToProps = (state: IApplicationState): IRegisterConfirmDataProps => {
  return {
    isConfirming: state.account.isLoading,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) : IRegisterConfirmDispatchProps => {
  return {
    onConfirmEmail: (userId: Guid, token: string) => dispatch(actionCreators.confirmEmail(userId, token)),
  };
};


const registerContainer = connect(mapStateToProps, mapDispatchToProps as any)(RegisterConfirm);

const RegisterConfirmRouted = withRouter<IRegisterConfirmProps>(registerContainer as any);

export {RegisterConfirmRouted as RegisterConfirm}