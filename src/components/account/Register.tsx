import * as React from 'react';
import {ValidatedInput} from '../_shared/ValidatedInput';
import {validateConfirmPasswordValue, validatePassword} from '../../utils/validateInput';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account';
import {default as MDSpinner} from 'react-md-spinner';
import * as classNames from 'classnames';
//types
import {Dispatch} from '../../store/index'
import {IApplicationState} from "../../store/index";
import {IFieldError} from "../../models/IError";
import { OrderedMap} from "immutable";
import {Guid} from "../../models/Guid";

interface IRegisterDataProps {
  isSubmitEnabled: boolean;
  errors: OrderedMap<Guid, IFieldError>;
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
  errors: OrderedMap<Guid, IFieldError>;
}

interface RegisterElementsState {
  //indexer
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
    const elementNames = this._changedElementName(nextProps);
    if (elementNames.length === 0) {
      return;
    }
    this.setState(prevState => ({
      elements: {
        ...prevState.elements,
        ...elementNames.reduce((prev, cur )=> ({
          ...prev,
          ...this._getErrorsFromState(prevState, nextProps, cur),
        }), {})}
    }));
  }

  _changedElementName = (nextProps: IRegisterProps) => {
    const elementNames = Object.keys(this.state.elements);
    let changedElements: string[] = [];
    for(let i=0;i<elementNames.length; ++i) {
      const el = elementNames[i];
      if (this.state.elements[el].errors !== nextProps.errors.filter((v: IFieldError) => v.field === el)) {
        changedElements = [...changedElements, el];
      }
    }
    return changedElements;
  };

  _getErrorsFromState = (state: IRegisterState, props: IRegisterProps,  name: string) => {
    const errors = props.errors.filter((x: IFieldError) => x.field === name);
    return {
      [name]: {...state.elements[name], isValid: errors.size === 0, errors: errors}
    }
  };

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
    let errors = OrderedMap<Guid, IFieldError>();
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
        <button onClick={() => {
          this.setState(prev => ({
            ...prev,
            elements: {
              email: {...prev.elements.email, value: "tobias.kamenicky@gmail.com", isValid: true},
              userName: {...prev.elements.userName, value: "username", isValid: true},
              password: {...prev.elements.password, value: "Password1", isValid: true},
              confirmPassword: {...prev.elements.confirmPassword, value: "Password1", isValid: true},
            }
          }))
        }}>Cheat </button>


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
              <button type="submit" className="button confirm">
                <div className='button-content'>
                  <span>Create account</span>
                </div>
                <div className="button-icon confirm">
                  {this.props.isSubmitEnabled
                    ? <span className="fa fa-fw fa-chevron-right fa-lg"/>
                    : <MDSpinner size={20} className={classNames('button-spinner', {'d-none': false})}/>
                  }
                </div>
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
    errors: state.notifications.validationErrors,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IRegisterDispatchProps => {
  return {
    onRegister: (userName: string, email: string, password: string, confirmPassword: string) => dispatch(actionCreators.register(userName, email, password, confirmPassword)),
  };
};

const registerContainer = connect<IRegisterDataProps, IRegisterDispatchProps>(mapStateToProps, mapDispatchToProps)(Register);

export {registerContainer as Register};
