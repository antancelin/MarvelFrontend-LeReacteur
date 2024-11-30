// Packages
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

// CSS
import "./css/App.css";

// Pages
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Character from "./pages/Character";
import Comics from "./pages/Comics";
import Favorites from "./pages/Favorites";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/characters"
          element={<Characters isAuthenticated={isAuthenticated} />}
        />
        <Route path="/character/:id" element={<Character />} />
        <Route
          path="/comics"
          element={<Comics isAuthenticated={isAuthenticated} />}
        />
        <Route path="/favorites" element={<Favorites />} />
        <Route
          path="/signup"
          element={
            <Signup
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
