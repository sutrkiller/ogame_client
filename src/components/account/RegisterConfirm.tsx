import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {Guid} from "../../models/Guid";
import {IApplicationState} from "../../store/index";
import {Dispatch} from "../../store/index";
import {actionCreators} from "../../store/Account";
import {connect} from "react-redux";
import {GuidEmpty} from "../../utils/constants";
import {RegisterConfirmSucess} from "./RegisterConfirmSuccess";

interface IRegisterConfirmDataProps {
  confirmToken: Guid;
  isAuthenticated: boolean;
}

interface IRegisterConfirmDispatchProps {
  onConfirmEmail: (userId: Guid, token: string) => void;
}

type IRegisterConfirmRoutedProps = RouteComponentProps<IRegisterConfirmDataProps>
type IRegisterConfirmProps = IRegisterConfirmRoutedProps & IRegisterConfirmDataProps & IRegisterConfirmDispatchProps;

interface IRegisterConfirmState {
  showSuccess: boolean;
}

class RegisterConfirm extends React.PureComponent<IRegisterConfirmProps, IRegisterConfirmState> {
  static displayName = "RegisterConfirm";

  _confirmToken: Guid;

  constructor(props: IRegisterConfirmProps) {
    super(props);

    this.state = {
      showSuccess: false,
    }
  }

  componentDidMount() {
    if (this._validateRegisterToken(this.props)) {
      return;
    }

    const params = new URLSearchParams(this.props.location.search);
    const userId = params.get("userId") || GuidEmpty;
    const token = params.get("token") || "";
    this.props.onConfirmEmail(userId, token);
  }

  componentWillReceiveProps(nextProps: IRegisterConfirmProps) {
    this._validateRegisterToken(nextProps);
  }

  _validateRegisterToken = (props: IRegisterConfirmProps): boolean => {
    const params = new URLSearchParams(props.location.search);
    this._confirmToken = params.get("token") || GuidEmpty;

    if (this._confirmToken !== GuidEmpty && this._confirmToken === props.confirmToken) {
      this.setState(prev => ({showSuccess: true}));
      return true;
    }
    return false;
  };

  render() {
    return this.state.showSuccess ? <RegisterConfirmSucess isAuthenticated={this.props.isAuthenticated} /> : <noscript/>;
  }
}

const mapStateToProps = (state: IApplicationState): IRegisterConfirmDataProps => {
  return {
    confirmToken: state.account.successTokens.confirmToken,
    isAuthenticated: state.account.isAuthenticated
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