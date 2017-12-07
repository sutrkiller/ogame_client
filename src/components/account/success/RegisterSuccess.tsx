import * as React from 'react';

const RegisterSuccess = () => {
  return (
    <div className="text-message">
      <p className="text-center"><strong>Congratulations,<br/> you have successfully registered an account!</strong></p>
      <p className="text-center">Please <strong>verify your account</strong> using the link from the confirmation email we sent you. An unconfirmed account will be deleted in 30 days. We are sorry to bother you with this final step but it is necessary for the security reasons.</p>
    </div>
  );
};

export {RegisterSuccess};
