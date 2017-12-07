import * as React from 'react';

export interface IForgotPasswordSuccessProps {
}

export const ForgotPasswordSucess: React.StatelessComponent<IForgotPasswordSuccessProps> = () => {
  return (
    <div className="text-message">
      <p className="text-center">An email with further instructions has been sent to your address.</p>
      <p className="text-center">Please follow the instructions to reset the password.</p>
    </div>
  );
};

ForgotPasswordSucess.displayName = "ForgotPassword";