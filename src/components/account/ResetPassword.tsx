import * as React from 'react';
import {ValidatedInput} from '../_shared/ValidatedInput';
import {validateConfirmPasswordValue, validatePassword} from '../../utils/validateInput';
import {connect} from "react-redux";
import {actionCreators} from '../../store/Account';
import {default as MDSpinner} from 'react-md-spinner';
import * as classNames from 'classnames';
//types
import {Dispatch, IApplicationState} from '../../store'
import {IFieldError} from "../../models/IError";
import {OrderedMap} from "immutable";
import {Guid} from "../../models/Guid";
import {GuidEmpty} from "../../utils/constants";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {ResetPasswordSucess} from "./success/ResetPasswordSuccess";
import {replace} from "react-router-redux";
import {ROUTE_HOME} from "../../config/routes";

interface IResetPasswordDataProps {
  isSubmitEnabled: boolean;
  errors: OrderedMap<Guid, IFieldError>;
  resetToken: Guid;
}

interface IResetPasswordDispatchProps {
  onInvalidParameters: () => void;
  onResetPassword: (userId: Guid, token: string, password: string, confirmPassword: string) => void;
}

type IResetRoutedProps = RouteComponentProps<IResetPasswordDataProps>;
type IResetPasswordProps = IResetPasswordDataProps & IResetPasswordDispatchProps & IResetRoutedProps;

interface IResetPasswordState {
  showSuccess: boolean;
  elements: ResetPasswordElementsState;
  hasBeenSubmitted: boolean;
}

interface IInputState {
  value: string;
  isValid: boolean;
  errors: OrderedMap<Guid, IFieldError>;
}

interface ResetPasswordElementsState {
  //indexer
  [key: string]: IInputState;

  password: IInputState;
  confirmPassword: IInputState;
}

class ResetPassword extends React.PureComponent<IResetPasswordProps, IResetPasswordState> {
  static displayName = "ResetPassword";

  _resetToken: Guid | null;
  _userId: Guid = GuidEmpty;
  _token: string = '';

  constructor(props: IResetPasswordProps) {
    super(props);

    this.state = {
      showSuccess: false,
      hasBeenSubmitted: false,
      elements: {
        password: {value: "", isValid: false, errors: OrderedMap()},
        confirmPassword: {value: "", isValid: false, errors: OrderedMap()},
      }
    }
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this._userId = params.get("userId") || GuidEmpty;
    this._token = params.get("token") || '';

    if (this._userId === GuidEmpty || this._token === '') {
      this.props.onInvalidParameters();
      return;
    }

    this._validateResetPasswordToken(this.props);
  }

  componentWillReceiveProps(nextProps: IResetPasswordProps) {
    this._validateResetPasswordToken(nextProps);

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

  _validateResetPasswordToken = (props: IResetPasswordProps) => {
    const params = new URLSearchParams(props.location.search);
    this._resetToken = params.get("token") || GuidEmpty;

    if (this._resetToken !== GuidEmpty && this._resetToken === props.resetToken) {
      this.setState(() => ({showSuccess: true}))
    }
  };

  _changedElementName = (nextProps: IResetPasswordProps) => {
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

  _getErrorsFromState = (state: IResetPasswordState, props: IResetPasswordProps, name: string) => {
    const errors = props.errors.filter((x: IFieldError) => x.field === name);
    return {
      [name]: {...state.elements[name], isValid: errors.size === 0, errors: errors}
    }
  };

  _onResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {password, confirmPassword} = this.state.elements;
    const isValid = password.isValid && confirmPassword.isValid;

    this.setState(() => ({hasBeenSubmitted: true}));

    if (isValid) {
      this.props.onResetPassword(this._userId, this._token, password.value, confirmPassword.value);
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
    if (this.state.showSuccess) {
      return <ResetPasswordSucess />
    }

    const hasBeenSubmitted = this.state.hasBeenSubmitted;
    const {password, confirmPassword} = this.state.elements;
    return (
      <div>
        <form onSubmit={this._onResetPassword} className="form-bordered" noValidate>
          <fieldset disabled={!this.props.isSubmitEnabled}>
            <ValidatedInput name="password"
                            addOnClassName="fas fa-fw fa-key"
                            hintText="You password must be 8-20 characters long with 6 unique letters, contain uppercase/lowercase letters and numbers."
                            type="password"
                            placeholder="Password"
                            value={password.value}
                            onChange={this._onInputChange}
                            errors={password.errors}
                            isValid={hasBeenSubmitted ? password.isValid : true}
                            minLength={8} maxLength={20} required/>

            <ValidatedInput name="confirmPassword"
                            addOnClassName="fas fa-fw fa-key"
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
                  <span>Set new password</span>
                </div>
                <div className="button-icon confirm">
                  {this.props.isSubmitEnabled
                    ? <span className="fas fa-fw fa-chevron-right fa-lg"/>
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

const mapStateToProps = (state: IApplicationState): IResetPasswordDataProps => {
  return {
    isSubmitEnabled: !state.account.isLoading,
    errors: state.notifications.validationErrors,
    resetToken: state.account.successTokens.resetToken,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IResetPasswordDispatchProps => {
  return {
    onInvalidParameters: () => dispatch(replace(ROUTE_HOME)),
    onResetPassword: (userId: Guid, token: string, password: string, confirmPassword: string) => dispatch(actionCreators.resetPassword(userId, token, password, confirmPassword)),
  };
};

const registerContainer = connect(mapStateToProps, mapDispatchToProps as any)(ResetPassword);
const resetRouted = withRouter<IResetPasswordProps>(registerContainer);

export {resetRouted as ResetPassword};
