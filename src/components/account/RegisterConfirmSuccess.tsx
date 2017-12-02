import * as React from 'react';
import {Link} from "react-router-dom";
import {ROUTE_HOME, ROUTE_SIGN_IN} from "../../config/routes";

export interface IRegisterConfirmSuccessProps {
  isAuthenticated: boolean;
}

export const RegisterConfirmSucess: React.StatelessComponent<IRegisterConfirmSuccessProps> = (props: IRegisterConfirmSuccessProps) => {
      const href = props.isAuthenticated ? <Link replace to={ROUTE_HOME}>main page.</Link> : <Link replace to={ROUTE_SIGN_IN}>sign-in.</Link>
      return (<div className="text-message">
      <p className="text-center"><strong>Congratulations,<br/> you have successfully confirmed an account!</strong></p>
      <p className="text-center">Go to {href}</p>
    </div>);
};

RegisterConfirmSucess.displayName = "RegisterConfirmSuccess";