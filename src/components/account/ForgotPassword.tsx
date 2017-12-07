import * as React from 'react';
import {Guid} from "../../models/Guid";
import {OrderedMap} from "immutable";
import {IFieldError} from "../../models/IError";
import {ValidatedInput} from "../_shared/ValidatedInput";
import MDSpinner from "react-md-spinner";
import {Dispatch, IApplicationState} from "../../store";
import {connect} from "react-redux";
import {actionCreators} from "../../store/Account";
import {RouteComponentProps, withRouter} from "react-router";
import {GuidEmpty} from "../../utils/constants";
import {ForgotPasswordSucess} from "./success/ForgotPasswordSuccess";

interface IForgotPasswordDataProps {
  isSubmitEnabled: boolean;
  errors: OrderedMap<Guid, IFieldError>;
  forgotToken: Guid;
}

interface IForgotPasswordDispatchProps {
  onSubmit: (email: string) => void;
}

type IForgotPasswordRoutedProps = RouteComponentProps<IForgotPasswordDataProps>;
type IForgotPasswordProps = IForgotPasswordDataProps & IForgotPasswordDispatchProps & IForgotPasswordRoutedProps;

interface IForgotPasswordState {
  hasBeenSubmitted: boolean;
  email: string;
  isValid: boolean;
  errors: OrderedMap<Guid, IFieldError>;
  showSuccess: boolean;
}

class ForgotPassword extends React.PureComponent<IForgotPasswordProps, IForgotPasswordState> {
  static displayName = "ForgotPassword";

  _forgotToken: Guid | null;

  constructor(props: IForgotPasswordProps) {
    super(props);

    this.state = {
      email: '',
      hasBeenSubmitted: false,
      isValid: true,
      errors: OrderedMap(),
      showSuccess: false
    }
  }

  componentDidMount() {
    this._validateForgotPasswordToken(this.props);
  }

  componentWillReceiveProps(nextProps: IForgotPasswordProps) {
    this._validateForgotPasswordToken(this.props);

    const errors = nextProps.errors.filter((x: IFieldError) => x.field === 'email');
    if (this.state.errors === errors) return;

    this.setState(prevState => ({
      ...prevState,
      isValid: errors.size === 0,
      errors
    }));
  }

  _validateForgotPasswordToken = (props: IForgotPasswordProps) => {
    const params = new URLSearchParams(props.location.search);
    this._forgotToken = params.get("token") || GuidEmpty;

    if (this._forgotToken !== GuidEmpty && this._forgotToken === props.forgotToken) {
      this.setState(() => ({showSuccess: true}))
    }
  };

  _onInputChange = (_: string, email: string, isValid: boolean) => {
    let errors = OrderedMap<Guid, IFieldError>();
    this.setState(() => ({
      email,
      isValid,
      errors
    }))
  };

  _onForgotPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState(() => ({hasBeenSubmitted: true}));

    if (this.state.isValid) {
      this.props.onSubmit(this.state.email);
    }
  };

  render() {
    if (this.state.showSuccess) {
      return <ForgotPasswordSucess/>
    }

    return (
      <div>
        <form onSubmit={this._onForgotPassword} className="form-bordered form-sign-in" noValidate>
          <fieldset disabled={!this.props.isSubmitEnabled}>
            <ValidatedInput name="email"
                            addOnClassName="fa fa-fw fa-envelope-o"
                            type="email"
                            placeholder="E-mail"
                            value={this.state.email}
                            onChange={this._onInputChange}
                            errors={this.state.errors}
                            isValid={this.state.hasBeenSubmitted ? this.state.isValid : true}
                            required/>
            <div>
              <button type="submit" className="button confirm">
                <div className='button-content'>
                  <span>Reset password</span>
                </div>
                <div className="button-icon confirm">
                  {this.props.isSubmitEnabled
                    ? <span className="fa fa-fw fa-chevron-right fa-lg"/>
                    : <MDSpinner size={20} className="button-spinner"/>
                  }
                </div>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state: IApplicationState): IForgotPasswordDataProps => {
  return {
    isSubmitEnabled: !state.account.isLoading,
    errors: state.notifications.validationErrors,
    forgotToken: state.account.successTokens.forgotToken,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IForgotPasswordDispatchProps => {
  return {
    onSubmit: (email: string) => dispatch(actionCreators.forgotPassword(email))
  };
};

const forgotPasswordContainer = connect(mapStateToProps, mapDispatchToProps as any)(ForgotPassword);
const ForgotPasswordRouted = withRouter<IForgotPasswordProps>(forgotPasswordContainer);

export {ForgotPasswordRouted as ForgotPassword};
