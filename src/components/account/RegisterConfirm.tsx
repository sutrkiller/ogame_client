import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Guid} from "../../models/Guid";
import {IApplicationState} from "../../store/index";
import {Dispatch} from "../../store/index";
import {actionCreators} from "../../store/Account";
import {connect} from "react-redux";
import {GuidEmpty} from "../../utils/constants";

interface IRegisterConfirmDataProps {
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
    return <noscript/>;
  }
}

const mapStateToProps = (state: IApplicationState): IRegisterConfirmDataProps => {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch) : IRegisterConfirmDispatchProps => {
  return {
    onConfirmEmail: (userId: Guid, token: string) => dispatch(actionCreators.confirmEmail(userId, token)),
  };
};


const registerConfirmContainer = connect(mapStateToProps, mapDispatchToProps as any)(RegisterConfirm);
const RegisterConfirmRouted = withRouter<IRegisterConfirmProps>(registerConfirmContainer);

export {RegisterConfirmRouted as RegisterConfirm}