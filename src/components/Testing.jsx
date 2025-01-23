import React, { useState } from "react";
import "./Test.css";

function Test() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div className="wrapper">
      <div className="form-container">
        {isRegister ? (
          <div className="form-content">
            <h2>Register</h2>
            <form>
              <div className="input-box">
                <input type="text" required />
                <label>Username</label>
              </div>
              <div className="input-box">
                <input type="email" required />
                <label>Email</label>
              </div>
              <div className="input-box">
                <input type="password" required />
                <label>Password</label>
              </div>
              <button type="submit">Sign Up</button>
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegister(false)}
                  className="anchor"
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        ) : (
          <div className="form-content">
            <h2>Login</h2>
            <form>
              <div className="input-box">
                <input type="email" required />
                <label>Email</label>
              </div>
              <div className="input-box">
                <input type="password" required />
                <label>Password</label>
              </div>
              <button type="submit">Login</button>
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegister(true)}
                  className="anchor"
                >
                  Register
                </span>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
