import * as React from 'react';
import {Link} from "react-router-dom";
import {ROUTE_SIGN_IN} from "../../../config/routes";

export interface IResetPasswordSuccessProps {
}

export const ResetPasswordSucess: React.StatelessComponent<IResetPasswordSuccessProps> = () => {
      return (<div className="text-message">
      <p className="text-center"><strong>Congratulations,<br/> you have successfully reset a password!</strong></p>
      <p className="text-center">Proceed to <Link replace to={ROUTE_SIGN_IN}>sign-in.</Link></p>
    </div>);
};

ResetPasswordSucess.displayName = "ResetPasswordSuccess";