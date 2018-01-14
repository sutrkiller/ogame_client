import * as React from 'react';
import {ValidatedInput} from '../_shared/ValidatedInput';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account';
import {default as MDSpinner} from 'react-md-spinner';
import * as classNames from 'classnames';
//types
import {IApplicationState, Dispatch} from "../../store";
import {IFieldError} from "../../models/IError";
import {OrderedMap} from "immutable";
import {Guid} from "../../models/Guid";
import {NavLink} from "react-router-dom";
import {ROUTE_FORGOT_PASSWORD, ROUTE_REGISTER} from "../../config/routes";

interface ISignInDataProps {
  isSubmitEnabled: boolean;
  errors: OrderedMap<Guid, IFieldError>;
}

interface ISignInDispatchProps {
  onSignIn: (email: string, password: string) => void;
}

type ISignInProps = ISignInDataProps & ISignInDispatchProps;

interface ISignInState {
  elements: SignInElementsState;
  hasBeenSubmitted: boolean;
  //rememberMe: boolean;
}

interface IInputState {
  value: string;
  isValid: boolean;
  errors: OrderedMap<Guid, IFieldError>;
}

interface SignInElementsState {
  //indexer
  [key: string]: IInputState;

  email: IInputState;
  password: IInputState;
}

class SignIn extends React.PureComponent<ISignInProps, ISignInState> {
  static displayName = "SignIn";

  constructor(props: ISignInProps) {
    super(props);

    this.state = {
      hasBeenSubmitted: false,
      // rememberMe: false,
      elements: {
        email: {value: "", isValid: false, errors: OrderedMap()},
        password: {value: "", isValid: false, errors: OrderedMap()},
      }
    }
  }

  componentWillReceiveProps(nextProps: ISignInProps) {
    const elementNames = this._changedElementName(nextProps);
    if (elementNames.length === 0) {
      return;
    }
    this.setState(prevState => ({
      elements: {
        ...prevState.elements,
        ...elementNames.reduce((prev, cur) => ({
          ...prev,
          ...this._getErrorsFromState(prevState, nextProps, cur),
        }), {})
      }
    }));
  }

  _changedElementName = (nextProps: ISignInProps) => {
    const elementNames = Object.keys(this.state.elements);
    let changedElements: string[] = [];
    for (let i = 0; i < elementNames.length; ++i) {
      const el = elementNames[i];
      if (this.state.elements[el].errors !== nextProps.errors.filter((v: IFieldError) => v.field === el)) {
        changedElements = [...changedElements, el];
      }
    }
    return changedElements;
  };

  _getErrorsFromState = (state: ISignInState, props: ISignInProps, name: string) => {
    const errors = props.errors.filter((x: IFieldError) => x.field === name);
    return {
      [name]: {...state.elements[name], isValid: errors.size === 0, errors: errors}
    }
  };

  _onSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {email, password} = this.state.elements;
    const isValid = email.isValid && password.isValid;

    this.setState(() => ({hasBeenSubmitted: true}));

    if (isValid) {
      this.props.onSignIn(email.value, password.value);
      this._setElementState("password", {value: '', isValid: true, errors: OrderedMap<Guid, IFieldError>()});
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
    this._setElementState(name, {value, isValid, errors});
  };

  // _rememberMeChange = () => {
  //   this.setState(prevState => ({rememberMe: !prevState.rememberMe}));
  // };

  render() {
    const hasBeenSubmitted = this.state.hasBeenSubmitted;
    const {email, password} = this.state.elements;
    return (
      <div>
        <button onClick={() => {
          this.setState(prev => ({
            ...prev,
            elements: {
              email: {...prev.elements.email, value: "tobias.kamenicky@gmail.com", isValid: true},
              password: {...prev.elements.password, value: "Password1", isValid: true},
            }
          }))
        }}>Cheat
        </button>


        <form onSubmit={this._onSignIn} className="form-bordered form-sign-in" noValidate>
          <fieldset disabled={!this.props.isSubmitEnabled}>
            <ValidatedInput name="email"
                            addOnClassName="far fa-fw fa-envelope"
                            type="email"
                            placeholder="E-mail"
                            value={email.value}
                            onChange={this._onInputChange}
                            errors={email.errors}
                            isValid={hasBeenSubmitted ? email.isValid : true}
                            required/>

            <ValidatedInput name="password"
                            addOnClassName="fas fa-fw fa-key"
                            type="password"
                            placeholder="Password"
                            value={password.value}
                            onChange={this._onInputChange}
                            errors={password.errors}
                            isValid={hasBeenSubmitted ? password.isValid : true}
                            required/>

            {/*<label className="custom-control custom-checkbox">*/}
            {/*<input type="checkbox" className="custom-control-input form-input-checkbox"*/}
            {/*onChange={this._rememberMeChange}*/}
            {/*checked={this.state.rememberMe}/>*/}
            {/*<span className="custom-control-indicator"/>*/}
            {/*<span className="custom-control-description">Check this custom checkbox</span>*/}
            {/*</label>*/}

            <div className="sign-in-buttons">
              <button type="submit" className="button confirm">
                <div className='button-content'>
                  <span>Sign in</span>
                </div>
                <div className="button-icon confirm">
                  {this.props.isSubmitEnabled
                    ? <span className="fas fa-fw fa-chevron-right fa-lg"/>
                    : <MDSpinner size={20} className={classNames('button-spinner', {'d-none': false})}/>
                  }
                </div>
              </button>
              {/*<div className="sign-in-buttons-register">*/}
                <NavLink className="nav-link-button nav-link-secondary" to={ROUTE_REGISTER}>Don't have an account?</NavLink>
              {/*</div>*/}
            </div>
          </fieldset>
        </form>
        <NavLink className="nav-link-button nav-link-secondary" to={ROUTE_FORGOT_PASSWORD}>Forgot password?</NavLink>
      </div>
    );
  };
}

const mapStateToProps = (state: IApplicationState, ownProps: any): ISignInDataProps => {
  return {
    isSubmitEnabled: !state.account.isLoading,
    errors: state.notifications.validationErrors,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ISignInDispatchProps => {
  return {
    onSignIn: (email: string, password: string) => dispatch(actionCreators.signIn(email, password))
  };
};

const signInContainer = connect<ISignInDataProps, ISignInDispatchProps>(mapStateToProps, mapDispatchToProps)(SignIn);

export {signInContainer as SignIn};
