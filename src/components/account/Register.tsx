import * as React from 'react';
import {ValidatedInput} from '../_shared/ValidatedInput';
import {validateConfirmPasswordValue, validatePassword} from '../../utils/validateInput';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account';
import MdSpinner, {default as MDSpinner} from 'react-md-spinner';
import * as classNames from 'classnames';
//types
import {Dispatch} from '../../store/index'
import {IApplicationState} from "../../store/index";
import {ErrorMessage, ErrorScopeEnum, IErrorMessage} from "../../models/IError";
import {Map, OrderedMap} from "immutable";
import {Guid} from "../../models/Guid";

interface IRegisterDataProps {
  isSubmitEnabled: boolean;
  errors: Map<ErrorScopeEnum, OrderedMap<Guid, IErrorMessage>>;
}

interface IRegisterDispatchProps {
  onRegister: (userName: string, email: string, password: string, confirmPassword: string) => void;
}

type IRegisterProps = IRegisterDataProps & IRegisterDispatchProps;

interface IRegisterState {
  elements: RegisterElementsState;
  hasBeenSubmitted: boolean;
}

interface IInputState {
  value: string;
  isValid: boolean;
  errors: OrderedMap<Guid, IErrorMessage>;
}

interface RegisterElementsState {
  [key: string]: IInputState;

  email: IInputState;
  userName: IInputState;
  password: IInputState;
  confirmPassword: IInputState;
}

class Register extends React.PureComponent<IRegisterProps, IRegisterState> {
  static displayName = "Register";

  constructor(props: IRegisterProps) {
    super(props);

    this.state = {
      hasBeenSubmitted: false,
      elements: {
        email: {value: "", isValid: false, errors: OrderedMap()},
        userName: {value: "", isValid: false, errors: OrderedMap()},
        password: {value: "", isValid: false, errors: OrderedMap()},
        confirmPassword: {value: "", isValid: false, errors: OrderedMap()},
      }
    }
  }

  componentWillReceiveProps(nextProps: IRegisterProps) {
    const validNames = Object.keys(this.state.elements);
    nextProps.errors
      .filter((value, key) => validNames.some(n => n === key))
      .forEach(((value: OrderedMap<Guid, IErrorMessage>, key: ErrorScopeEnum) => {
        if (this.state.elements[key].errors !== value) {
          this.setState(prevState => ({
            elements: {
              ...prevState.elements,
              [key]: {
                value: prevState.elements[key].value,
                isValid: false,
                errors: value,
              }
            },
          }));
        }
      }));
  }

  _onRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {email, userName, password, confirmPassword} = this.state.elements;
    const isValid = email.isValid && userName.isValid && password.isValid && confirmPassword.isValid;

    this.setState(prevState => ({hasBeenSubmitted: true}));

    if (isValid) {
      this.props.onRegister(userName.value, email.value, password.value, confirmPassword.value);
    }
  };

  _setElementState(name: string, value: IInputState) {
    this.setState(prevState => ({
      elements: {
        ...prevState.elements,
        [name]: {...prevState.elements[name], ...value}
      }
    }))
  }

  _onInputChange = (name: string, value: string, isValid: boolean) => {
    let errors = OrderedMap<Guid, IErrorMessage>();
    let useCustomMessageFirst = ['confirmPassword', 'password'].some(v => v == name);

    if (isValid || useCustomMessageFirst) {
      switch (name) {
        case 'password':
          errors = validatePassword(value);
          // validate confirmPasswordAsWell as they are dependant
          const confirmedPasswordErrors = validateConfirmPasswordValue(value, this.state.elements.confirmPassword.value);
          this._setElementState('confirmPassword', {
            value: this.state.elements.confirmPassword.value,
            isValid: confirmedPasswordErrors.size === 0,
            errors: confirmedPasswordErrors
          });
          break;

        case 'confirmPassword':
          errors = errors.merge(validateConfirmPasswordValue(this.state.elements.password.value, value));
          break;
      }
    }
    const valid = isValid && errors.size === 0;
    this._setElementState(name, {value, isValid: valid, errors});
  };

  render() {
    const hasBeenSubmitted = this.state.hasBeenSubmitted;
    const {email, userName, password, confirmPassword} = this.state.elements;

    return (
      <div>
        <h2>Create new account</h2>
        <form onSubmit={this._onRegister} className="form-bordered" noValidate>
          <fieldset disabled={!this.props.isSubmitEnabled}>
            <ValidatedInput name="email"
                            addOnClassName="fa fa-fw fa-envelope-o"
                            type="email"
                            placeholder="E-mail"
                            value={email.value}
                            onChange={this._onInputChange}
                            errors={email.errors}
                            isValid={hasBeenSubmitted ? email.isValid : true}
                            required/>

            <ValidatedInput name="userName"
                            addOnClassName="fa fa-fw fa-user-o"
                            hintText="Username must be 4-20 characters long."
                            type="text"
                            placeholder="Username"
                            value={userName.value}
                            onChange={this._onInputChange}
                            errors={userName.errors}
                            isValid={hasBeenSubmitted ? userName.isValid : true}
                            minLength={4} maxLength={20} required/>

            <ValidatedInput name="password"
                            addOnClassName="fa fa-fw fa-key"
                            hintText="You password must be 8-20 characters long with 6 unique letters, contain uppercase/lowercase letters and numbers."
                            type="password"
                            placeholder="Password"
                            value={password.value}
                            onChange={this._onInputChange}
                            errors={password.errors}
                            isValid={hasBeenSubmitted ? password.isValid : true}
                            minLength={8} maxLength={20} required/>

            <ValidatedInput name="confirmPassword"
                            addOnClassName="fa fa-fw fa-key"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword.value}
                            onChange={this._onInputChange}
                            errors={confirmPassword.errors}
                            isValid={hasBeenSubmitted ? confirmPassword.isValid : true}
                            minLength={8} maxLength={20} required/>

            <div>
              <button type="submit" className="btn btn-dark btn-active">Create account <MDSpinner size={20}
                                                                                                  className={classNames('button-spinner', {'d-none': this.props.isSubmitEnabled})}/>
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  };
}

const mapStateToProps = (state: IApplicationState): IRegisterDataProps => {
  return {
    isSubmitEnabled: !state.account.isLoading,
    errors: state.errorNotifications.errors,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IRegisterDispatchProps => {
  return {
    onRegister: (userName: string, email: string, password: string, confirmPassword: string) => dispatch(actionCreators.register(userName, email, password, confirmPassword)),
  };
};

const registerContainer = connect<IRegisterDataProps, IRegisterDispatchProps>(mapStateToProps, mapDispatchToProps)(Register);

export {registerContainer as Register};
// TODO: add notifications for 'application'
