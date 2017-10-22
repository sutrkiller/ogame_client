import * as React from 'react';
import {ValidatedInput} from '../_shared/ValidatedInput';
import {validatePassword} from '../../utils/validateInput';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account'

//types
import {Dispatch} from '../../store/index'
import {ApplicationState} from "../../store/index";

interface RegisterProps {
  onRegister: (userName:string, email:string, password:string, confirmPassword:string) => void;
}

interface RegisterState {
  elements: RegisterElementsState;
  hasBeenSubmitted: boolean;
}

interface InputState {
  value: string;
  isValid: boolean;
  errors: string[];
}

interface RegisterElementsState {
  email: InputState;
  userName: InputState;
  password: InputState;
  confirmPassword: InputState;
}

class Register extends React.PureComponent<RegisterProps, RegisterState> {
  static displayName = "Register";

  constructor(props: RegisterProps) {
    super(props);

    this.state = {
      hasBeenSubmitted: false,
      elements: {
        email: {value: "", isValid: false, errors: []},
        userName: {value: "", isValid: false, errors: []},
        password: {value: "", isValid: false, errors: []},
        confirmPassword: {value: "", isValid: false, errors: []},
      }
    }
  }

  _onRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {email, userName, password, confirmPassword} = this.state.elements;
    const isValid = email.isValid &&  userName.isValid && password.isValid && confirmPassword.isValid;

    this.setState(prevState => ({hasBeenSubmitted: true}));

    if (isValid) {
      this.props.onRegister(userName.value, email.value, password.value, confirmPassword.value);
    }
  };

  _onInputChange = (name: string, value: string, isValid: boolean) => {
    let errors:string[] = [];
    let useDefaultMessageFirst = name === 'confirmPassword';

    if (isValid || useDefaultMessageFirst) {
      switch (name) {
        case 'password':
          errors = validatePassword(value);
          break;

        case 'confirmPassword':
          errors = this.state.elements.password.value === value ? [] : ["The passwords must match."];
          break;
      }
    }
    const valid = isValid && errors.length === 0;
    this.setState(prevState => ({
      elements: {
        ...prevState.elements,
        [name]: {value, isValid: valid, errors}
      }
    }))
  };

  render() {
    const hasBeenSubmitted = this.state.hasBeenSubmitted;
    const {email, userName, password, confirmPassword} = this.state.elements;

    return (
      <div>
        <h2>Create new account</h2>
        <form onSubmit={this._onRegister} className="form-bordered" noValidate>

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

          <button type="submit" className="btn btn-dark btn-active">Create account</button>
        </form>
      </div>
    );
  };
}

const mapStateToProps = (state: ApplicationState, ownProps: RegisterProps) => {
  return ownProps;
};

const mapDispatchToProps = (dispatch:Dispatch, ) => {
  return {
    onRegister: (userName: string, email:string, password:string, confirmPassword:string) => dispatch(actionCreators.register(userName,email,password, confirmPassword)),
  };
};

const registerContainer = connect<RegisterProps>(mapStateToProps, mapDispatchToProps)(Register);

export {registerContainer as Register};
