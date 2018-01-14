import * as React from 'react';
import {IApplicationState, Dispatch} from "../../store";
import {connect} from "react-redux";
import {CreateRunnerInput} from "./CreateRunnerInput";
import {OrderedMap} from "immutable";
import {ErrorFieldEnum, IFieldError} from "../../models/IError";
import {Guid} from "../../models/Guid";
import * as classNames from "classnames";
import MDSpinner from "react-md-spinner";

interface ICreateRunnerOwnProps {
}

interface ICreateRunnerDataProps {
  errors: OrderedMap<Guid, IFieldError>;
  isSubmitEnabled: boolean;
}

interface ICreateRunnerDispatchProps {
}

type CreateRunnerProps = ICreateRunnerDataProps & ICreateRunnerDispatchProps;

interface ICreateRunnerState {
  name: string;
  country: string;
  age: number;
  formValid: OrderedMap<string, boolean>;
  errors: OrderedMap<Guid, IFieldError>
}

class CreateRunner extends React.PureComponent<CreateRunnerProps, ICreateRunnerState> {
  static displayName = "CreateRunner";

  constructor(props: CreateRunnerProps) {
    super(props);

    this.state = {
      name: '',
      age: 21,
      country: '',
      formValid: OrderedMap({name: false, age: true, country: false}),
      errors: props.errors
    }
  }

  _onSubmit = () => {
  };

  _onChange = (name: string, value: any, isValid: boolean) => {
    this.setState(prev => ({
      [name]: value,
      formValid: prev.formValid.set(name, isValid),
      errors: OrderedMap()
    }))
  };

  render() {
    return (
      <form onSubmit={this._onSubmit} className="form-bordered" noValidate>
        <CreateRunnerInput value={this.state.name} name={ErrorFieldEnum.Name} placeholder="Enter runner's name"
                           type='text' addOnClassName="far fa-fw fa-user" onValidate={() => OrderedMap()}
                           onChange={this._onChange} maxLength={50} minLength={4} required errors={this.state.errors.filter(v => !!v && v.field === ErrorFieldEnum.Name) as OrderedMap<Guid, IFieldError>}/>
        <div>
          <button type="submit" className="button confirm">
            <div className='button-content'>
              <span>Create account</span>
            </div>
            <div className="button-icon confirm">
              {this.props.isSubmitEnabled
                ? <span className="fas fa-fw fa-chevron-right fa-lg"/>
                : <MDSpinner size={20} className={classNames('button-spinner', {'d-none': false})}/>
              }
            </div>
          </button>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state: IApplicationState, ownProps: ICreateRunnerOwnProps): ICreateRunnerDataProps => {
  return {
    errors: state.notifications.validationErrors,
    isSubmitEnabled: false, //TODO: !state.runner.isLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ICreateRunnerDispatchProps => {
  return {};
};

const container = connect(mapStateToProps, mapDispatchToProps)(CreateRunner);

export {container as CreateRunner}