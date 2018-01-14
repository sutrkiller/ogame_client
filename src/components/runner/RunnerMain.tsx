import * as React from 'react';
import * as ReactModal from 'react-modal';
import {Dispatch, IApplicationState} from "../../store";
import {connect} from "react-redux";
import * as classNames from 'classnames';
import {CreateRunner} from './CreateRunner';

interface IRunnerMainOwnProps {
}

interface IRunnerMainDataProps {
}

interface IRunnerMainDispatchProps {
}

type RunnerMainProps = IRunnerMainDataProps & IRunnerMainDispatchProps;

interface IRunnerMainState {
  runnerExists: boolean;
}

class RunnerMain extends React.PureComponent<RunnerMainProps, IRunnerMainState> {
  static displayName = "RunnerMain";

  constructor(props: RunnerMainProps) {
    super(props);

    this.state = {
      runnerExists: false
    }
  }

  render() {
    return (
      <div>
        {/*<ReactModal*/}
          {/*contentLabel="Create runner page"*/}
          {/*isOpen={!this.state.runnerExists}*/}
          {/*appElement={document.body}*/}
          {/*onRequestClose={() => this.setState(prev => ({runnerExists: true}))}*/}
          {/*shouldCloseOnOverlayClick={true}*/}
          {/*className="modal-create-runner"*/}
          {/*overlayClassName="overlay-create-runner"*/}
        {/*>*/}
          {/*<div>*/}
            {/*<h5>Create your runner, please.</h5>*/}
            {/*<label>Name</label><input type="text"/>*/}
            {/*<label>Country</label><input type="text"/>*/}
            {/*<button>Create</button>*/}
          {/*</div>*/}
        {/*</ReactModal>*/}
<CreateRunner />
        {!this.state.runnerExists
          ? <noscript />
          : <h1>Runner page</h1>
        }
      </div>
    )
  }
}

const mapStateToProps = (state: IApplicationState, ownProps: IRunnerMainOwnProps): IRunnerMainDataProps => {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IRunnerMainDispatchProps => {
  return {
  };
};

const container = connect(mapStateToProps, mapDispatchToProps)(RunnerMain);

export {container as RunnerMain}