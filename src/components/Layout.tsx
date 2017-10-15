import * as React from 'react';
import {NavMenu} from './NavMenu';

export class Layout extends React.PureComponent<{}, {}> {
  render() {
    return <div className='container-fluid'>
      <div className='row no-gutters'>
        <div className='col-xs-0 col-md-3 col-max-250'>
          <NavMenu/>
        </div>
        <div className='col-xs-12 col-md-9'>
          {this.props.children}
        </div>
      </div>
    </div>;
  }
}
