import * as React from 'react';
import {Link} from "react-router-dom";
import {ROUTE_SIGN_IN} from "../../config/routes";

export const RegisterConfirmSucess: React.StatelessComponent = () => {
      return (<div className="text-message">
      <p className="text-center"><strong>Congratulations,<br/> you have successfully confirmed an account!</strong></p>
      <p className="text-center">Go to <Link to={ROUTE_SIGN_IN}>sign-in.</Link></p>
    </div>);
};

RegisterConfirmSucess.displayName = "RegisterConfirmSuccess";