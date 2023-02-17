import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import topshelfLogo from "../../assets/topshelfLogo.png";
import BrowseDropdown from "./BrowseDropdown";

function Navbar() {
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [showBrowseDropdown, setShowBrowseDropdown] = React.useState(false);
  const [profilePicture, setProfilePicture] = React.useState(topshelfLogo);
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const handleLogout = () => {
    logout();
  };

  const handleDropdown = () => {
    setDropdownVisible((prevDropdown) => !prevDropdown);
  };

  const handleBrowseMenu = () => {
    setShowBrowseDropdown((prevShow) => !prevShow);
  };

  React.useEffect(() => {
    if (state.user?.avatar) {
      setProfilePicture(state.user?.avatar + "?" + new Date().getTime());
    } else {
      setProfilePicture(topshelfLogo);
    }
  }, [state.user?.avatar]);

  return (
    <>
      <div className="navbar">
        <div className="navbar-wrapper">
          <div className="left">
            <Link className="link" to="/">
              {" "}
              <img className="logo" src="/images/logo.png" />
            </Link>
          </div>
          <div className="center">
            <input
              type="text"
              className="searchBar"
              placeholder="Search for a card, brand, etc."
            ></input>
          </div>
          <div className="right">
            <div className="browse" onClick={handleBrowseMenu}>
              Browse
            </div>

            <Link className="link" to="/auctions">
              <img className="navbar__streams" src="images/streaming.png" />
            </Link>

            <div className="sell">
              <Link className="link" to="/sell">
                Sell
              </Link>
            </div>
            {state.user && (
              <>
                <Link className="cart" to="/cart">
                  <img
                    className="navbar__cart"
                    src="/images/shoppingCart.png"
                  />
                </Link>
                <div className="notification">
                  <img
                    className="navbar__notification__bell"
                    src="images/notificationBell.png"
                  />
                  <span className="notificationNumber">0</span>
                </div>
                <div>
                  <div className="profile__cirle" onClick={handleDropdown}>
                    <img
                      className="profile__circle__img"
                      src={profilePicture}
                    />
                    {dropdownVisible && (
                      <div className="profile__dropdown__container">
                        <div>View Channel</div>
                        <div>
                          <Link className="profile" to="/profile">
                            View Profile
                          </Link>
                        </div>
                        <div>View Channel</div>
                        <div
                          className="dropdown__logout"
                          onClick={handleLogout}
                        >
                          {" "}
                          <span>
                            <i class="bi bi-box-arrow-left"></i>
                          </span>
                          Log Out
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!state.user && (
              <>
                <button className="loginButton">
                  <Link className="link" to="/login">
                    Log In
                  </Link>
                </button>
                <button className="registerButton">
                  <Link className="link" to="/register">
                    Register
                  </Link>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {showBrowseDropdown && <BrowseDropdown />}
    </>
  );
}

export default Navbar;
