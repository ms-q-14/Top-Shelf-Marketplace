import React from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import topshelfLogo from "../../assets/topshelfLogo.png";
import { useLogin } from "../../hooks/useLogin";
import axios from "axios";
import { useRef } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { login, error, isLoading } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(username, password);
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="login__page">
          <img src={topshelfLogo} alt="Topshelf Logo" className="login__logo" />
          <div className="login__container">
            <div className="login__container__content">
              <div className="login__greeting">
                <span>
                  <span style={{ color: "rgba(58, 217, 52, 0.91)" }}>
                    Welcome
                  </span>{" "}
                  Back
                </span>
                <div className="login__subtitle">
                  <span>Please enter your user and password</span>
                </div>
              </div>

              <div className="login__input">
                <span>Username</span>
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>

              <div className="login__input">
                <span>Password</span>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <div className="login__buttons">
                <button className="login__button" disabled={isLoading}>
                  <span>Login</span>
                </button>
                <button className="login__button" disabled={isLoading}>
                  <span>
                    <Link className="link" to="/register">
                      Register
                    </Link>
                  </span>
                </button>
              </div>
              {/* {error && <div className="error"> {error}</div>} */}

              <div className="login__forget__password">
                <a href="url">Forgot you password?</a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
