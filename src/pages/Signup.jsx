// page d'inscription

// packages
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [body, setBody] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        body
      );
      Cookies.set("token", response.data.token, { expires: 7 });
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage("Cette adresse email est déjà utilisée !");
      } else if (error.response.data.message === "Missing parameters") {
        setErrorMessage("Veuillez remplir tous les champs !");
      } else {
        setErrorMessage("Une erreur est survenue, veuillez réessayer !");
      }
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-content">
          <h2>S'inscrire</h2>
          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              name="username"
              onChange={(event) => {
                const newObj = { ...body };
                newObj.username = event.target.value;
                setBody(newObj);
              }}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(event) => {
                const newObj = { ...body };
                newObj.email = event.target.value;
                setBody(newObj);
              }}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(event) => {
                const newObj = { ...body };
                newObj.password = event.target.value;
                setBody(newObj);
              }}
            />
            <button>S'inscrire</button>
            {errorMessage && (
              <span className="error-message">{errorMessage}</span>
            )}
          </form>
          <a
            onClick={() => {
              navigate("/login");
            }}
          >
            Tu as déjà un compte ? Connecte-toi
          </a>
        </div>
      </div>
    </>
  );
};
export default Signup;
