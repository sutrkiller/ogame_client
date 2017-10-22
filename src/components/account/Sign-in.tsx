import * as React from 'react';
import {Link} from "react-router-dom";
import {ROUTE_FORGOT_PASSWORD, ROUTE_REGISTER} from "../../config/routes";

const SignIn = () => {
  return (
    <div>
      <h2>Sign in</h2>
      <form>
        <div>
          <label>Email</label>
          <input type="email"/>
        </div>
        <div>
          <label>Password</label>
          <input type="password"/>
        </div>
        <div>
          <input type="checkbox"/>
          <label>Remember me</label>
        </div>
        <button type="submit">Sign in</button>
        or
        <Link to={ROUTE_REGISTER} className="btn btn-outline-dark">Register</Link>
      </form>
      <span><Link to={ROUTE_FORGOT_PASSWORD}>Forgot password?</Link></span>
    </div>

  );
};

export {SignIn};
