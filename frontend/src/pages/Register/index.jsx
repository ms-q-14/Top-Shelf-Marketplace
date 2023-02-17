import React from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import topshelfLogo from "../../assets/topshelfLogo.png";
import axios from "axios";
import { useRef } from "react";
import { useSignup } from "../../hooks/useSignup";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { signup, error, isLoading } = useSignup();

  const handleRegister = async (e) => {
    e.preventDefault();
    await signup({ email, password, username });
  };

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <form onSubmit={handleRegister}>
        <div className="login__page">
          <img src={topshelfLogo} alt="Topshelf Logo" className="login__logo" />
          <div className="login__container">
            <div className="login__container__content">
              <div className="login__greeting">
                <span>
                  <span style={{ color: "rgba(58, 217, 52, 0.91)" }}>
                    Sign up
                  </span>{" "}
                  to Topshelf
                </span>
                <div className="login__subtitle">
                  <span>Join Topshelf today</span>
                </div>
              </div>

              <div className="login__input">
                <span>Email</span>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
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
                <button disabled={isLoading} className="login__button">
                  <span>Register</span>
                </button>
              </div>

              <div className="login__forget__password">
                <Link className="link" to="/login">
                  <a href="url">Already have an account?</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
