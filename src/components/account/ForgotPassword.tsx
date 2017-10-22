import * as React from 'react';
import {Link} from "react-router-dom";
import {ROUTE_REGISTER} from "../../config/routes";

const ForgotPassword = () => {
  return (
    <div>
      <h2>Forgot password</h2>
      <form>
        <div>
          <label>Email</label>
          <input type="email"/>
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export {ForgotPassword};
