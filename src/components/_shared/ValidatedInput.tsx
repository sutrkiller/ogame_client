import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as classNames from 'classnames';

interface ValidatedInputProps {
  value: string;
  name: string;
  placeholder: string;
  type: string;
  addOnClassName: string;

  isValid?: boolean;
  errors?: string[];

  hintText?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;

  onChange: (name: string, value: string, isValid: boolean) => void;
}

interface ValidatedInputState {
  value: string;
}

class ValidatedInput extends React.PureComponent<ValidatedInputProps, ValidatedInputState> {
  static displayName = "ValidatedInput";
  static propTypes = {
    value: PropTypes.string,

    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    addOnClassName: PropTypes.string.isRequired,

    isValid: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.string),

    hintText: PropTypes.string,
    required: PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,

    onChange: PropTypes.func.isRequired,
  };

  _input:HTMLInputElement|null = null;

  _onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    this.props.onChange(this.props.name, value, event.currentTarget.checkValidity());
  };

  _renderErrors = () => {
    const errors = this.props.errors && this.props.errors.length
      ? this.props.errors  //
      : [this._input ? this._input.validationMessage : "Invalid input"];

    return <ul className="form-input-error-list">{errors.map(value => <li key={value}>{value}</li>)}</ul>
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
