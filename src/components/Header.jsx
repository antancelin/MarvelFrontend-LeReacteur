// header

// Packages
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

// images
import marvelLogo from "../assets/imgs/marvel-logo.png";

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <img
          src={marvelLogo}
          alt="logo-marvel"
          className="logo"
          onClick={() => {
            navigate("/");
          }}
        />
        <div className="header-buttons">
          <div className="menu-buttons">
            <button
              onClick={() => {
                navigate("/characters");
              }}
            >
              Characters
            </button>
            <button
              onClick={() => {
                navigate("/comics");
              }}
            >
              Comics
            </button>
            <button
              onClick={() => {
                navigate("/favorites");
              }}
            >
              Favorites
            </button>
          </div>

          <div className="session-buttons">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Signup
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;