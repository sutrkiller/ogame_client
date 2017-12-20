import * as React from 'react';
import * as classNames from 'classnames';
import {IFieldError} from "../../models/IError";
import {OrderedMap} from "immutable";
import {Guid} from "../../models/Guid";

interface IValidatedInputDataProps {
  value: string;
  name: string;
  placeholder: string;
  type: string;
  addOnClassName: string;

  isValid?: boolean;
  errors?: OrderedMap<Guid, IFieldError>;

  hintText?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

interface IValidatedInputDispatchProps {
  onChange: (name: string, value: string, isValid: boolean) => void;
}

type IValidatedInputProps = IValidatedInputDataProps & IValidatedInputDispatchProps;

interface IValidatedInputState {
  value: string;
}

class ValidatedInput extends React.PureComponent<IValidatedInputProps, IValidatedInputState> {
  static displayName = "ValidatedInput";

  _input: HTMLInputElement | null = null;

  _onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    this.props.onChange(this.props.name, value, event.currentTarget.checkValidity());
  };

  _renderErrors = () => {
    if (this.props.errors && this.props.errors.size) {
      return <ul className="form-input-error-list">
        {
          this.props.errors.valueSeq().toArray().map((value: IFieldError) =>
            <li key={value.id}>{value.text}</li>)
        }
      </ul>
    }

    const defaultMessage = this._input ? this._input.validationMessage : "Invalid input";
    return <ul className="form-input-error-list">
      <li key={"default"}>{defaultMessage}</li>
    </ul>
  };

  render() {
    const inputProps = {
      required: this.props.required,
      minLength: this.props.minLength,
      maxLength: this.props.maxLength,
      name: this.props.name,
      type: this.props.type,
      placeholder: this.props.placeholder,
      value: this.props.value,
    };

    if (name === 'password') {
      debugger;
    }

    return (
      <div className="form-group">
        <div className="input-group" aria-describedby={this.props.name + '_help'}>
          <div className="input-group-addon">
            <span className={this.props.addOnClassName}/>
          </div>
          <input ref={(elem) => this._input = elem} {...inputProps}
                 className={classNames("form-control", {"is-invalid": !this.props.isValid})}
                 onChange={this._onInputChange}/>
        </div>
        <small id={this.props.name + '_help'}
               className={classNames({
                 "form-text text-muted": this.props.isValid,
                 "form-invalid-feedback": !this.props.isValid,
               })}
        >
          {
            this.props.isValid
              ? this.props.hintText
              : this._renderErrors()
          }
        </small>
      </div>
    );
  };
}

export {ValidatedInput};
